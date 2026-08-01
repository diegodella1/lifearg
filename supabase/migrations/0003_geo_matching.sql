insert into data_snapshots (id, manifest, checksum)
values ('ar-24-2026-08', '{"status":"editorial-with-georef-centroids","cities":24,"location_source":"Servicio Georef"}'::jsonb, 'ar-24-2026-08-georef-v1')
on conflict (id) do nothing;

update algorithm_versions set active = false where active = true;

insert into algorithm_versions (id, config, changelog, active)
values (
  'rules-v1.1.0',
  '{"distance":{"nearby_km":200,"regional_km":700,"far_km":1500,"max_penalty":8},"origin_persistence":"local_only","rental_adjustment":"inactive_until_provider_authorized"}'::jsonb,
  'Agrega distancia opcional explicable y contrato de ajuste suave de alquiler',
  true
)
on conflict (id) do update set config = excluded.config, changelog = excluded.changelog, active = true;
