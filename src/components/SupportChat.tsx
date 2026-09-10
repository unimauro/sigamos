import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, Send, X, RotateCcw, Phone, LifeBuoy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCountryHelpline } from "@/hooks/use-country-helpline";
import {
  NODES,
  START_NODE,
  ACTION_HELPLINE,
  ACTION_PREVENTION,
  isCrisis,
  gatewayEnabled,
  askGateway,
  type ChatOption,
  type GatewayMessage,
} from "@/lib/support-chat";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  options?: ChatOption[];
  helpline?: boolean;
}

const SupportChat = () => {
  const { t } = useTranslation();
  const { helpline } = useCountryHelpline();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = () => ++idRef.current;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const pushBotNode = useCallback(
    (nodeId: string) => {
      const node = NODES[nodeId];
      if (!node) return;
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "bot", text: t(node.textKey), options: node.options },
      ]);
    },
    [t],
  );

  const pushHelpline = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "bot",
        text: t("chat.crisis.message"),
        helpline: true,
        options: [{ key: "chat.options.restart", next: START_NODE }],
      },
    ]);
  }, [t]);

  // Inicializa la conversación la primera vez que se abre.
  useEffect(() => {
    if (open && messages.length === 0) pushBotNode(START_NODE);
  }, [open, messages.length, pushBotNode]);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, typing, open, scrollToBottom]);

  // Permite abrir el chat desde otros botones de la página.
  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-support-chat", openHandler);
    return () => window.removeEventListener("open-support-chat", openHandler);
  }, []);

  const handleOption = (opt: ChatOption) => {
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: t(opt.key) }]);
    if (opt.next === ACTION_HELPLINE) {
      pushHelpline();
    } else if (opt.next === ACTION_PREVENTION) {
      document.getElementById("prevention")?.scrollIntoView({ behavior: "smooth" });
      pushBotNode("bridge");
    } else {
      pushBotNode(opt.next);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }]);

    // 1) La detección de crisis manda, siempre.
    if (isCrisis(text)) {
      pushHelpline();
      return;
    }

    // 2) Capa IA opcional (si hay token configurado).
    if (gatewayEnabled()) {
      setTyping(true);
      const history: GatewayMessage[] = messages
        .filter((m) => m.text)
        .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      history.push({ role: "user", content: text });
      const reply = await askGateway(t("chat.systemPrompt"), history);
      setTyping(false);
      if (reply) {
        // Salvaguarda: revisa la respuesta del modelo por si toca escalar.
        if (isCrisis(reply)) {
          pushHelpline();
          return;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "bot",
            text: reply,
            options: NODES.fallback.options,
          },
        ]);
        return;
      }
    }

    // 3) Modo guiado (por defecto).
    pushBotNode("fallback");
  };

  const restart = () => {
    setMessages([]);
    idRef.current = 0;
    pushBotNode(START_NODE);
  };

  const lastMessage = messages[messages.length - 1];
  const phoneLink = `tel:${helpline.phone.replace(/\s/g, "")}`;
  const hasPhone = Boolean(helpline.phone);

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("chat.fabLabel")}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0 : 1 }}
        transition={{ delay: 1.5, duration: 0.3 }}
      >
        <HeartHandshake className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:inline">{t("chat.fabLabel")}</span>
      </motion.button>

      {/* Panel del chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-0 right-0 sm:bottom-20 sm:right-4 z-50 flex flex-col w-full sm:w-[380px] h-[85vh] sm:h-[560px] sm:max-h-[calc(100vh-6rem)] bg-card border border-border sm:rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            role="dialog"
            aria-label={t("chat.title")}
          >
            {/* Encabezado */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <HeartHandshake className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{t("chat.title")}</p>
                  <p className="text-[11px] opacity-80 leading-tight">{t("chat.headerSub")}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={restart}
                  aria-label={t("chat.options.restart")}
                  className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("chat.close")}
                  className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Acceso directo a ayuda inmediata */}
            <button
              type="button"
              onClick={pushHelpline}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/15 transition-colors shrink-0"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              {t("chat.needHelpNow")}
            </button>

            {/* Mensajes */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm"
                        : "max-w-[90%] rounded-2xl rounded-bl-sm bg-muted text-foreground px-3.5 py-2 text-sm leading-relaxed"
                    }
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Tarjeta de línea de ayuda */}
                    {m.helpline && (
                      <div className="mt-3 rounded-xl bg-card border border-border p-3 space-y-2">
                        <p className="text-xs font-semibold text-foreground">
                          {helpline.organization} · {helpline.country}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="emergency" size="sm" asChild>
                            {hasPhone ? (
                              <a href={phoneLink}>
                                <Phone className="w-4 h-4" />
                                {helpline.phone}
                              </a>
                            ) : (
                              <a href={helpline.url || "https://findahelpline.com/"} target="_blank" rel="noopener noreferrer">
                                <Phone className="w-4 h-4" />
                                {t("emergency.findHelpline")}
                              </a>
                            )}
                          </Button>
                          {helpline.whatsapp && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            >
                              <a
                                href={`https://wa.me/${helpline.whatsapp.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <WhatsAppIcon />
                                WhatsApp
                              </a>
                            </Button>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">{t("chat.crisis.stay")}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" />
                    </span>
                  </div>
                </div>
              )}

              {/* Opciones (solo del último mensaje del bot) */}
              {lastMessage?.role === "bot" && lastMessage.options && !typing && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {lastMessage.options.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleOption(opt)}
                      className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      {t(opt.key)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Entrada de texto */}
            <div className="border-t border-border p-2.5 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chat.inputPlaceholder")}
                  aria-label={t("chat.inputPlaceholder")}
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0" aria-label={t("chat.send")} disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="mt-1.5 px-1 text-[10px] leading-tight text-muted-foreground text-center">
                {t("chat.disclaimer")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportChat;
