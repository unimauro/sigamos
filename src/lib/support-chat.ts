// Motor de conversación del chat de acompañamiento de Sigamos.
//
// Filosofía (heredada de la lógica de crisis del proyecto Suyay):
//  - Este chat NO es un profesional ni reemplaza a una persona. Su propósito es
//    ayudar a quien escribe a dar UN paso concreto: hablar de lo que le pasa con
//    alguien de carne y hueso, de preferencia en persona, y con líneas de ayuda.
//  - Ante cualquier señal de crisis, escala: muestra la línea de ayuda del país
//    de inmediato. Es preferible ofrecer ayuda de más que dejar pasar una señal.
//  - Todo el texto visible vive en i18n; aquí solo está el grafo de la conversación
//    (referencias a claves) y la red determinista de detección de crisis.

export interface ChatOption {
  /** clave i18n de la etiqueta del botón */
  key: string;
  /** id del siguiente nodo, o una acción especial con prefijo "__" */
  next: string;
}

export interface ChatNode {
  /** clave i18n del mensaje del bot */
  textKey: string;
  options: ChatOption[];
}

// Acciones especiales que el componente interpreta en vez de navegar a un nodo.
export const ACTION_HELPLINE = "__helpline";
export const ACTION_PREVENTION = "__prevention";

export const START_NODE = "greeting";

export const NODES: Record<string, ChatNode> = {
  greeting: {
    textKey: "chat.nodes.greeting",
    options: [
      { key: "chat.options.lonely", next: "lonely" },
      { key: "chat.options.sad", next: "sad" },
      { key: "chat.options.anxious", next: "anxious" },
      { key: "chat.options.other", next: "other" },
      { key: "chat.options.justTalk", next: "bridge" },
    ],
  },
  lonely: {
    textKey: "chat.nodes.lonely",
    options: [{ key: "chat.options.continue", next: "bridge" }],
  },
  sad: {
    textKey: "chat.nodes.sad",
    options: [{ key: "chat.options.continue", next: "bridge" }],
  },
  anxious: {
    textKey: "chat.nodes.anxious",
    options: [{ key: "chat.options.continue", next: "bridge" }],
  },
  other: {
    textKey: "chat.nodes.other",
    options: [
      { key: "chat.options.howHelp", next: "howToHelp" },
      { key: "chat.options.continue", next: "bridge" },
    ],
  },
  howToHelp: {
    textKey: "chat.nodes.howToHelp",
    options: [
      { key: "chat.options.openHelpSection", next: ACTION_PREVENTION },
      { key: "chat.options.continue", next: "bridge" },
    ],
  },
  // Nodo central: invitar a hablar en persona con alguien real.
  bridge: {
    textKey: "chat.nodes.bridge",
    options: [
      { key: "chat.options.yesSomeone", next: "yesSomeone" },
      { key: "chat.options.noOne", next: "noOne" },
      { key: "chat.options.howStart", next: "openingLines" },
    ],
  },
  yesSomeone: {
    textKey: "chat.nodes.yesSomeone",
    options: [
      { key: "chat.options.howStart", next: "openingLines" },
      { key: "chat.options.done", next: "closing" },
    ],
  },
  noOne: {
    textKey: "chat.nodes.noOne",
    options: [
      { key: "chat.options.helplineNow", next: ACTION_HELPLINE },
      { key: "chat.options.howStart", next: "openingLines" },
    ],
  },
  openingLines: {
    textKey: "chat.nodes.openingLines",
    options: [
      { key: "chat.options.helplineNow", next: ACTION_HELPLINE },
      { key: "chat.options.restart", next: "greeting" },
      { key: "chat.options.done", next: "closing" },
    ],
  },
  closing: {
    textKey: "chat.nodes.closing",
    options: [{ key: "chat.options.restart", next: "greeting" }],
  },
  // Nodo al que caen los mensajes de texto libre sin señal de crisis.
  fallback: {
    textKey: "chat.nodes.fallback",
    options: [
      { key: "chat.options.howStart", next: "openingLines" },
      { key: "chat.options.helplineNow", next: ACTION_HELPLINE },
      { key: "chat.options.restart", next: "greeting" },
    ],
  },
};

// --- Detección de crisis (determinista, ES + EN) --------------------------

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // quita acentos

// Señales de riesgo. Incluye ideación pasiva, jerga y minimización; ante la duda
// preferimos mostrar la línea de ayuda (ofrecerla nunca hace daño).
const CRISIS_TERMS = [
  // Español
  "suicid",
  "quiero morir",
  "me quiero morir",
  "quiero matarme",
  "matarme",
  "quitarme la vida",
  "acabar con mi vida",
  "acabar con todo",
  "terminar con todo",
  "no quiero seguir",
  "no quiero vivir",
  "ya no quiero vivir",
  "mejor sin mi",
  "estarian mejor sin mi",
  "quiero desaparecer",
  "desaparecer para siempre",
  "hacerme dano",
  "lastimarme",
  "cortarme",
  "no vale la pena vivir",
  "para que seguir",
  "ya no puedo mas",
  "dejar de existir",
  "descansar para siempre",
  "ojala no despertar",
  "no aguanto mas",
  // Inglés / jerga
  "kill myself",
  "want to die",
  "end my life",
  "end it all",
  "dont want to live",
  "better off without me",
  "hurt myself",
  "cut myself",
  "no reason to live",
  "cant go on",
  "kms",
  "unalive",
  "kys",
];

export function isCrisis(text: string): boolean {
  const n = normalize(text);
  return CRISIS_TERMS.some((term) => n.includes(term));
}

// --- Capa IA opcional (gateway ai.tunky.net) ------------------------------
//
// Desactivada salvo que exista VITE_TUNKY_TOKEN. Sin token, el chat funciona
// completo en modo guiado (ideal para GitHub Pages estático). El token se
// protege del lado del gateway con allowlist de Origin; aun así NO lo commitees:
// pásalo por variable de entorno de build.

const GATEWAY_URL =
  (import.meta.env.VITE_TUNKY_GATEWAY as string | undefined) ||
  "https://ai.tunky.net/v1/chat";
const GATEWAY_TOKEN = import.meta.env.VITE_TUNKY_TOKEN as string | undefined;

export const gatewayEnabled = (): boolean => Boolean(GATEWAY_TOKEN);

export interface GatewayMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Pide una respuesta al gateway. Devuelve null ante cualquier fallo para que la
 * UI caiga al modo guiado de forma segura.
 */
export async function askGateway(
  system: string,
  history: GatewayMessage[],
): Promise<string | null> {
  if (!GATEWAY_TOKEN) return null;
  try {
    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Token": GATEWAY_TOKEN,
      },
      body: JSON.stringify({ system, messages: history }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Tolerante a varias formas de respuesta comunes.
    const reply =
      data.reply ??
      data.text ??
      data.content ??
      data.message ??
      data.choices?.[0]?.message?.content;
    return typeof reply === "string" && reply.trim() ? reply.trim() : null;
  } catch {
    return null;
  }
}
