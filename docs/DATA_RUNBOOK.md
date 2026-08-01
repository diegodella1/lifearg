# Runbook de datos

## Publicación

1. Descargar raw batch y conservar archivo inmutable con checksum.
2. Validar licencia, esquema, conteos, duplicados, nulos y cambios abruptos.
3. Resolver cada observación contra ID Georef y guardar granularidad real.
4. Cargar staging; ejecutar quality gate y revisión editorial.
5. Crear manifest/checksum de snapshot y publicar en transacción única.
6. Mantener snapshot previo activo hasta completar smoke test de ranking.

## Frescura

- alquiler/costo: 45 días;
- OSM: 90 días;
- clima: 12 meses;
- población/geometría: 24 meses o nueva publicación;
- conectividad: siempre mostrar fecha; ENACOM 2019 permanece proxy de baja confianza.

## Incidentes

- Fuente caída: conservar último snapshot, reducir frescura y alertar dashboard.
- Cambio de esquema: bloquear publicación; nunca completar nulos con cero.
- Outlier: cuarentena y revisión con evidencia.
- Error material publicado: retirar snapshot, reactivar anterior y registrar corrección.
