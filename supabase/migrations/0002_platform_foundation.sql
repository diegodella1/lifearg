create table if not exists admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'analyst')),
  created_at timestamptz not null default now()
);

create table if not exists preference_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_snapshot_id uuid not null references profile_snapshots(id) on delete cascade,
  factor text not null,
  value jsonb not null,
  weight smallint not null check (weight between 0 and 5),
  origin text not null check (origin in ('tap', 'text', 'tradeoff')),
  confirmed boolean not null default true,
  extraction_confidence numeric check (extraction_confidence between 0 and 1),
  hard_constraint boolean not null default false
);

create table if not exists city_metrics (
  city_id text not null references cities(id) on delete cascade,
  metric_id text not null references metric_definitions(id),
  observation_id uuid not null references metric_observations(id),
  data_snapshot_id text not null references data_snapshots(id),
  normalized_value numeric check (normalized_value between 0 and 100),
  published_at timestamptz not null default now(),
  primary key (city_id, metric_id, data_snapshot_id)
);

create table if not exists product_events (
  id uuid primary key,
  anonymous_user_id uuid references anonymous_users(id) on delete set null,
  account_id uuid references auth.users(id) on delete set null,
  session_id uuid references search_sessions(id) on delete set null,
  event text not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  app_version text not null,
  consent_scope text not null check (consent_scope in ('essential', 'analytics')),
  properties jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null default now() + interval '90 days'
);

create table if not exists comparisons (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references auth.users(id) on delete cascade,
  anonymous_user_id uuid references anonymous_users(id) on delete cascade,
  run_id uuid not null references recommendation_runs(id) on delete cascade,
  city_ids text[] not null check (cardinality(city_ids) between 2 and 3),
  created_at timestamptz not null default now(),
  check (account_id is not null or anonymous_user_id is not null)
);

create table if not exists rejections (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references recommendation_runs(id) on delete cascade,
  city_id text not null references cities(id),
  account_id uuid references auth.users(id) on delete cascade,
  anonymous_user_id uuid references anonymous_users(id) on delete cascade,
  reason_code text not null check (reason_code in ('not_for_me', 'cost', 'climate', 'services', 'mobility', 'already_know', 'other')),
  created_at timestamptz not null default now(),
  check (account_id is not null or anonymous_user_id is not null)
);

create table if not exists result_shares (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references recommendation_runs(id) on delete cascade,
  account_id uuid references auth.users(id) on delete cascade,
  anonymous_user_id uuid references anonymous_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null default now() + interval '90 days',
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (account_id is not null or anonymous_user_id is not null)
);

create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references auth.users(id),
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into data_snapshots (id, manifest, checksum)
values ('ar-24-2026-07', '{"status":"legacy-editorial","cities":24}'::jsonb, 'legacy-ar-24-2026-07')
on conflict (id) do nothing;

insert into algorithm_versions (id, config, changelog, active)
values ('rules-v1.0.0', '{"status":"legacy"}'::jsonb, 'Baseline determinístico inicial', true)
on conflict (id) do nothing;

create index if not exists product_events_event_time_idx on product_events(event, occurred_at desc);
create index if not exists product_events_session_idx on product_events(session_id, occurred_at);
create index if not exists recommendation_runs_session_idx on recommendation_runs(session_id, created_at desc);
create index if not exists metric_observations_city_metric_idx on metric_observations(city_id, metric_id, observed_at desc);

alter table anonymous_users enable row level security;
alter table consent_records enable row level security;
alter table search_sessions enable row level security;
alter table profile_snapshots enable row level security;
alter table cities enable row level security;
alter table data_sources enable row level security;
alter table metric_definitions enable row level security;
alter table metric_observations enable row level security;
alter table data_snapshots enable row level security;
alter table algorithm_versions enable row level security;
alter table recommendation_runs enable row level security;
alter table recommendation_items enable row level security;
alter table feedback enable row level security;
alter table admin_members enable row level security;
alter table preference_snapshots enable row level security;
alter table city_metrics enable row level security;
alter table product_events enable row level security;
alter table comparisons enable row level security;
alter table rejections enable row level security;
alter table result_shares enable row level security;
alter table admin_audit_log enable row level security;

revoke all on anonymous_users, consent_records, search_sessions, profile_snapshots,
  data_sources, metric_definitions, metric_observations, data_snapshots,
  algorithm_versions, recommendation_runs, recommendation_items, feedback,
  preference_snapshots, city_metrics, product_events, comparisons, rejections,
  result_shares, admin_audit_log from anon, authenticated;

grant select on cities, data_sources, metric_definitions, data_snapshots, algorithm_versions, city_metrics to anon, authenticated;
grant select, update, delete on accounts_private to authenticated;
grant select, insert, update, delete on favorites to authenticated;
grant select on admin_members to authenticated;

create policy "published cities are public" on cities for select using (published = true);
create policy "catalog sources are public" on data_sources for select using (true);
create policy "metric definitions are public" on metric_definitions for select using (true);
create policy "snapshots are public" on data_snapshots for select using (true);
create policy "algorithm versions are public" on algorithm_versions for select using (true);
create policy "published metrics are public" on city_metrics for select using (true);
create policy "member reads own role" on admin_members for select using (auth.uid() = user_id);

create or replace view dashboard_event_funnel
with (security_invoker = true) as
select date_trunc('day', occurred_at) as day, event, count(*)::bigint as event_count
from product_events
where consent_scope = 'analytics' and expires_at > now()
group by 1, 2;

revoke all on dashboard_event_funnel from anon, authenticated;
