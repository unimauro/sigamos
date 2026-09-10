# Backlog de producto — Sigamos ("Estamos contigo")

> Dashboard de concientización y prevención del suicidio.
> Repo: `life-compass` · En vivo: https://unimauro.github.io/sigamos/
> Autor: Carlos Mauro Cárdenas ([@unimauro](https://github.com/unimauro))
> Stack: React + Vite + TypeScript + Tailwind + shadcn-ui + Recharts + react-i18next + framer-motion · GitHub Pages (`base: /sigamos/`).

Owner del backlog: Product Owner. Última actualización: 2026-09-10.

---

## 1. Visión y métricas de éxito

### Visión
Que cualquier persona que llega a Sigamos —esté en crisis, preocupada por alguien, o
solo informándose— salga con **un paso humano concreto**: hablar con alguien real (de
preferencia en persona) y/o contactar una línea de ayuda verificada de su país. El
dashboard usa **datos veraces y trazables** para crear conciencia, nunca para
sensacionalizar. Cada cifra en pantalla tiene fuente; cada canal de crisis está
verificado; el chat es un puente hacia ayuda humana, no un sustituto.

### Objetivos
- **O1 — Confianza del dato:** 100% de las cifras en pantalla con fuente citada y
  trazable a un CSV/estudio; cero datos sintéticos sin etiqueta "ilustrativo".
- **O2 — Ayuda que funciona:** todo canal de crisis mostrado está verificado y vigente.
- **O3 — Puente humano:** maximizar que el visitante dé el paso hacia una persona/línea.
- **O4 — Alcance responsable:** llegar a más personas en su idioma sin dañar ni exponer.

### Métricas de éxito (con guardarraíl ético)

| Métrica | Tipo | Cómo se mide | Meta |
|---|---|---|---|
| **Clics a líneas de ayuda** (`tel:`, WhatsApp, "helplineNow" del chat) | Norte ✅ | Evento GA4 `helpline_click` con `country_code` | ↑ trimestre a trimestre |
| **Copias/aperturas de "cómo empezar la conversación"** (openingLines) | Norte ✅ | Evento GA4 `bridge_step` | ↑ |
| Conversaciones de chat que llegan al nodo `bridge`/`openingLines` | Salud | Funnel GA4 | ↑ |
| Cobertura de datos trazables (% cifras con `sourceKey`) | Calidad | Auditoría interna | 100% |
| Canales de crisis verificados en <180 días | Calidad | Campo `last_verified` en dataset | 100% |
| Idiomas con detección de crisis y `systemPrompt` completos | Calidad | Cobertura i18n | 8/8 |

**Métrica ética (no dañar) — regla explícita:** el éxito se mide por **acciones de ayuda
(clics a líneas, pasos de puente)**, NUNCA por *tiempo en página*, *scroll depth* ni
*sesiones repetidas*. Retener a una persona en crisis en la página en vez de derivarla
sería un anti-objetivo. GA4 debe configurarse para no optimizar engagement.

---

## 2. EPICS

- **E1 — Integridad de datos y trazabilidad** *(prioridad máxima)*
- **E2 — Verificación y confiabilidad de líneas de crisis** *(prioridad máxima)*
- **E3 — Chat de acompañamiento (seguridad + capa IA)**
- **E4 — Accesibilidad e i18n**
- **E5 — Privacidad y analítica**
- **E6 — SEO / difusión**
- **E7 — Rendimiento**
- **E8 — Contenido de prevención**

Estado detectado en el repo (base para el backlog):
- Datos **hardcodeados** en componentes (`ChartsSection.tsx` `globalTrend`/`topCountries`/`ageDistribution`, `GlobalStats.tsx`, `GenderAnalysis`, `EconomicFactors`, `SocialMediaImpact`, `AgeGroupDeepDive`); los CSV en `public/data/` (`suicide_rates_by_country.csv`, `_by_age.csv`, `economic_indicators.csv`, `helplines.csv`) **no se leen en runtime** (no hay `fetch`/parser de CSV).
- Ya existe `src/data/sources.ts` + componente `ChartSource.tsx` (cita por gráfico y etiqueta "ilustrativo"), pero **no existe** aún la sección "Fuentes y FAQ" (`SourcesFaq`) que menciona el código.
- **Tres fuentes de verdad** para líneas de ayuda desconectadas entre sí: `public/data/helplines.csv`, el mapa en `src/hooks/use-country-helpline.ts` (~80 países) y el array en `src/components/HelplineDirectory.tsx`. Ninguna tiene metadato de verificación.
- Detección de crisis (`src/lib/support-chat.ts` `CRISIS_TERMS`) solo cubre **ES + EN**; el sitio está en 8 idiomas. `chat.systemPrompt` está solo en `es`/`en` (falta en `fr` y resto).
- Autodetección de país por `ipapi.co` (`use-country-helpline.ts`) sin aviso de privacidad. GA4 (`G-2PEP1EE6FE`) carga en `index.html` **antes de cualquier consentimiento**.
- Correcciones de dato ya en curso (p. ej. `GlobalStats`: 700k→727k, ratio 2.5→2.3x, edad más afectada 15–29→70+, `sourceKey` por tarjeta).

---

## 3. Historias de usuario por epic

Formato: **Como / quiero / para** · MoSCoW · Estimación (S/M/L) · Criterios (Given/When/Then).

### E1 — Integridad de datos y trazabilidad  *(prioridad máxima)*

**H1.1 — Conectar los CSV al runtime** · **Must** · **L**
Como visitante que confía en los datos, quiero que los gráficos muestren exactamente lo
que dicen los CSV oficiales, para no ver cifras inventadas.
- Given los CSV en `public/data/`, When carga un gráfico (tendencia, top países, edad, económico), Then los valores provienen del CSV parseado en runtime, no de arrays hardcodeados en el componente.
- Given un CSV no disponible o corrupto, When falla la carga, Then el gráfico muestra un estado vacío/error legible y no cifras falsas de respaldo.
- Given el refactor, Then se elimina (o queda como fallback etiquetado) todo array de datos numéricos embebido en `ChartsSection.tsx`, `GlobalStats.tsx`, etc.

**H1.2 — Etiquetar toda serie sintética/interpolada** · **Must** · **S**
Como lector, quiero saber cuándo una serie es ilustrativa y no un dato oficial, para
interpretarla con cautela.
- Given una serie interpolada (2020–2021 por país, % de ideación por pantalla, barras por nivel de ingreso, curvas por edad), When se renderiza, Then muestra el badge `illustrative` de `ChartSource` con nota del método.
- Given una cifra oficial, Then NO lleva badge ilustrativo y sí `sourceKey` válido.

**H1.3 — Fuente citada en cada gráfico y tarjeta** · **Must** · **S**
Como PO, quiero que ningún dato aparezca sin fuente trazable, para cumplir la regla del proyecto.
- Given cualquier gráfico/tarjeta con número, When se renderiza, Then incluye `<ChartSource>` con al menos un `SourceKey` de `src/data/sources.ts`.
- Given una auditoría automatizada (test), Then falla el build si un componente de datos no referencia una fuente.

**H1.4 — Sección "Fuentes y FAQ"** · **Must** · **M**
Como persona escéptica o periodista, quiero una sección única que liste todas las fuentes
y aclare metodología, para verificar el dashboard.
- Given `SOURCE_ORDER` en `sources.ts`, When abro la sección Fuentes, Then veo todas las fuentes con enlace, y una FAQ (por qué estas cifras, qué es "crudo vs. estandarizado", qué es ilustrativo, cuándo se actualizó).
- Given el `Index.tsx`, Then la sección está enlazada desde el footer/nav.

**H1.5 — Correcciones de dato conocidas aplicadas** · **Must** · **S**
Como responsable del dato, quiero cerrar las correcciones de la auditoría, para no publicar cifras erróneas.
- Given la auditoría (África masculino 10.1→18.4; ratio H/M 2.5→2.3; "1 de 5" ciberacoso→46% Pew; muertes 700k→727k; edad más afectada), When reviso cada componente, Then el valor corregido está en pantalla con su fuente y no queda ningún valor viejo.

**H1.6 — Distinguir tasa cruda vs. estandarizada por edad** · **Should** · **M**
Como analista, quiero que las tasas indiquen si son crudas o estandarizadas y su año, para
comparar correctamente entre países.
- Given el CSV OMS 2019 (tasas crudas), When se muestra un ranking de países, Then la nota aclara "tasas crudas 2019" y no se mezcla con estandarizadas.

**H1.7 — Pipeline reproducible de datos** · **Could** · **M**
Como mantenedor, quiero un script que regenere los CSV desde las fuentes (OMS, Banco Mundial CSV), para actualizar sin editar a mano.
- Given un `npm run data:build`, When lo ejecuto, Then descarga/normaliza y escribe los CSV en `public/data/` con columna de año y fuente.

### E2 — Verificación y confiabilidad de líneas de crisis  *(prioridad máxima)*

**H2.1 — Una sola fuente de verdad de líneas** · **Must** · **L**
Como visitante en crisis, quiero que la línea que veo sea la misma en el chat, la barra de
emergencia y el directorio, para no recibir números contradictorios.
- Given las tres fuentes actuales (`helplines.csv`, mapa en `use-country-helpline.ts`, array en `HelplineDirectory.tsx`), When se refactoriza, Then todas consumen `public/data/helplines.csv` como única fuente.
- Given un país, When lo consulta el chat, la barra y el directorio, Then muestran idéntico número y organización.

**H2.2 — Metadato de verificación por línea** · **Must** · **M**
Como responsable de seguridad, quiero saber cuándo se verificó por última vez cada canal,
para no exponer números que no funcionan (caso del WhatsApp de crisis retirado).
- Given `helplines.csv`, When se define el esquema, Then cada fila tiene `last_verified`, `source_url` y `status` (`active`/`unverified`/`retired`).
- Given una línea con `status != active` o `last_verified` > 180 días, When se renderiza, Then no se muestra como canal de crisis primario (o se oculta) y se marca para revisión.

**H2.3 — Proceso/checklist de verificación de canales** · **Must** · **S**
Como PO, quiero un procedimiento documentado para verificar líneas antes de publicarlas,
para que ningún canal roto vuelva a producción.
- Given `docs/`, When se agrega una línea, Then existe un checklist (llamar/enviar, confirmar horario, idioma, gratuidad) y no se publica sin `last_verified` de hoy.

**H2.4 — Cobertura y precisión del directorio** · **Should** · **M**
Como visitante de un país sin línea local, quiero un fallback claro (internacional/OMS),
para no quedarme sin recurso.
- Given un `country_code` sin entrada, When lo detecta el hook, Then muestra un fallback internacional verificado y sugiere "habla con alguien de confianza".
- Given horarios no 24/7, Then el horario real se muestra (no asumir 24/7).

**H2.5 — Autodetección de país robusta y con opción manual** · **Should** · **S**
Como visitante, quiero corregir mi país si la autodetección falla, para ver mi línea correcta.
- Given falla `ipapi.co`, When no hay país, Then puedo seleccionar mi país manualmente y se persiste.
- Given detección exitosa, Then puedo cambiarla con un selector visible.

### E3 — Chat de acompañamiento (seguridad + capa IA)

**H3.1 — Detección de crisis en los 8 idiomas** · **Must** · **L**
Como persona en crisis que escribe en su idioma, quiero que el chat reconozca mis señales
en japonés, francés, ruso, etc., para recibir la línea de ayuda de inmediato.
- Given `CRISIS_TERMS` (hoy ES+EN), When se amplía, Then hay términos revisados por hablante para los 8 idiomas (en, es, zh, ko, ru, ja, fr, lt).
- Given un mensaje de crisis en cualquier idioma soportado, When `isCrisis()` lo evalúa, Then devuelve `true` y el chat muestra la línea local.
- Given tests, Then existe una batería de frases de crisis por idioma que valida la detección.

**H3.2 — `systemPrompt` de la capa IA en todos los idiomas** · **Must** · **S**
Como visitante con IA activa, quiero que el modelo esté igual de restringido en mi idioma,
para recibir siempre acompañamiento seguro y derivación humana.
- Given `chat.systemPrompt` (hoy solo es/en; falta fr y resto), When se completa, Then existe en los 8 locales con las mismas restricciones (no diagnosticar, derivar a persona/línea, no dar métodos).

**H3.3 — Doble chequeo de crisis sobre la respuesta del modelo** · **Must** · **S**
Como PO, quiero garantizar que la salida de la IA nunca omita una derivación ante riesgo,
para no depender de que el modelo se comporte.
- Given una respuesta del gateway, When contiene señales de crisis o el mensaje del usuario las tenía, Then se antepone la línea de ayuda (ya hay base en `SupportChat.tsx`; cubrir todos los idiomas y añadir tests).
- Given fallo/timeout del gateway, Then el chat cae al modo guiado sin romperse.

**H3.4 — Mensajería del chat sin contenido dañino** · **Must** · **S**
Como visitante vulnerable, quiero que el chat nunca describa métodos ni minimice el riesgo,
para no ser expuesto a contenido que dañe.
- Given cualquier nodo/respuesta, When se revisa el contenido i18n, Then no hay descripción de métodos ni lenguaje que romantice; el tono sigue las guías de reporte seguro (OMS/#chatsafe).

**H3.5 — Transparencia de que es un asistente, no una persona** · **Should** · **S**
Como visitante, quiero saber que hablo con un asistente y que puedo llegar a una persona
real, para no confundirme.
- Given la apertura del chat, Then se declara que no es un profesional ni una persona y su objetivo de puente.

### E4 — Accesibilidad e i18n

**H4.1 — Gráficos accesibles** · **Must** · **M**
Como usuario de lector de pantalla, quiero entender los gráficos, para acceder a la misma
información que quien ve.
- Given cada gráfico Recharts, When se navega con teclado/lector, Then hay alternativa textual (tabla de datos o `aria-label`/resumen) y foco manejable.

**H4.2 — Contraste, foco y navegación por teclado (WCAG AA)** · **Must** · **M**
Como usuario con baja visión o sin ratón, quiero cumplir AA, para usar todo el sitio.
- Given una auditoría (axe/Lighthouse), When se corre, Then 0 violaciones críticas; contraste AA; foco visible; el chat es totalmente operable por teclado (ya tiene `aria-label`s base).

**H4.3 — `lang` dinámico y contenido 100% traducido** · **Must** · **M**
Como visitante en uno de los 8 idiomas, quiero todo el contenido en mi idioma, para
entender sin barreras.
- Given `index.html` con `lang="es"` fijo, When cambio de idioma, Then `<html lang>` se actualiza al idioma activo.
- Given los 8 locales, When se auditan claves, Then no faltan claves respecto a `en` (incluye `chat.*`, FAQ, fuentes).

**H4.4 — Selector de idioma persistente y detectable** · **Should** · **S**
Como visitante recurrente, quiero que recuerde mi idioma, para no reelegirlo (ya hay
`LanguageDetector` con cache en localStorage; validar y exponer bien el switcher).

### E5 — Privacidad y analítica

**H5.1 — Consentimiento antes de analítica y geolocalización** · **Must** · **M**
Como visitante sensible a su privacidad, quiero que no se rastree ni se detecte mi país sin
mi consentimiento, para proteger mi anonimato en un tema delicado.
- Given GA4 (`G-2PEP1EE6FE`) que hoy carga en `index.html` antes de consentir, When llega un visitante, Then GA4 y la llamada a `ipapi.co` no se ejecutan hasta consentimiento (o se usa modo sin cookies/Consent Mode).
- Given rechazo, Then el sitio funciona completo (la línea puede pedir país manualmente).

**H5.2 — Eventos de ayuda anónimos y éticos** · **Must** · **S**
Como PO, quiero medir clics a líneas y pasos de puente sin datos personales, para optimizar
la ayuda respetando la privacidad.
- Given un clic en línea/WhatsApp/paso de puente, When ocurre, Then se envía evento anónimo (`helpline_click`, `bridge_step`) sin PII ni texto del chat.
- Given la config GA4, Then no se optimiza por tiempo en página; IP anonimizada; retención mínima.

**H5.3 — Política de privacidad clara** · **Should** · **S**
Como visitante, quiero saber qué se recoge (país por IP, analítica) y qué no (el contenido
del chat), para confiar.
- Given un enlace en el footer, Then hay una página/sección de privacidad que declara: el chat corre en el cliente, no se guarda su contenido; geolocalización aproximada por IP; analítica anónima.

**H5.4 — El contenido del chat nunca se registra** · **Must** · **S**
Como visitante en crisis, quiero que lo que escribo no quede almacenado, para sentirme seguro.
- Given el flujo del chat (guiado o IA), When escribo, Then el texto no se persiste ni se envía a analítica; a la capa IA solo va lo necesario para responder.

### E6 — SEO / difusión

**H6.1 — SEO multilingüe (hreflang + og:locale)** · **Should** · **M**
Como persona que busca ayuda en su idioma, quiero encontrar Sigamos en buscadores, para
llegar al recurso correcto.
- Given `og:locale` fijo `es_PE` y sin `hreflang`, When se implementa, Then hay `hreflang` para los 8 idiomas y metadatos por idioma.

**H6.2 — sitemap.xml, robots.txt y datos estructurados** · **Should** · **S**
Como motor de búsqueda, quiero indexar bien el sitio, para posicionar el recurso de ayuda.
- Given el build de GitHub Pages, Then existen `sitemap.xml` y `robots.txt`; se añade JSON-LD (Organization/WebSite) sin exponer números de crisis desactualizados.

**H6.3 — Imagen OG por idioma / verificada** · **Could** · **S**
Como quien comparte el enlace, quiero una tarjeta social clara, para difundir con impacto responsable.

### E7 — Rendimiento

**H7.1 — Carga diferida de gráficos y chat** · **Should** · **M**
Como visitante en móvil o red lenta (incluye regiones de alta tasa), quiero que cargue
rápido, para acceder a la ayuda sin esperar.
- Given Recharts/framer-motion pesados, When se mide, Then se hace code-splitting/lazy de secciones no críticas; la barra de emergencia y la línea de ayuda cargan primero.
- Given Lighthouse móvil, Then Performance ≥ 90 y LCP < 2.5s.

**H7.2 — Presupuesto de bundle** · **Could** · **S**
Como mantenedor, quiero un límite de tamaño, para no degradar la carga con el tiempo.

### E8 — Contenido de prevención

**H8.1 — Contenido alineado a guías de reporte seguro** · **Must** · **S**
Como visitante, quiero contenido que ayude sin dañar, siguiendo OMS/#chatsafe, para estar seguro.
- Given `PreventionResources` y textos, When se revisan, Then cumplen guías de comunicación segura (sin métodos, sin sensacionalismo, con enfoque en esperanza y ayuda).

**H8.2 — "Qué decir / qué no" y señales de alerta accionables** · **Should** · **S**
Como alguien preocupado por otra persona, quiero pasos concretos, para poder ayudar.

**H8.3 — Guía "cómo empezar la conversación" enlazada al chat** · **Should** · **S**
Como visitante en el nodo `openingLines`, quiero frases listas y un recurso ampliado, para
dar el paso de hablar con alguien.

---

## 4. Tabla resumen priorizada (Top 15)

| # | ID | Historia | Epic | MoSCoW | Est. |
|---|----|----------|------|--------|------|
| 1 | H2.1 | Una sola fuente de verdad de líneas de ayuda | E2 | Must | L |
| 2 | H2.2 | Metadato de verificación (`last_verified`/`status`) por línea | E2 | Must | M |
| 3 | H3.1 | Detección de crisis en los 8 idiomas | E3 | Must | L |
| 4 | H1.1 | Conectar los CSV al runtime (quitar hardcode) | E1 | Must | L |
| 5 | H1.5 | Aplicar correcciones de dato conocidas | E1 | Must | S |
| 6 | H3.3 | Doble chequeo de crisis sobre respuesta del modelo | E3 | Must | S |
| 7 | H1.3 | Fuente citada en cada gráfico/tarjeta | E1 | Must | S |
| 8 | H2.3 | Checklist/proceso de verificación de canales | E2 | Must | S |
| 9 | H3.2 | `systemPrompt` de IA en los 8 idiomas | E3 | Must | S |
| 10 | H1.2 | Etiquetar toda serie sintética/interpolada | E1 | Must | S |
| 11 | H5.1 | Consentimiento antes de analítica y geolocalización | E5 | Must | M |
| 12 | H1.4 | Sección "Fuentes y FAQ" | E1 | Must | M |
| 13 | H5.4 | El contenido del chat nunca se registra | E5 | Must | S |
| 14 | H4.1 | Gráficos accesibles (alternativa textual) | E4 | Must | M |
| 15 | H5.2 | Eventos de ayuda anónimos y éticos (GA4) | E5 | Must | S |

---

## 5. Definición de Hecho (Definition of Done)

Una historia está **Hecha** cuando:

1. **Seguridad primero:** ninguna regresión en el flujo de crisis; ante duda, el sistema
   escala (muestra línea de ayuda). Cambios en chat/líneas cubiertos por tests.
2. **Dato trazable:** todo número visible tiene `sourceKey` en `src/data/sources.ts`; lo no
   oficial lleva badge `illustrative`. Cero cifras inventadas (regla del proyecto).
3. **Canales verificados:** toda línea publicada tiene `last_verified` reciente, `status=active`
   y fue probada según el checklist.
4. **i18n completo:** claves presentes en los 8 idiomas; sin texto hardcodeado; `<html lang>`
   correcto.
5. **Accesibilidad:** sin violaciones críticas axe/Lighthouse; operable por teclado; contraste AA.
6. **Privacidad:** sin tracking ni geolocalización antes del consentimiento; sin PII ni
   contenido del chat en analítica.
7. **Calidad de código:** `npm run lint`, `npm run test` y `npm run build` en verde; sin
   `console.error`; revisado en PR.
8. **Métrica ética:** si la historia toca analítica, mide acciones de ayuda, no engagement
   (nada de "tiempo en página" como éxito).
9. **Documentado:** README/`docs/` y esta lista de fuentes/FAQ actualizados si cambió el dato,
   la línea o el proceso.
10. **Desplegado:** verificado en el build de GitHub Pages (`base: /sigamos/`) con la ruta real.
