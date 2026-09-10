import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "sigamos_privacy_ack";

const PrivacyNotice = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Si localStorage no está disponible, mostramos el aviso igual.
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* no-op */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label={t("privacy.title")}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md bg-card border border-border shadow-2xl rounded-2xl p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{t("privacy.title")}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t("privacy.text")}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-full bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 hover:bg-primary/90 transition-colors"
                >
                  {t("privacy.ack")}
                </button>
                <a
                  href="#fuentes"
                  onClick={dismiss}
                  className="text-xs text-primary underline underline-offset-2 hover:opacity-80"
                >
                  {t("privacy.learnMore")}
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t("privacy.ack")}
              className="p-1 rounded-full hover:bg-muted transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyNotice;
