# Matching v1

## Entrada

Perfil validado: intención, modalidad laboral, rango presupuestario, hogar, auto y nueve pesos `0..5`. “Desconocido” no equivale a peso cero: solo elecciones confirmadas modifican pesos base.

## Cálculo

1. Presupuesto ajustado filtra ciudades con asequibilidad menor a 70.
2. Cada factor produce compatibilidad `0..100`.
3. `match = round(sum(compatibilidad × peso) / sum(pesos))`.
4. Confianza es media geométrica de calidad de fuente, frescura, cobertura y ajuste territorial.
5. Orden: match, confianza, ID estable.
6. Diversificación admite máximo dos ciudades del mismo arquetipo antes del quinto lugar.
7. Tres razones son las mayores contribuciones respaldadas; trade-offs son compatibilidades menores a 65.

Mismos perfil, snapshot y versión producen resultado idéntico.

## Cambios

Todo cambio de pesos, umbrales o transformaciones crea nueva `algorithm_version`, actualiza golden tests y se compara contra los 30 escenarios etiquetados. Nunca ajustar producción directamente por CTR.
