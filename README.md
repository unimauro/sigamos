# Sigamos — Estamos contigo 🧭

Dashboard web de **concientización y prevención del suicidio**: estadísticas globales,
directorio de líneas de ayuda por país y recursos de prevención. Cada vida es una
historia que vale la pena continuar.

**En vivo:** https://unimauro.github.io/sigamos/

## Qué incluye

- **Panorama con datos** — cifras globales, análisis por género, edad, factores
  económicos e impacto de las redes sociales (gráficos con Recharts).
- **Directorio de líneas de ayuda** — con detección automática del país del visitante
  para mostrar la línea local (`useCountryHelpline`).
- **Recursos de prevención** — señales de alerta, cómo ayudar y qué decir / qué no.
- **Chat de acompañamiento** — un asistente cálido cuyo objetivo es animar a la persona
  a **hablar de lo que le pasa con alguien real, de preferencia en persona**, y a
  contactar una línea de ayuda. Ver detalle abajo.
- **Multi-idioma** (8 idiomas) y lectura en voz alta del mensaje principal.

## Chat de acompañamiento

Componente: `src/components/SupportChat.tsx` · motor: `src/lib/support-chat.ts`.

- **Seguro por defecto y sin backend.** Funciona 100% en modo guiado sobre GitHub Pages.
  Todo el texto vive en i18n (`chat.*`).
- **Detección de crisis determinista** (ES + EN): ante señales de riesgo muestra de
  inmediato la línea de ayuda del país del visitante. Ofrecer ayuda nunca hace daño;
  ante la duda, escala.
- **Enfoque:** no reemplaza a un profesional ni a una persona; es un *puente* que ayuda
  a dar el paso de conversar cara a cara con alguien de confianza.

### Capa de IA opcional (gateway ai.tunky.net)

Desactivada salvo que definas variables de entorno de build. Sin ellas, el chat sigue
completo en modo guiado.

```bash
# .env.local (NO commitear)
VITE_TUNKY_TOKEN=<token del gateway — pedir a Carlos>
VITE_TUNKY_GATEWAY=https://ai.tunky.net/v1/chat   # opcional, este es el valor por defecto
```

El gateway protege el token con allowlist de Origin (incluye `unimauro.github.io`).
El `systemPrompt` está en `chat.systemPrompt` (es/en) y restringe al modelo a acompañar
y derivar hacia ayuda humana real. Aun con IA activa, la detección de crisis se ejecuta
sobre el mensaje del usuario **y** sobre la respuesta del modelo.

## Integridad de datos y fuentes

Regla dura del proyecto: **no inventar cifras; todo dato debe ser trazable.**

- Registro central de fuentes en `src/data/sources.ts`; cada gráfico muestra su fuente
  con enlace mediante `src/components/ChartSource.tsx`, y la sección **Fuentes y FAQ**
  (`src/components/SourcesFaq.tsx`) las consolida.
- Las series que no corresponden a una tabla oficial verificable se marcan como
  **"datos ilustrativos"** en la propia UI (nunca se presentan como cifras oficiales).
- Fuentes principales: **OMS** (*Suicide worldwide in 2021*; tasas por país 2019, crudas),
  **GBD 2021** (The Lancet) y **Banco Mundial** (PIB, desempleo).
- Una auditoría con agentes adversariales verificó las cifras contra estas fuentes y
  aplicó correcciones (p. ej. África masculino 10.1→18.4, ratio H/M 2.5→2.3,
  ciberacoso "1 de 5"→46% Pew 2022). Los CSV de `public/data/` son trazables pero hoy
  no se leen en runtime (pendiente en el backlog).

## Analítica

**Google Analytics 4** (`gtag.js` en `index.html`, ID `G-2PEP1EE6FE`) con
`anonymize_ip: true`. El Measurement ID es público, así que va directo en el HTML
(funciona en el build de GitHub Pages sin variables en el CI).

## SEO / redes

- Open Graph + Twitter Card completos en `index.html` (`og:image` = `public/og-image.jpg`).
- `link rel="canonical"`, `sitemap.xml` (referenciado en `robots.txt`) y **JSON-LD**
  (`WebSite`, `MedicalWebPage`, `FAQPage`).

## Seguridad y backlog

- Revisión de seguridad adversarial: **`docs/SECURITY-REVIEW.md`** (sin XSS explotable;
  pendientes: fallback de línea de crisis fuera de EE. UU., `npm audit fix`, endurecer
  el token del gateway).
- Backlog de producto (Product Owner): **`docs/BACKLOG.md`** (épicas, historias con
  criterios de aceptación y Top 15 priorizado).

## Desarrollo

```bash
npm ci
npm run dev      # http://localhost:8080/sigamos/
npm run build    # genera dist/
npm run test     # vitest
```

## Deploy

Push a `main` dispara el workflow `.github/workflows/deploy.yml`, que construye y publica
en **GitHub Pages** (`base: /sigamos/`).

## Stack

Vite · React · TypeScript · Tailwind · shadcn-ui · Recharts · react-i18next · framer-motion.

## Datos

Fuentes en `public/data/` (OMS y otras). Regla del proyecto: no inventar cifras.

---

Proyecto de **Carlos Mauro Cárdenas** ([@unimauro](https://github.com/unimauro)).
