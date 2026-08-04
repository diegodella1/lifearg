alter table product_events
  add column if not exists consent_policy_version text not null default 'legacy';

create index if not exists consent_records_actor_time_idx
  on consent_records(anonymous_user_id, recorded_at desc);

create index if not exists search_sessions_account_time_idx
  on search_sessions(account_id, created_at desc)
  where account_id is not null;

update algorithm_versions
set config = config || '{"origin_processing":"transient_not_persisted","privacy_policy_version":"2026-08-01"}'::jsonb
where id = 'rules-v1.1.0';
