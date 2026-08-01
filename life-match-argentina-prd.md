# Life Match Argentina

## Product Requirements Document (PRD)

**Estado:** Borrador para alineación  
**Versión:** 1.0  
**Fecha:** 31 de julio de 2026  
**Responsables sugeridos:** Product, Design, Data, Engineering  
**Nombre de trabajo:** Life Match Argentina  

---

## 1. Resumen ejecutivo

Life Match Argentina es un motor de decisión asistido por IA que ayuda a una persona a descubrir en qué ciudades argentinas podría vivir mejor según su realidad y la vida que desea construir.

El producto combina un onboarding breve y entretenido, datos territoriales verificables, preferencias explícitas y trade-offs para devolver un conjunto pequeño de futuros posibles: ciudades compatibles, motivos del match, sacrificios relevantes, nivel de confianza y herramientas para comparar. No pretende declarar cuál es “la mejor ciudad”, sino cuál parece más adecuada para una persona, con los datos disponibles.

El MVP debe responder en menos de un minuto:

> “Con mi presupuesto, trabajo, familia y preferencias, ¿qué ciudades argentinas debería considerar y por qué?”

El sistema tendrá dos superficies:

1. **Producto público B2C:** onboarding, resultados, fichas, comparación, favoritos y feedback.
2. **Dashboard interno:** calidad del funnel, demanda por estilo de vida, aceptación de recomendaciones, desempeño de ciudades, calidad/frescura de datos y aprendizaje del motor.

La IA interpreta lenguaje natural y explica resultados. El ranking inicial será determinístico, versionado, auditable y basado en reglas; no dependerá de un LLM para calcular scores.

---

## 2. Visión

### 2.1 Visión de producto

Convertirse en la referencia confiable para decidir dónde vivir, comenzando por Argentina y evolucionando desde el descubrimiento hacia la planificación y ejecución de una mudanza.

### 2.2 Promesa

**Descubrí, en menos de un minuto, qué ciudades argentinas encajan con la vida que querés y qué tendrías que resignar en cada una.**

### 2.3 Principios

- **Compatibilidad, no ranking universal.** Una ciudad puede ser excelente para un perfil y mala para otro.
- **Futuros posibles, no fichas frías.** Presentar cómo sería la vida cotidiana, respaldada por evidencia.
- **Trade-offs explícitos.** Toda recomendación debe mostrar beneficios y renuncias.
- **Transparencia.** Explicar factores, fuentes, fecha y confianza del resultado.
- **Revelación progresiva.** Pedir lo mínimo para dar valor y profundizar después.
- **Privacidad por diseño.** Datos mínimos, seudonimizados, controlables y agregados.
- **Incertidumbre visible.** Dato ausente o débil no equivale a cero.
- **Aprendizaje medible.** Cada versión del motor debe poder evaluarse contra la anterior.

---

## 3. Problema

### 3.1 Problema del usuario

Elegir una ciudad implica combinar información fragmentada y difícil de comparar: alquiler, servicios, internet, clima, salud, educación, movilidad, escala urbana y estilo de vida. Las fuentes oficiales suelen estar separadas; las recomendaciones sociales son subjetivas; y los portales inmobiliarios responden “qué propiedad hay”, no “dónde viviría mejor yo”.

El usuario enfrenta cuatro fricciones:

- no conoce todas las alternativas relevantes;
- no sabe cómo ponderar variables incompatibles;
- encuentra información desactualizada o con granularidad desigual;
- confunde aspiraciones declaradas con necesidades reales y restricciones duras.

### 3.2 Problema del producto

Un directorio es fácil de copiar y tiene baja recurrencia. El activo defendible debe ser el sistema que relaciona perfiles, preferencias, trade-offs, recomendaciones y feedback, permitiendo aprender qué predice interés y, más adelante, satisfacción.

### 3.3 Oportunidad

Construir un producto que:

- reduzca una búsqueda de semanas a una shortlist explicable;
- descubra opciones fuera del conjunto mental del usuario;
- capture señales sobre intención y aceptación sin invadir privacidad;
- cree un dataset propio sobre preferencias agregadas y compatibilidad persona-lugar.

---

## 4. Objetivos y no objetivos

### 4.1 Objetivos del MVP

1. Entregar un top 5 personalizado y creíble en menos de 60 segundos.
2. Lograr que el usuario entienda por qué una ciudad encaja y qué compromisos implica.
3. Validar que las recomendaciones generan acciones de alta intención: abrir, comparar, guardar o aceptar.
4. Construir una base de datos reproducible, versionada y con trazabilidad de fuentes.
5. Medir preferencias, rechazos y comportamiento de forma seudónima.
6. Identificar los perfiles y variables donde el motor tiene mayor o menor confianza.

### 4.2 No objetivos del MVP

- Cubrir todos los pueblos, barrios o propiedades del país.
- Recomendar una vivienda específica.
- Garantizar seguridad, costo futuro, disponibilidad de servicios o satisfacción.
- Usar machine learning opaco para el ranking.
- Inferir migraciones reales a partir de búsquedas.
- Reemplazar asesoramiento médico, financiero, legal, educativo o migratorio.
- Construir una red social, marketplace inmobiliario o asistente integral de mudanza.
- Monetizar vendiendo perfiles individuales o datos identificables.
- Presentar scores de baja calidad como hechos objetivos.

---

## 5. Hipótesis

### Hipótesis de valor

- H1: una recomendación personalizada es más útil que navegar un directorio.
- H2: mostrar trade-offs aumenta la confianza más que mostrar un porcentaje aislado.
- H3: 6–8 señales iniciales alcanzan para producir una shortlist razonable.
- H4: una recompensa temprana seguida de refinamiento mejora la finalización.
- H5: los usuarios aceptan descubrir ciudades desconocidas cuando la explicación es concreta.

### Hipótesis de crecimiento

- H6: perfiles y resultados compartibles generan adquisición orgánica.
- H7: guardar, comparar y recibir actualizaciones justifican captura de email posterior al valor.

### Hipótesis de defensibilidad

- H8: razones de descarte y señales de aceptación mejoran el modelo más que el volumen bruto de clics.
- H9: el histórico versionado permite medir mejoras reales del matching.

---

## 6. Personas prioritarias

### P1 — Profesional remoto con ingresos dolarizados

**Contexto:** 25–45 años, trabaja remoto, solo o en pareja, evalúa salir de una gran ciudad.  
**Necesita:** internet confiable, presupuesto razonable, vida social, clima y acceso a naturaleza.  
**Tensión:** quiere tranquilidad sin quedar aislado.  
**Señal de éxito:** guarda o compara una ciudad que no consideraba.

### P2 — Familia en evaluación de mudanza

**Contexto:** 30–50 años, hijos actuales o planificados.  
**Necesita:** salud, educación, seguridad percibida, vivienda y logística cotidiana.  
**Tensión:** prioriza estabilidad, pero no quiere sacrificar oportunidades.  
**Señal de éxito:** entiende rápidamente qué opciones fallan restricciones duras.

### P3 — Habitante de metrópolis que busca calidad de vida

**Contexto:** vive en AMBA, Córdoba, Rosario u otra gran ciudad; puede trabajar remoto o híbrido.  
**Necesita:** menor fricción urbana, verde, menor costo o menor tiempo de viaje.  
**Tensión:** idealiza la vida tranquila pero teme perder servicios y vínculos.  
**Señal de éxito:** compara un futuro urbano, uno intermedio y uno tranquilo.

### P4 — Explorador de mudanza temprana

**Contexto:** curiosidad alta, intención y fecha inciertas.  
**Necesita:** inspiración y bajo compromiso.  
**Tensión:** no desea registrarse ni completar un formulario largo.  
**Señal de éxito:** completa el flujo, comparte o vuelve.

### Persona secundaria futura — Jubilación o relocalización asistida

Requiere mayor precisión en salud, accesibilidad, cercanía familiar y servicios; queda fuera del primer segmento de optimización.

---

## 7. Jobs to Be Done

### Job principal

> Cuando estoy considerando cambiar mi forma de vivir, quiero descubrir ciudades compatibles con mis necesidades reales y entender sus trade-offs, para decidir cuáles investigar sin perder semanas reuniendo información.

### Jobs funcionales

- Filtrar ciudades que no cumplen restricciones esenciales.
- Descubrir alternativas desconocidas.
- Comparar costos, clima, conectividad, servicios y estilo de vida.
- Explicar por qué una recomendación cambió al modificar una prioridad.
- Guardar una shortlist para continuar más adelante.

### Jobs emocionales

- Sentirme entendido, no evaluado.
- Reducir ansiedad ante una decisión grande.
- Imaginar una vida concreta, no interpretar una planilla.
- Confiar en que no se esconden desventajas.

### Jobs sociales

- Compartir opciones con pareja o familia.
- Explicar una preferencia mediante evidencia común.
- Pedir opinión sobre una shortlist, no sobre cientos de lugares.

---

## 8. Alcance del MVP

### 8.1 Cobertura geográfica

**Recomendación:** lanzar con 40–60 ciudades, elegidas por diversidad y calidad mínima de datos, no con todas las localidades de más de 10.000 habitantes.

Criterios de inclusión:

- población y geometría identificables;
- disponibilidad mínima de métricas obligatorias;
- diversidad regional, climática y de escala;
- presencia de servicios esenciales;
- interés plausible para relocalización;
- revisión humana básica.

La población superior a 10.000 y la presencia de McDonald’s pueden funcionar como señales de masa crítica, pero no como regla de producto. Una cadena comercial es un proxy sesgado y excluiría destinos valiosos.

### 8.2 Funciones incluidas

- Landing con propuesta y CTA único.
- Onboarding rápido con entrada conversacional opcional y respuestas por tap.
- Confirmación de preferencias interpretadas mediante chips editables.
- Restricciones duras y prioridades ponderadas.
- Top 5 inicial con compatibilidad, confianza, razones y trade-offs.
- Ficha resumida de ciudad con fuentes y fecha de actualización.
- Comparación de hasta 3 ciudades.
- Guardar favoritos localmente; email opcional para sincronizar o recibir novedades.
- Rechazo con motivo rápido.
- Refinamiento posterior al resultado.
- Compartir perfil/resultado sin exponer datos sensibles.
- Dashboard interno de producto, demanda, ciudades, matching y datos.
- Pipeline de ingesta, normalización y publicación de métricas.

### 8.3 Fuera del MVP

- Barrios y propiedades.
- Chat abierto de planificación prolongada.
- Reservas, leads inmobiliarios o pagos.
- Predicción de satisfacción posmudanza.
- Apps nativas.
- Recomendaciones internacionales.
- Personalización colaborativa de pareja/familia.
- Alertas automáticas de alquileres.

### 8.4 Requisitos de lanzamiento

- Cada ciudad debe tener métricas obligatorias, fuente, fecha y nivel de confianza.
- Toda recomendación debe poder reconstruirse con `algorithm_version` y `data_snapshot_id`.
- Ningún resultado debe depender exclusivamente de texto generado por IA.
- Debe existir una opción visible para omitir preguntas sensibles.
- El dashboard no debe permitir reidentificar usuarios a partir de segmentos pequeños.

---

## 9. Experiencia de onboarding

### 9.1 Objetivo UX

Crear una experiencia “quiz conversacional”, no un formulario administrativo. Tiempo objetivo: 30–60 segundos hasta el primer resultado.

### 9.2 Flujo recomendado

#### Paso 0 — Promesa

**Título:** “¿En qué ciudad argentina vivirías mejor?”  
**Subtítulo:** “Contanos qué vida querés. Te mostramos opciones, razones y lo que tendrías que resignar.”  
**CTA:** “Descubrir mi match”  
**Microcopy:** “45 segundos · sin registro”

#### Paso 1 — Intención

Una selección:

- Estoy explorando.
- Quiero mudarme este año.
- Quiero irme de mi ciudad actual.
- Estoy comparando lugares concretos.

#### Paso 2 — La vida deseada

Entrada primaria:

> “Contame cómo sería un buen día para vos y qué no puede faltar.”

El usuario puede escribir o elegir “Prefiero responder rápido”. Ejemplo visible, corto y no prescriptivo.

#### Paso 3 — Interpretación asistida

El LLM convierte el texto en preferencias estructuradas y muestra 5–8 chips:

`Remoto` `Clima fresco` `Naturaleza alta` `Con perro` `Caminable` `Vida nocturna baja`

El usuario puede confirmar, borrar o tocar un chip para cambiar intensidad. La UI nunca muestra una conclusión sensible no expresada.

#### Paso 4 — Datos mínimos por tap

Solo lo que no surgió del texto:

1. presupuesto mensual disponible para vivienda y vida cotidiana, en rangos y moneda;
2. modalidad laboral;
3. composición del hogar e hijos;
4. auto: sí, no o preferiría no depender;
5. ciudad/región actual, opcional;
6. máximo de calor/frío tolerable, si es prioritario.

#### Paso 5 — Trade-offs adaptativos

Dos o tres comparaciones elegidas por mayor incertidumbre o capacidad de separar resultados:

- menor costo vs. mejor conectividad aérea;
- más naturaleza vs. más oferta cultural;
- más espacio vs. mayor caminabilidad.

Incluir “Ambos importan” y “No sé”. Evitar duelos falsos cuando los factores no son realmente excluyentes.

#### Paso 6 — Resultado temprano

Mostrar top 3 inmediatamente y permitir expandir a top 5:

- compatibilidad;
- nivel de confianza;
- tres razones principales;
- dos trade-offs;
- presupuesto estimado como rango;
- CTA “Comparar” y “Afinar resultados”.

#### Paso 7 — Refinamiento opcional

Preguntas sobre aeropuerto, salud, educación, mascotas, cultura, actividades y tamaño urbano. Cada respuesta recalcula el ranking y muestra qué cambió.

#### Paso 8 — Captura de email posterior al valor

Solo para guardar entre dispositivos, recibir cambios o exportar. Nunca bloquear el top inicial.

### 9.3 Reglas de interacción

- Una decisión principal por pantalla en móvil.
- Sin dropdowns largos ni campos exactos innecesarios.
- Barra de progreso por tiempo (“30 segundos”), no por 25 pasos.
- Botón “No me importa” en preferencias blandas.
- Opción “Prefiero no responder” para ingresos, hogar y ubicación.
- Explicar por qué se pregunta una señal sensible.
- Guardado automático de sesión anónima.
- Resultado parcial utilizable si el usuario abandona luego de las señales mínimas.

### 9.4 Personalización adaptativa

El motor de preguntas elige la siguiente pregunta por:

1. datos faltantes requeridos;
2. reducción esperada de incertidumbre entre ciudades candidatas;
3. sensibilidad de la recomendación a ese factor;
4. costo cognitivo y sensibilidad del dato.

### 9.5 Fallos y recuperación

- Si la IA no interpreta el texto: conservarlo, pedir confirmación y ofrecer flujo por taps.
- Si faltan datos críticos: mostrar resultados preliminares con menor confianza.
- Si ninguna ciudad cumple restricciones: explicar el conflicto y permitir relajar una condición.
- Si dos señales se contradicen: preguntar solo por la contradicción de mayor impacto.

---

## 10. Experiencia de resultados

### 10.1 Tarjeta de match

Cada tarjeta muestra:

- ciudad y provincia;
- `Match 86/100`;
- confianza: alta, media o baja;
- “Por qué encaja”: 3 factores;
- “Lo que resignás”: 1–2 factores;
- rango de costo, con fecha y fuente;
- etiqueta de descubrimiento si el usuario no la conocía;
- acciones: ver vida, comparar, guardar, descartar.

### 10.2 Narrativa “una vida posible”

Texto de 60–100 palabras generado a partir de facts aprobados. Debe diferenciar hechos de inferencias y evitar afirmaciones absolutas.

Ejemplo conceptual:

> “Tandil combina escala intermedia, servicios urbanos y acceso cercano a naturaleza. Para tu perfil remoto, suma conectividad disponible y distancias cotidianas moderadas. El costo estimado encaja en tu rango, aunque la oferta aérea y la vida nocturna son más limitadas que en una capital provincial.”

### 10.3 Explicabilidad

“Cómo llegamos a este match” abre:

- contribuciones positivas;
- penalizaciones;
- restricciones cumplidas o fallidas;
- calidad y fecha de cada dato;
- versión del modelo;
- controles para cambiar prioridades.

### 10.4 Comparador

Hasta tres ciudades con:

- compatibilidad personal;
- costo;
- remoto/conectividad;
- clima;
- servicios;
- movilidad;
- lifestyle;
- confianza y datos faltantes;
- mejor para / cuidado con.

No usar falsa precisión: mostrar rangos, ordinales y confianza cuando corresponda.

---

## 11. Motor de matching

### 11.1 Diseño general

Pipeline:

1. capturar respuestas y texto;
2. convertir texto a preferencias estructuradas;
3. validar contra esquema y pedir confirmación;
4. aplicar filtros duros;
5. normalizar métricas de ciudad;
6. calcular score de compatibilidad;
7. ajustar por confianza/cobertura de datos;
8. diversificar el top para evitar cinco resultados casi idénticos;
9. producir razones desde contribuciones reales;
10. guardar snapshot de entrada, resultado y versiones.

### 11.2 Rol de la IA

**Sí:** extracción de preferencias, clasificación de texto, explicación controlada y preguntas adaptativas.  
**No:** inventar datos, decidir el score sin reglas, reemplazar fuentes o hacer inferencias sensibles.

La salida del LLM debe ser JSON validado, con valores permitidos, evidencia textual y confianza de extracción. Si la confianza es baja, no aplicar la preferencia sin confirmación.

### 11.3 Tipos de preferencia

- **Restricción dura:** incumplir excluye o dispara una advertencia crítica. Ej.: presupuesto máximo, hospital requerido.
- **Preferencia ponderada:** mejora o reduce compatibilidad. Ej.: naturaleza, cultura.
- **Indiferencia:** peso cero.
- **Desconocida:** no debe interpretarse como indiferencia.
- **Trade-off:** modifica pesos relativos entre dos dimensiones.

### 11.4 Fórmula base

Para usuario `u` y ciudad `c`:

```text
raw_match(u,c) = Σ [w(u,i) × compatibility(u,c,i)] / Σ |w(u,i)|

compatibility ∈ [0,1]
weight ∈ [0,5]

final_match = 100 × raw_match × confidence_adjustment − soft_penalties
```

Las restricciones duras se evalúan antes del score. Si no hay suficientes ciudades, el sistema puede mostrar una opción que incumple una restricción solo en una sección separada, claramente etiquetada: “Casi encaja, salvo por…”.

### 11.5 Funciones de compatibilidad

- **Más es mejor:** fibra, acceso a servicios.
- **Menos es mejor:** costo, tiempo a aeropuerto.
- **Objetivo/rango:** temperatura ideal, tamaño urbano.
- **Binaria o categórica:** costa, universidad, hospital de complejidad definida.
- **Distancia:** penalización gradual fuera del rango deseado.

Las transformaciones y umbrales se guardan en configuración versionada, no en código disperso.

### 11.6 Confianza

Separar `match_score` de `confidence_score`.

```text
confidence = source_quality × freshness × coverage × geographic_fit
```

- `source_quality`: oficial/verificada > abierta colaborativa > manual > proxy.
- `freshness`: decae según la volatilidad de la métrica.
- `coverage`: proporción de señales del usuario con datos válidos.
- `geographic_fit`: qué tan bien la granularidad representa la ciudad real.

No multiplicar de forma agresiva el match por confianza si eso oculta buenas opciones. En MVP, usar la confianza para ordenar empates, advertir y limitar claims.

### 11.7 Diversidad del ranking

Aplicar una rerregla posterior para evitar redundancia, preservando relevancia. El top 5 debería incluir, cuando los scores sean cercanos:

- la mejor coincidencia;
- una opción más accesible;
- una opción de mayor servicio;
- una opción “descubrimiento”;
- una alternativa que exponga un trade-off útil.

### 11.8 Calibración inicial

1. Pesos explícitos definidos por producto.
2. Panel de 20–30 escenarios sintéticos con resultados esperados.
3. Evaluación ciega por expertos/locales para plausibilidad.
4. Beta con feedback de aceptación y descarte.
5. Ajustes solo con experimentos versionados.

No entrenar un modelo predictivo hasta contar con suficiente feedback de calidad y una definición válida de éxito.

---

## 12. Sistema de scoring de ciudades

### 12.1 Dimensiones MVP

| Dimensión | Métricas candidatas | Tipo | Riesgo principal |
|---|---|---|---|
| Asequibilidad | alquiler, costo cotidiano estimado | rango/índice | volatilidad y falta de fuente homogénea |
| Trabajo remoto | tecnologías disponibles, velocidad agregada, coworkings | índice | disponibilidad no equivale a calidad domiciliaria |
| Clima | temperatura, humedad, precipitación, extremos | histórico | resolución espacial |
| Servicios | salud, educación, farmacia, supermercado | acceso/densidad | POI incompletos y complejidad no equivalente |
| Movilidad | aeropuerto, transporte, dependencia del auto | distancia/índice | frecuencia real de servicios |
| Escala urbana | población, densidad, masa crítica | rango | límites administrativos inconsistentes |
| Naturaleza | parques, costa, montaña, senderos | acceso/diversidad | tags y accesibilidad real |
| Vida social/cultural | restaurantes, cafés, cines, teatros, eventos | densidad/diversidad | sesgo de cobertura |
| Familia | escuelas, pediatría, parques, servicios | índice | calidad no inferible solo por conteo |
| Tranquilidad | densidad, tránsito/proxies, nocturnidad | proxy | no confundir proxy con ruido o seguridad |

### 12.2 Normalización

- Preferir percentiles dentro del universo de ciudades MVP.
- Aplicar winsorization para outliers.
- Usar tasas per cápita solo donde tengan sentido; combinar con mínimos absolutos.
- Separar cantidad, diversidad, accesibilidad y calidad.
- Documentar límites geográficos utilizados para cada conteo.
- No mezclar municipio, localidad censal y aglomerado sin una tabla de correspondencias.

### 12.3 Datos faltantes

- `null` significa desconocido, nunca cero.
- No imputar métricas sensibles o volátiles para publicación.
- Si se imputa para cálculo exploratorio, guardar método y no mostrarlo como observado.
- Penalizar confianza, no necesariamente compatibilidad.
- Mostrar “sin datos suficientes” cuando corresponda.

### 12.4 Ficha de métrica

Cada métrica debe registrar:

- definición y unidad;
- fuente y licencia;
- URL o recurso;
- granularidad territorial;
- fecha observada y fecha de ingesta;
- transformación;
- intervalo de actualización;
- responsable;
- calidad y limitaciones.

### 12.5 Seguridad

No habrá un score nacional único de seguridad en MVP salvo que pueda sustentarse con una fuente comparable. Puede incorporarse por jurisdicción o mediante percepción declarada, siempre rotulada. Contar comisarías o noticias no es un sustituto válido de riesgo delictivo.

### 12.6 Costos y alquileres

Es el mayor gap del MVP. Estrategia escalonada:

1. piloto manual con rangos para ciudades seleccionadas;
2. registrar tamaño de muestra, fecha y metodología;
3. permitir correcciones internas y detectar outliers;
4. explorar acuerdos/licencias con marketplaces;
5. nunca scrapear o republicar contenido contra términos de servicio.

---

## 13. Fuentes públicas y APIs

La siguiente matriz es una base de investigación, no una garantía contractual. Antes de producción deben revisarse términos, límites, atribución y continuidad.

| Fuente | Uso propuesto | Acceso | Consideraciones |
|---|---|---|---|
| Georef Argentina | IDs, nombres, jerarquías, geometrías y coordenadas | API y descargas | fuente canónica territorial; resolver diferencias entre entidad/localidad/municipio |
| INDEC Censo 2022 | población, hogares y composición | archivos/cuadros | mapear unidades censales; periodicidad baja |
| Datos Argentina / ENACOM | tecnologías de conectividad por localidad | CSV/XLS/JSON | disponibilidad declarada; validar fecha y granularidad |
| Open-Meteo Historical | históricos climáticos por coordenada | API | reanálisis; documentar modelo y resolución |
| OpenStreetMap / Overpass | POI, parques, comercio, salud, educación y red vial | API/dumps | cobertura desigual; ODbL, atribución y política de uso |
| OurAirports | aeropuertos y coordenadas | CSV | dominio público, sin garantía; validar operación comercial aparte |
| Datos provinciales/municipales | salud, educación, transporte, delitos donde existan | variable | heterogeneidad y mantenimiento alto |
| Aportes editoriales verificados | costo, cortes, matices locales | consola interna | metodología, evidencia y caducidad obligatorias |

Fuentes verificadas al redactar este PRD:

- [Georef — referencia y OpenAPI](https://www.argentina.gob.ar/georef/referencia-completa-de-la-api)
- [Georef — descarga de bases completas](https://www.argentina.gob.ar/georef/descarga-de-la-base-completa)
- [INDEC — resultados del Censo 2022](https://www.indec.gob.ar/indec/web/Nivel4-Tema-2-41-165?lang=es)
- [ENACOM — conectividad al servicio de Internet](https://www.datos.gob.ar/dataset/enacom-conectividad-al-servicio-internet)
- [Open-Meteo — Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api)
- [OpenStreetMap — licencia ODbL](https://www.openstreetmap.org/copyright)
- [OurAirports — descargas abiertas](https://ourairports.com/data/)
- [Ley argentina 25.326 — texto actualizado](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion)

### 13.1 Política de ingesta

- Priorizar descargas batch sobre llamadas de usuario en tiempo real.
- Conservar raw data inmutable y artefactos transformados.
- Validar esquema, conteos, nulos, duplicados y cambios abruptos.
- Publicar métricas solo después de un quality gate.
- Mantener atribución visible y registro de licencias.
- Configurar alertas por fallos, cambios de esquema y datos vencidos.

---

## 14. Modelo de datos

### 14.1 Entidades principales

#### Identidad y consentimiento

- `anonymous_users`: ID seudónimo, primera/última visita, país/región aproximada si hay consentimiento.
- `accounts`: email y autenticación opcionales, separados de analítica.
- `consent_records`: propósito, versión, estado, timestamp, origen.

#### Sesión y perfil

- `search_sessions`: inicio, finalización, intención, canal, estado.
- `profile_snapshots`: hogar, trabajo, presupuesto, movilidad y horizonte en ese momento.
- `preference_snapshots`: factor, valor, peso, origen, confianza de extracción.
- `tradeoff_answers`: par, elección, fuerza y contexto.
- `free_text_inputs`: texto original solo si existe consentimiento específico; de lo contrario, procesar y descartar.

#### Catálogo territorial

- `cities`: ID interno, IDs oficiales, nombre, provincia, centroide, geometría, estado de publicación.
- `city_aliases`: nombres alternativos.
- `territorial_crosswalks`: relaciones entre localidad, localidad censal, municipio y aglomerado.
- `city_metrics`: valor actual publicado por ciudad y métrica.
- `metric_observations`: histórico de observaciones.
- `metric_definitions`: unidad, polaridad, normalización y caducidad.
- `data_sources`: proveedor, licencia, URL, términos y granularidad.
- `data_ingestion_runs`: estado, versión, checks y errores.
- `data_snapshots`: conjunto reproducible usado para ranking.

#### Recomendación

- `recommendation_runs`: sesión, versiones, timestamp, estado y confianza global.
- `recommendation_items`: ciudad, posición, raw score, match, confianza.
- `recommendation_contributions`: factor, peso, compatibilidad, aporte, explicación.
- `constraint_evaluations`: restricción, resultado y evidencia.
- `algorithm_versions`: configuración, changelog, fecha y estado.

#### Comportamiento y feedback

- `product_events`: taxonomía controlada y propiedades permitidas.
- `favorites`: usuario/sesión, ciudad, timestamp.
- `comparisons`: ciudades y contexto.
- `rejections`: ciudad, razón normalizada, texto opcional.
- `match_feedback`: relevancia, confianza percibida y opción preferida.

### 14.2 Relaciones esenciales

```text
anonymous_user 1—N search_session
search_session 1—N profile/preference snapshots
search_session 1—N recommendation_run
recommendation_run 1—N recommendation_item
recommendation_item 1—N contribution / constraint_evaluation
city 1—N metric_observation
data_snapshot N—N metric_observation
algorithm_version 1—N recommendation_run
```

### 14.3 Retención y privacidad

- Separar PII de eventos mediante IDs no derivables.
- No guardar dirección exacta, documento, empleador ni ingreso exacto.
- Ingresos y edades en rangos.
- Texto libre: consentimiento separado, redacción de PII y retención corta por defecto.
- Permitir borrar cuenta y datos asociados.
- Definir retención por tipo antes del lanzamiento.
- Ocultar segmentos con menos de un umbral mínimo en dashboard/exportaciones.
- Realizar revisión legal local antes de recolectar o monetizar datos personales; la Ley 25.326 exige un tratamiento compatible con sus principios y, según el caso, consentimiento informado.

---

## 15. Dashboard y analítica

### 15.1 Audiencias

- Producto: funnel, aceptación, retención y experimentos.
- Data: cobertura, frescura, anomalías y sesgos.
- Operaciones/editorial: ciudades incompletas y correcciones.
- Negocio: demanda agregada, leads y oportunidades, con privacidad.

### 15.2 Pantalla 1 — Pulso general

- sesiones iniciadas y completadas;
- tiempo al primer resultado;
- usuarios únicos seudónimos;
- tasa de aceptación del match;
- favoritos, comparaciones y emails capturados;
- ciudad más mostrada, abierta, guardada y descartada;
- principales motivos de descarte;
- calidad de datos y errores críticos.

### 15.3 Pantalla 2 — Qué busca la audiencia

- distribución de prioridades;
- restricciones duras más frecuentes;
- trade-offs elegidos;
- segmentos por modalidad laboral, hogar, ingreso y origen amplio;
- cambios por período;
- intención y horizonte de mudanza.

Debe hablar de **preferencias de usuarios de Life Match**, no de “lo que busca Argentina” sin una muestra representativa.

### 15.4 Pantalla 3 — Demanda territorial

- recomendaciones, aperturas, favoritos y rechazos por ciudad;
- flujos de interés entre origen amplio y destino;
- tasa de descubrimiento;
- mapas con mínimos de privacidad;
- distinción explícita entre interés, intención y mudanza confirmada.

### 15.5 Pantalla 4 — Rendimiento de ciudades

- apariciones y posición promedio;
- CTR de ficha;
- favorite rate;
- compare rate;
- rejection rate y razones;
- aceptación por segmento;
- confianza de datos;
- sobreexposición del algoritmo.

### 15.6 Pantalla 5 — Calidad del matching

- Match Acceptance Rate;
- No-Match Rate: rechazo del top completo;
- aceptación por versión del algoritmo;
- NDCG/precision@k en evaluaciones etiquetadas;
- contradicciones entre declaración y comportamiento;
- cobertura y confianza por perfil;
- recomendaciones frecuentes con baja aceptación;
- impacto de ajustes de peso.

### 15.7 Pantalla 6 — Salud de datos

- métricas vencidas;
- ciudades bajo el umbral de cobertura;
- fuentes fallidas;
- cambios de esquema;
- valores anómalos;
- observaciones manuales próximas a vencer;
- fecha del último snapshot publicado.

### 15.8 Controles

- filtros con tamaño de muestra visible;
- exportación solo agregada;
- roles y auditoría de acceso;
- no permitir búsquedas de una persona individual en MVP;
- advertencias cuando un segmento no sea estadísticamente interpretable.

---

## 16. Taxonomía de eventos

### 16.1 Convenciones

- Formato: `objeto_acción`, en `snake_case`.
- Cada evento incluye `event_id`, `occurred_at`, `anonymous_user_id`, `session_id`, `app_version`, `experiment_assignments` y `consent_scope` cuando corresponda.
- No enviar texto libre, email ni PII a la plataforma de product analytics.
- Mantener un diccionario versionado con propietario y propósito.

### 16.2 Funnel

| Evento | Disparador | Propiedades clave |
|---|---|---|
| `landing_viewed` | carga de landing | source, campaign, device |
| `onboarding_started` | CTA inicial | variant |
| `intent_selected` | intención elegida | intent, horizon_range |
| `free_text_submitted` | envío de descripción | char_bucket, extraction_status; nunca texto |
| `preference_confirmed` | chip confirmado/editado | factor, value, origin |
| `question_answered` | respuesta por tap | question_id, answer_id, step_index |
| `question_skipped` | omisión | question_id, reason |
| `tradeoff_answered` | duelo respondido | pair_id, selection, strength |
| `onboarding_completed` | mínimos completos | duration_bucket, answers_count |
| `recommendations_generated` | ranking exitoso | run_id, algorithm_version, data_snapshot_id, count |

### 16.3 Resultados e intención

| Evento | Disparador | Propiedades clave |
|---|---|---|
| `recommendation_impression` | tarjeta visible | city_id, rank, match_bucket, confidence |
| `city_opened` | abre ficha | city_id, rank, source_surface |
| `explanation_opened` | abre explicación | city_id |
| `city_saved` | guarda | city_id, rank |
| `city_unsaved` | quita favorito | city_id |
| `city_rejected` | descarta | city_id, reason_code, rank |
| `comparison_started` | inicia comparación | city_ids_count |
| `comparison_city_added` | agrega ciudad | city_id |
| `preference_refined` | cambia factor | factor, old_bucket, new_bucket |
| `ranking_recalculated` | nuevo ranking | trigger, old_top_city_id, new_top_city_id |
| `match_feedback_submitted` | evalúa resultado | relevance, trust, selected_city_id |
| `result_shared` | comparte | surface, privacy_mode |
| `email_capture_submitted` | deja email | benefit, consent_marketing; email fuera de analytics |

### 16.4 Calidad y fallos

- `recommendation_failed`
- `llm_extraction_failed`
- `data_warning_shown`
- `no_city_meets_constraints`
- `stale_metric_encountered`
- `source_link_opened`
- `feedback_issue_reported`

### 16.5 Métricas derivadas

```text
Onboarding Completion Rate = completed / started
Time to Value = recommendations_generated.at − onboarding_started.at
Match Acceptance Rate = sesiones con city_opened OR city_saved OR comparison_started OR feedback relevante / sesiones con resultados
Strong Acceptance Rate = sesiones con city_saved OR feedback positivo / sesiones con resultados
No-Match Rate = sesiones que rechazan top 5 o declaran “ninguna” / sesiones con resultados
Discovery Rate = ciudades abiertas o guardadas que el usuario declaró no conocer / sesiones con resultados
```

No contar una impresión como aceptación.

---

## 17. Arquitectura propuesta

### 17.1 Componentes

- **Web:** Next.js/React, responsive y accesible.
- **API de producto:** TypeScript en el mismo monorepo o servicio liviano.
- **Base transaccional:** PostgreSQL gestionado (por ejemplo, Supabase).
- **Geoespacial:** PostGIS.
- **Autenticación:** opcional, magic link/social; navegación anónima por defecto.
- **Jobs de datos:** Python para ingesta y transformación programada.
- **Almacenamiento raw:** object storage versionado.
- **Motor de matching:** paquete determinístico con configuraciones versionadas.
- **LLM gateway:** extracción estructurada, guardrails, caché y observabilidad.
- **Product analytics:** PostHog o equivalente, sin PII.
- **Dashboard:** Metabase sobre vistas agregadas al inicio.
- **Mapas:** MapLibre y tiles compatibles con las licencias elegidas.
- **Observabilidad:** logs estructurados, errores, métricas de jobs y alertas.

### 17.2 Flujo de datos

```text
Fuentes → Raw snapshot → Validación → Normalización territorial
       → Metric observations → Quality gate → Published data snapshot

Usuario → Preferencias confirmadas → Filtros + scoring versionado
        → Ranking + explicaciones → Interacciones/feedback
        → Vistas agregadas → Dashboard
```

### 17.3 Separación de responsabilidades

- El LLM no accede directamente a tablas sensibles.
- El servicio de ranking consume solo preferencias validadas y snapshot publicado.
- Analytics recibe IDs seudónimos y propiedades permitidas.
- Email/auth vive separado del almacén analítico.
- Los cambios editoriales requieren autor, evidencia y caducidad.

### 17.4 Requisitos no funcionales

- Primer resultado: p95 < 4 s después de completar onboarding, excluyendo tiempo humano.
- Landing: LCP móvil p75 < 2,5 s.
- Disponibilidad objetivo beta: 99,5%.
- Ranking reproducible al 100% con mismas entradas/versiones.
- WCAG 2.2 AA en flujos críticos.
- Backups, restauración probada y auditoría de acceso.
- Presupuesto de costo por recomendación definido; fallback sin LLM.

---

## 18. Requisitos funcionales y criterios de aceptación

### RF-01 — Onboarding anónimo

**Requisito:** iniciar y obtener resultados sin cuenta.  
**Aceptación:** una sesión nueva completa el flujo y recibe top 5 sin email.

### RF-02 — Interpretación de texto

**Requisito:** convertir descripción libre en esquema permitido.  
**Aceptación:** se muestran chips editables; ningún valor de baja confianza se aplica silenciosamente; ante fallo existe fallback por taps.

### RF-03 — Restricciones

**Requisito:** distinguir necesidades duras de preferencias.  
**Aceptación:** el usuario puede marcar/editar criticidad y ver qué ciudad incumple qué condición.

### RF-04 — Ranking reproducible

**Requisito:** guardar inputs, snapshot y versión.  
**Aceptación:** soporte puede reconstruir un ranking histórico con idéntico resultado.

### RF-05 — Resultado explicable

**Requisito:** cada ciudad tiene razones y trade-offs vinculados al cálculo.  
**Aceptación:** ninguna razón contradice las contribuciones guardadas.

### RF-06 — Confianza y fuentes

**Requisito:** mostrar calidad y frescura.  
**Aceptación:** cada métrica publicada tiene fuente y fecha; datos faltantes no aparecen como cero.

### RF-07 — Comparación

**Requisito:** comparar hasta tres ciudades.  
**Aceptación:** mismas definiciones/unidades y advertencias por diferencias de cobertura.

### RF-08 — Feedback

**Requisito:** guardar, rechazar y evaluar.  
**Aceptación:** razones normalizadas quedan ligadas a recomendación, posición y versiones.

### RF-09 — Dashboard

**Requisito:** mostrar funnel, demanda, matching y datos.  
**Aceptación:** filtros respetan umbral de privacidad y diferencian impresión, interés e intención.

### RF-10 — Derechos de datos

**Requisito:** gestionar consentimiento y borrado.  
**Aceptación:** usuario autenticado puede solicitar eliminación; eventos no contienen PII directa.

---

## 19. Métricas de éxito

### 19.1 North Star del MVP

**Sesiones con match aceptado por cada 100 sesiones con resultados.**

Un match aceptado requiere una señal de intención: abrir una ficha con permanencia mínima, comparar, guardar o declarar relevancia. Reportar también una versión estricta que excluya aperturas.

### 19.2 Targets iniciales para beta

Son hipótesis a validar, no benchmarks de mercado:

- ≥ 60% de onboarding completion.
- mediana de tiempo a valor ≤ 60 s.
- ≥ 45% Match Acceptance Rate.
- ≥ 20% Strong Acceptance Rate.
- ≤ 20% No-Match Rate.
- ≥ 25% abre una ciudad no considerada previamente.
- ≥ 15% inicia comparación.
- ≥ 10% guarda una ciudad.
- ≥ 70% de métricas publicadas dentro de su ventana de frescura.
- 100% de recomendaciones reproducibles.

### 19.3 Guardrails

- tasa de reporte por dato incorrecto;
- alucinaciones o explicaciones no respaldadas = 0 toleradas en QA y < 0,1% en producción con remediación;
- paridad de aceptación entre segmentos, investigando diferencias relevantes;
- costo por recomendación;
- tasa de consentimiento y borrado;
- latencia y fallos del LLM;
- concentración del ranking: ninguna ciudad debería dominar sin evidencia.

### 19.4 Validación cualitativa

- 15 entrevistas antes del build completo.
- 10 pruebas de usabilidad del prototipo.
- 30 sesiones beta entrevistadas.
- panel de expertos/locales para revisar fichas y resultados extremos.

---

## 20. Roadmap e implementación

### Fase 0 — Discovery y factibilidad (2–3 semanas)

**Entregables:**

- entrevistas y mapa de decisiones;
- definición del segmento inicial;
- prototipo clickable del onboarding/resultados;
- auditoría de fuentes y licencias;
- selección de 40–60 ciudades;
- diccionario de métricas y esquema territorial;
- 20 escenarios de evaluación del ranking;
- política inicial de privacidad y retención.

**Gate:** ≥ 70% de participantes comprende el resultado y puede explicar un trade-off sin ayuda.

### Fase 1 — Data foundation (3–5 semanas, parcialmente paralela)

**Entregables:**

- ingesta raw de Georef, INDEC, ENACOM, clima, OSM y aeropuertos;
- crosswalk territorial;
- definición y normalización de métricas;
- consola mínima de QA/editorial;
- snapshot publicado v1;
- auditoría de cobertura y frescura.

**Gate:** 100% de ciudades con métricas obligatorias y trazabilidad; sin fallos críticos de licencia.

### Fase 2 — Alpha funcional (4–6 semanas)

**Entregables:**

- onboarding anónimo por taps;
- motor determinístico v1;
- top 5, ficha y explicación basada en reglas;
- eventos principales;
- dashboard de funnel y salud de datos;
- feedback y rechazo.

**Gate:** rankings reproducibles, p95 dentro del objetivo y evaluación interna satisfactoria en escenarios.

### Fase 3 — Beta asistida por IA (3–4 semanas)

**Entregables:**

- entrada conversacional y chips confirmables;
- preguntas adaptativas;
- comparador y favoritos;
- captura de email posterior al valor;
- dashboard de matching y ciudades;
- experimentos A/B de onboarding.

**Gate:** cumplir targets mínimos de completion, aceptación y calidad de extracción.

### Fase 4 — Aprendizaje y expansión (6–12 semanas)

**Entregables:**

- mejoras basadas en feedback;
- más ciudades solo si alcanzan quality gate;
- actualizaciones y alertas;
- seguimiento voluntario de intención/mudanza;
- primeros reportes agregados;
- pilotos de monetización no intrusiva.

### Fase 5 — Producto de mudanza (posterior a validación)

- shortlist colaborativa;
- barrios y oferta inmobiliaria licenciada;
- checklist y timeline;
- proveedores y leads;
- medición longitudinal de satisfacción;
- expansión regional.

---

## 21. Monetización

### 21.1 Principios

- No degradar el ranking por pago.
- Etiquetar recomendaciones patrocinadas.
- No vender datos individuales ni segmentos reidentificables.
- Mantener una versión gratuita que entregue valor completo inicial.

### 21.2 Opciones

#### Freemium B2C

Gratis: onboarding, top 5, fichas básicas.  
Pago: comparaciones avanzadas, informes, escenarios, alertas, colaboración y planificación.

#### Afiliados y leads

Mudanza, seguros, internet, coworking, alojamiento temporal e inmobiliarias. Solo después de una recomendación orgánica y con consentimiento explícito para compartir datos.

#### Insights B2B

Reportes agregados para desarrolladores, servicios, coworkings y consultoras: preferencias, demanda potencial y brechas. Requiere umbrales, metodología y advertencias de sesgo muestral.

#### Institucional

Informes para municipios sobre percepción, atractivo y necesidades de segmentos. Nunca presentar intención como migración efectiva.

### 21.3 Orden recomendado

1. validar utilidad y aceptación;
2. probar afiliados contextuales;
3. explorar premium de planificación;
4. ofrecer insights agregados solo con volumen y gobernanza suficiente.

---

## 22. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Datos incompletos/desactualizados | recomendaciones erróneas | confianza visible, caducidad, QA y fuentes |
| Falsa precisión | pérdida de confianza | rangos, ordinales, explicación y metodología |
| Sesgo geográfico de OSM/datasets | ciudades subrepresentadas | cobertura, revisión manual y no confundir nulo con cero |
| Alquileres sin fuente estable | falla en factor crítico | universo limitado, rangos con muestra y acuerdos futuros |
| Seguridad no comparable | daño reputacional | excluir score nacional hasta tener metodología válida |
| LLM alucina preferencias o facts | recomendaciones incoherentes | esquema cerrado, confirmación y generación grounded |
| Sesgo de muestra | reportes B2B engañosos | metodología, ponderación futura y claims acotados |
| Privacidad/reidentificación | riesgo legal y ético | minimización, separación PII, umbrales y revisión legal |
| Baja recurrencia | crecimiento débil | favoritos, alertas, planificación y contenido compartible |
| Cold start del aprendizaje | pesos pobres | heurísticas, escenarios, expertos y feedback explícito |
| Gaming comercial | ranking capturado | firewall editorial/comercial y auditoría |
| Dependencia de APIs | interrupciones/costos | snapshots batch, caché, fallback y fuentes alternativas |
| Usuario idealiza aspiraciones | match poco realista | restricciones, trade-offs y señales conductuales posteriores |
| Expansión prematura | calidad inconsistente | quality gate por ciudad y dimensión |

---

## 23. Preguntas abiertas

### Producto

1. ¿Cuál es el segmento inicial: remotos, familias o exploradores urbanos?
2. ¿La promesa principal debe hablar de “ciudad ideal”, “vida posible” o “shortlist para mudarte”?
3. ¿Qué nivel de intención justifica pedir horizonte temporal?
4. ¿Top 3 genera más acción que top 5?
5. ¿Cómo preguntar presupuesto en un contexto bimonetario e inflacionario?

### Datos

6. ¿Qué fuente legal y sostenible permitirá estimar alquileres?
7. ¿Cuál es la unidad territorial correcta por ciudad: localidad censal, municipio o aglomerado?
8. ¿Qué 8–12 métricas son obligatorias para publicar una ciudad?
9. ¿Cómo representar conectividad cuando la disponibilidad no asegura calidad domiciliaria?
10. ¿Qué dimensiones deben permanecer cualitativas?

### Matching

11. ¿Qué restricciones son verdaderamente duras y cuáles deben generar advertencia?
12. ¿Cómo calibrar pesos sin sobreajustar clics de curiosidad?
13. ¿Qué señal define aceptación real?
14. ¿Cuándo conviene introducir aprendizaje estadístico?
15. ¿Cómo diversificar sin sacrificar relevancia?

### Privacidad y negocio

16. ¿Se conservará texto libre? ¿Con qué consentimiento y retención?
17. ¿Qué umbral mínimo evita reidentificación en reportes?
18. ¿Qué uso B2B es compatible con la promesa de confianza?
19. ¿Qué documentación y registro exige el régimen argentino para esta base?
20. ¿Cómo separar editorial, ranking y monetización?

---

## 24. Decisiones recomendadas para comenzar

1. **Segmento inicial:** profesionales remotos y parejas sin necesidades médicas complejas; permite validar el motor con menos variables críticas.
2. **Cobertura:** 50 ciudades diversas con quality gate, no todo el país.
3. **Onboarding:** taps como camino confiable; texto asistido como acelerador opcional.
4. **Resultado:** top 3 inmediato, top 5 expandible, con trade-offs y confianza.
5. **Motor:** reglas explícitas versionadas; IA solo para interpretar y explicar.
6. **Datos sensibles:** rangos, opcionales, consentimiento claro y sin texto libre en analytics.
7. **Costo y seguridad:** no publicar precisión nacional hasta resolver metodología.
8. **North Star:** Strong Match Acceptance, no pageviews ni rankings generados.
9. **Dashboard:** construir desde el alpha porque valida producto y datos.
10. **Monetización:** diferir hasta comprobar utilidad y confianza.

---

## 25. Checklist de Definition of Done del MVP

### Producto

- [ ] Usuario anónimo llega a resultados en menos de 60 segundos.
- [ ] Puede editar preferencias y ver cambios del ranking.
- [ ] Cada resultado muestra razones, trade-offs, confianza y fuentes.
- [ ] Puede comparar, guardar, rechazar y dar feedback.
- [ ] Puede continuar sin email.

### Matching

- [ ] Restricciones y pesos están documentados.
- [ ] Cada ranking guarda versiones y contribuciones.
- [ ] Suite de escenarios pasa los resultados esperados.
- [ ] Fallback funciona sin LLM.
- [ ] No hay explicación no respaldada por datos.

### Datos

- [ ] 40–60 ciudades pasan el quality gate.
- [ ] Cada métrica tiene definición, fuente, fecha y confianza.
- [ ] Nulos y unidades territoriales están resueltos explícitamente.
- [ ] Pipelines alertan ante fallos y cambios de esquema.
- [ ] Licencias y atribuciones están revisadas.

### Analítica y privacidad

- [ ] Taxonomía implementada y validada.
- [ ] Dashboard cubre funnel, matching, ciudades y salud de datos.
- [ ] PII separada de analytics.
- [ ] Consentimiento, retención y borrado están implementados.
- [ ] Segmentos pequeños están protegidos.

### Operación

- [ ] Existe responsable por fuente y métrica.
- [ ] Hay proceso de corrección y publicación.
- [ ] Backups y restauración fueron probados.
- [ ] Soporte puede reconstruir una recomendación histórica.

---

## 26. Apéndice A — Esquema de preferencias v1

```json
{
  "intent": "exploring|move_0_6m|move_6_12m|move_later",
  "household": {
    "adults_range": "1|2|3_plus",
    "children": "none|current|planned|prefer_not_to_say",
    "pets": ["dog", "cat", "other"]
  },
  "work": {
    "mode": "remote|hybrid|onsite|not_working",
    "internet_criticality": 0
  },
  "budget": {
    "currency": "ARS|USD",
    "monthly_range_id": "string",
    "hard_limit": true
  },
  "mobility": {
    "has_car": "yes|no|sometimes",
    "avoid_car_dependency": 0,
    "airport_importance": 0
  },
  "preferences": [
    {
      "factor": "climate_heat_tolerance",
      "value": "low",
      "weight": 4,
      "hard_constraint": false,
      "origin": "tap|text|tradeoff",
      "extraction_confidence": 1.0,
      "confirmed": true
    }
  ]
}
```

## 27. Apéndice B — Principios editoriales

- Escribir “los datos disponibles sugieren”, no “esta ciudad es”.
- Separar hechos, estimaciones, proxies y opinión editorial.
- Evitar lenguaje estigmatizante sobre barrios, ciudades o poblaciones.
- Mostrar ventajas y límites con simetría.
- No usar testimonios como evidencia estadística.
- No afirmar “segura”, “barata” o “buen internet” sin definición, fecha y fuente.
- Corregir públicamente errores materiales y registrar el cambio.

---

**Decisión solicitada al equipo:** aprobar segmento inicial, universo de ciudades, métricas obligatorias y definición de Match Acceptance antes de iniciar Fase 1.
