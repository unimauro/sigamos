# Revisión de seguridad y privacidad — Sigamos

- **Proyecto:** Sigamos (dashboard React 18 + Vite + Tailwind + shadcn de prevención del suicidio)
- **Despliegue:** GitHub Pages — https://unimauro.github.io/sigamos/ (SPA estático, sin backend propio)
- **Fecha:** 2026-09-10
- **Alcance:** auditoría de solo lectura (XSS, secretos en el bundle, privacidad, cabeceras, dependencias, canales de crisis). No se modificó código.

---

## Resumen ejecutivo

El estado de seguridad es **bueno para un SPA estático**. No se encontró ninguna vulnerabilidad crítica ni un XSS explotable: las respuestas del LLM y el texto del usuario se renderizan como texto plano (`{m.text}`), por lo que React los escapa automáticamente; todos los enlaces `target="_blank"` llevan `rel="noopener noreferrer"`; y no hay uso peligroso de `innerHTML`, `eval` ni `document.write`. El `dangerouslySetInnerHTML` que existe (`chart.tsx`) es el de shadcn/ui y solo interpola colores definidos por el desarrollador, no entrada del usuario.

Los puntos de atención son de configuración y privacidad, no de código explotable:

1. **`VITE_TUNKY_TOKEN` quedaría embebido en el bundle** si se compila con el token. Cualquier variable `VITE_*` es pública en el JS servido. Verifiqué el `dist/` actual: **está limpio** (se compiló sin token). La única protección real es la **allowlist de Origin del gateway**; el token debe tratarse como identificador de bajo privilegio, no como secreto.
2. **Sin CSP ni SRI**, y **GA4 sin anonimización ni aviso de consentimiento** en un sitio de salud mental.
3. **Privacidad**: la IP del visitante sale hacia `ipapi.co`, GA4 rastrea la navegación y —si el gateway está activo— el texto del chat sale hacia `ai.tunky.net`. El disclaimer "este chat no guarda tus mensajes" es cierto para la app, pero no cubre lo que hagan el gateway y el proveedor del LLM.
4. **Fiabilidad de crisis**: si la geolocalización falla (adblock, ipapi caído), el fallback es **988 (solo válido en EE. UU./Canadá)**, que no funciona en el resto del mundo.
5. `npm audit`: 12 vulnerabilidades (10 altas), **todas transitivas/dev**; ninguna es explotable en runtime en este SPA. Se corrigen con `npm audit fix`.

---

## Tabla de hallazgos

| Sev. | Hallazgo | Archivo:línea | Recomendación |
|------|----------|---------------|---------------|
| **Media** | `VITE_TUNKY_TOKEN` se incrusta en texto plano en el bundle si se compila con token (toda var `VITE_*` es pública). El `dist/` actual está limpio, pero el flujo de build con token lo expondría. | `src/lib/support-chat.ts:183`; `.env.example`; `README.md:40` | Asumir que el token es público. Endurecer el gateway: allowlist estricta de Origin, **rate limiting por IP/Origin**, cuota diaria y **rotación periódica** del token. Documentar que NO es un secreto. Idealmente, mover la llamada al LLM detrás de un endpoint sin token en cliente (proxy con su propia auth). |
| **Media** | Sin Content-Security-Policy. GitHub Pages no permite CSP por cabecera, pero falta `<meta http-equiv="Content-Security-Policy">`. | `index.html` (head) | Añadir meta CSP restrictiva: `default-src 'self'`; `script-src 'self' https://www.googletagmanager.com`; `connect-src 'self' https://ai.tunky.net https://ipapi.co https://*.google-analytics.com`; `style-src 'self' 'unsafe-inline'`; `img-src 'self' data: https:`; `frame-ancestors 'none'`. Probar en modo report-only primero. |
| **Media** | GA4 (gtag.js) sin `anonymize_ip`, sin señales de consentimiento ni banner, en un sitio sensible de salud mental. GA recibe IP + navegación de personas potencialmente en crisis. | `index.html:34-39` | Configurar `gtag('config', 'G-2PEP1EE6FE', { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false })`. Añadir aviso de privacidad breve. Evaluar una alternativa sin cookies/PII (p. ej. Plausible) o desactivar GA. |
| **Media** | Fallback de línea de crisis = `988`, válido solo en EE. UU./Canadá. Si `ipapi.co` falla o es bloqueado, un usuario fuera de esos países recibe un número inservible. | `src/hooks/use-country-helpline.ts:92-96` | Cambiar el default a un recurso internacional real (p. ej. findahelpline.com / IASP) o a texto que invite a buscar la línea local + emergencias generales, en vez de un número nacional de otro país. |
| **Baja** | Sin Subresource Integrity (SRI) en el script externo `gtag.js`. Si Google/CDN se viera comprometido, se ejecutaría script arbitrario. | `index.html:34` | gtag.js no soporta SRI estable (Google actualiza el archivo), por eso la CSP con `script-src` allowlist es la mitigación práctica. Para cualquier otro script de terceros fijo, sí añadir `integrity` + `crossorigin`. |
| **Baja** | El disclaimer promete "este chat no guarda tus mensajes", pero si el gateway está activo, el texto sale a `ai.tunky.net` y al proveedor del LLM, cuya retención no controla la app. | `src/i18n/locales/es.json:247`; `en.json:247` | Matizar el texto: la web no almacena mensajes; aclarar que al usar la capa de IA el mensaje se procesa en un servicio externo. Confirmar la política de retención del gateway/LLM. |
| **Baja** | `dangerouslySetInnerHTML` en el componente chart de shadcn. Interpola solo colores del `ChartConfig` (definidos por el desarrollador), no entrada de usuario → no explotable hoy. | `src/components/ui/chart.tsx:70` | Sin acción urgente. No pasar nunca valores derivados de usuario/red al `ChartConfig.color/theme`. |
| **Baja** | `i18next` con `interpolation.escapeValue: false` (estándar en react-i18next porque React escapa al render). Se vuelve riesgo solo si algún día se interpola entrada de usuario en una clave `t()`. Hoy no ocurre. | `src/i18n/index.ts:35` | Mantener la regla: nunca interpolar texto de usuario/gateway dentro de traducciones. Si se necesitara, sanitizar explícitamente. |
| **Baja** | `console.error` registra el `pathname` de rutas 404 en la consola del navegador. Info mínima; en este sitio las rutas no llevan PII. | `src/pages/NotFound.tsx:8` | Aceptable. Quitar el log o no incluir datos sensibles si en el futuro las rutas los tuvieran. |
| **Baja** | `npm audit`: 12 vulnerabilidades (1 baja, 1 media, 10 altas). Todas transitivas/de tooling (`react-router`/`@remix-run/router` open-redirect+XSS, `brace-expansion`, `glob`, `lodash`, `minimatch`, `nanoid`, `picomatch`, `yaml`). El open-redirect de react-router **no es alcanzable**: la app solo define `/` y `*`, sin redirects ni rutas con path controlado por usuario. El resto son dependencias de build (ReDoS/DoS en el toolchain, no en runtime). | `package.json` (deps) | Ejecutar `npm audit fix` (actualiza `react-router-dom` a >= 6.30.3 y parcha las transitivas). Volver a compilar y verificar. Sin urgencia de explotación, pero conviene por higiene. |

---

## Privacidad (sitio de salud mental)

Datos que salen del navegador del visitante:

- **IP → `ipapi.co`** (`src/hooks/use-country-helpline.ts:114`): se envía la IP a un tercero para geolocalizar el país y elegir la línea de ayuda. Se cachea solo el `country_code` en `sessionStorage` (no la IP). El fetch tiene timeout (5 s) y `try/catch` que degrada al default de forma segura.
- **Navegación → Google Analytics 4** (`index.html`): pageviews e IP (sin `anonymize_ip`). En un contexto de crisis, esto puede considerarse dato sensible.
- **Texto del chat → `ai.tunky.net`** (solo si `VITE_TUNKY_TOKEN` está presente; `src/lib/support-chat.ts:196-224`): se envía el historial de la conversación y el system prompt al gateway y de ahí al LLM. Por defecto (GitHub Pages sin token) esta capa está **desactivada** y el chat funciona 100% local (modo guiado), lo cual es la opción más privada.

Buenas prácticas ya presentes:
- El chat **no persiste** mensajes: viven solo en el estado de React y se pierden al recargar; no hay `localStorage`/`sessionStorage` de mensajes (solo `user_country` e idioma).
- **No se filtra info sensible en la URL/query** (rutas `/` y `*`; no se ponen mensajes ni estado del chat en la URL, así que no llegan al `document.location` que GA registra).
- La detección de crisis es **determinista y local** (`isCrisis`), no depende del gateway, y se ejecuta también sobre la respuesta del LLM como salvaguarda (`SupportChat.tsx:110, 126`).
- No hay números personales ni correos incrustados (`940584307`, `carlos@cardenas.pe`, `ia2cloud...`): grep sin resultados en `src/`, `public/`, `index.html`, `dist/`.

Brechas de privacidad a cerrar: anonimizar/consentir GA (ver tabla), matizar el disclaimer sobre el gateway, y publicar un aviso de privacidad corto que liste ipapi.co, GA y (si se activa) ai.tunky.net.

---

## Canales de crisis (fiabilidad)

- El número de **WhatsApp de crisis retirado ya NO aparece**: no hay número personal ni un WhatsApp "global" hardcodeado. Los únicos `wa.me` que quedan salen de datos por país y **solo Argentina** define `whatsapp` (`use-country-helpline.ts:19`, `HelplineDirectory.tsx:27`); el resto de países no muestran botón de WhatsApp.
- Enlaces `tel:` construidos con `helpline.phone.replace(/\s/g,"")` — correcto.
- **Riesgo real:** el fallback 988 no sirve fuera de EE. UU./Canadá (ver tabla, severidad media). Es el punto más importante de "canal que podría fallar".

---

## Checklist de hardening priorizado

**Prioridad 1 — hacer ahora (bajo costo, alto impacto)**
- [ ] Cambiar el fallback de helpline de `988` a un recurso internacional o mensaje genérico (`use-country-helpline.ts:92`).
- [ ] Configurar GA4 con `anonymize_ip: true`, `allow_google_signals: false`, `allow_ad_personalization_signals: false` (`index.html`).
- [ ] Confirmar/documentar el endurecimiento del gateway: **rate limiting**, cuota y **rotación del token**; asumir el token como público. Nunca commitear el `.env` real (ya está en `.gitignore`).
- [ ] `npm audit fix` y recompilar; verificar que el sitio sigue funcionando.

**Prioridad 2 — pronto**
- [ ] Añadir `<meta http-equiv="Content-Security-Policy">` (empezar en report-only) con allowlist de `connect-src` (self, ai.tunky.net, ipapi.co, google-analytics) y `frame-ancestors 'none'`.
- [ ] Matizar el disclaimer del chat sobre el procesamiento externo cuando la IA está activa (`es.json`/`en.json:247` y demás idiomas).
- [ ] Publicar un aviso de privacidad breve (ipapi.co, GA, ai.tunky.net).

**Prioridad 3 — mantenimiento / defensa en profundidad**
- [ ] Mantener la invariante: nunca interpolar texto de usuario/gateway en claves i18n ni en `ChartConfig`.
- [ ] Evaluar migrar la analítica a una alternativa sin PII (Plausible/Umami) o retirarla.
- [ ] Evaluar mover la llamada al LLM a un proxy con auth propia para eliminar por completo cualquier credencial en el cliente.
- [ ] Añadir `integrity`+`crossorigin` a cualquier script de terceros de versión fija que se sume en el futuro.

---

## Verificaciones realizadas (evidencia)

- Sin XSS explotable: respuesta del LLM y entrada del usuario renderizadas como texto (`SupportChat.tsx:234`), React escapa. Sin `innerHTML`/`eval`/`document.write` en `src/`.
- Único `dangerouslySetInnerHTML`: shadcn chart, solo colores del desarrollador (`chart.tsx:70`).
- Todos los `target="_blank"` con `rel="noopener noreferrer"` (PreventionResources, CoffeeButton, HelplineDirectory, EmergencyBar, SupportChat, DashboardFooter, ChartSource).
- `dist/` actual **no contiene** referencias a `ai.tunky.net`, `X-Client-Token` ni `VITE_TUNKY` → compilado sin token.
- Fetches con `try/catch` + `AbortSignal.timeout` (ipapi 5 s, gateway 12 s) y degradación segura; el gateway devuelve `null` ante cualquier fallo.
- `npm audit --omit=dev`: 12 vulnerabilidades, todas transitivas/tooling; open-redirect de react-router no alcanzable (solo rutas `/` y `*`).
