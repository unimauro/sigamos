// Analítica opcional, sin cookies y anónima (GoatCounter).
//
// Por qué GoatCounter y no Google Analytics: este es un sitio de salud mental.
// No debemos usar cookies ni rastrear individuos vulnerables, ni obligar a un
// banner de consentimiento. GoatCounter no usa cookies, no recoge datos
// personales y no necesita banner. Alternativa equivalente: Cloudflare Web
// Analytics.
//
// Se activa solo si defines VITE_GOATCOUNTER con la URL de conteo de tu sitio,
// p. ej. https://sigamos.goatcounter.com/count (créala gratis en goatcounter.com).
// Sin esa variable, no se carga nada.

export function initAnalytics(): void {
  const endpoint = import.meta.env.VITE_GOATCOUNTER as string | undefined;
  if (!endpoint) return;
  if (document.querySelector('script[data-goatcounter]')) return;

  const script = document.createElement("script");
  script.src = "https://gc.zgo.at/count.js";
  script.async = true;
  script.setAttribute("data-goatcounter", endpoint);
  document.head.appendChild(script);
}
