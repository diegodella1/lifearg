create extension if not exists pgcrypto;
create extension if not exists postgis;

create table anonymous_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table accounts_private (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table consent_records (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id uuid references anonymous_users(id) on delete cascade,
  account_id uuid references auth.users(id) on delete cascade,
  purpose text not null check (purpose in ('essential','analytics','qa_text','marketing')),
  policy_version text not null,
  granted boolean not null,
  recorded_at timestamptz not null default now()
);

create table search_sessions (
  id uuid primary key default gen_random_uuid(),
  anonymous_user_id uuid references anonymous_users(id) on delete cascade,
  account_id uuid references auth.users(id) on delete set null,
  intent text not null,
  status text not null default 'started',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table profile_snapshots (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references search_sessions(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table cities (
  id text primary key,
  official_id text,
  name text not null,
  province text not null,
  region text not null,
  centroid geography(point,4326),
  published boolean not null default false
);

create table data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  license text,
  geographic_granularity text not null
);

create table metric_definitions (
  id text primary key,
  unit text not null,
  polarity text not null,
  stale_after interval not null,
  description text not null
);

create table metric_observations (
  id uuid primary key default gen_random_uuid(),
  city_id text not null references cities(id),
  metric_id text not null references metric_definitions(id),
  source_id uuid not null references data_sources(id),
  value jsonb not null,
  observed_at timestamptz not null,
  ingested_at timestamptz not null default now(),
  source_quality smallint not null check (source_quality between 0 and 100),
  geographic_fit smallint not null check (geographic_fit between 0 and 100),
  evidence_url text,
  expires_at timestamptz
);

create table data_snapshots (
  id text primary key,
  published_at timestamptz not null default now(),
  manifest jsonb not null,
  checksum text not null unique
);

create table algorithm_versions (
  id text primary key,
  config jsonb not null,
  changelog text not null,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references search_sessions(id) on delete cascade,
  profile_snapshot_id uuid not null references profile_snapshots(id),
  data_snapshot_id text not null references data_snapshots(id),
  algorithm_version_id text not null references algorithm_versions(id),
  confidence smallint not null,
  created_at timestamptz not null default now()
);

create table recommendation_items (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references recommendation_runs(id) on delete cascade,
  city_id text not null references cities(id),
  rank smallint not null check (rank between 1 and 5),
  match_score smallint not null check (match_score between 0 and 100),
  confidence smallint not null check (confidence between 0 and 100),
  contributions jsonb not null,
  tradeoffs jsonb not null,
  unique(run_id, rank), unique(run_id, city_id)
);

create table favorites (
  account_id uuid not null references auth.users(id) on delete cascade,
  city_id text not null references cities(id),
  created_at timestamptz not null default now(),
  primary key(account_id, city_id)
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references recommendation_runs(id) on delete cascade,
  city_id text references cities(id),
  reason_code text,
  relevance smallint check (relevance between 1 and 5),
  created_at timestamptz not null default now()
);

alter table accounts_private enable row level security;
alter table favorites enable row level security;
create policy "account reads itself" on accounts_private for select using (auth.uid() = user_id);
create policy "account manages favorites" on favorites for all using (auth.uid() = account_id) with check (auth.uid() = account_id);

create view dashboard_city_health as
select c.id, c.name, c.province, count(mo.id) as observation_count,
       count(mo.id) filter (where mo.expires_at is null or mo.expires_at > now()) as fresh_count
from cities c left join metric_observations mo on mo.city_id = c.id
where c.published = true group by c.id;
