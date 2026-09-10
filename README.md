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

## Analítica (opcional, sin cookies)

Cableada con **GoatCounter** (`src/lib/analytics.ts`): sin cookies, anónima y sin
banner de consentimiento — apropiado para un sitio de salud mental. **No usamos
Google Analytics** a propósito. Se activa solo si defines `VITE_GOATCOUNTER` con la
URL de conteo de tu sitio (créalo gratis en goatcounter.com); sin esa variable no se
carga nada.

```bash
VITE_GOATCOUNTER=https://sigamos.goatcounter.com/count
```

## SEO / redes

Open Graph + Twitter Card completos en `index.html` (título, descripción, `og:image`
= `public/og-image.jpg`, `og:url` = https://unimauro.github.io/sigamos/, `og:locale`).

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
