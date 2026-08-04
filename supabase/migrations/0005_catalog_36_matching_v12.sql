insert into data_snapshots (id, manifest, checksum)
values (
  'ar-36-2026-08',
  '{"status":"editorial-expansion-with-georef-centroids","cities":36,"sources":20,"location_source":"Servicio Georef"}'::jsonb,
  'ar-36-2026-08-georef-v1'
)
on conflict (id) do nothing;

update algorithm_versions set active = false where active = true;

insert into algorithm_versions (id, config, changelog, active)
values (
  'rules-v1.2.0',
  '{"profile":{"work_mode":"weighted","car_access":"weighted","story_weights":"preserved"},"distance":{"nearby_km":200,"regional_km":700,"far_km":1500,"max_penalty":8},"origin_processing":"transient_not_persisted","privacy_policy_version":"2026-08-01"}'::jsonb,
  'Hace efectivas modalidad laboral, acceso a auto, presupuesto y preferencias extraídas; amplía catálogo a 36 ciudades',
  true
)
on conflict (id) do update set config = excluded.config, changelog = excluded.changelog, active = true;
