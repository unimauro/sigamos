import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Heart, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

import { useCountryHelpline } from "@/hooks/use-country-helpline";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const { helpline } = useCountryHelpline();
  const phoneLink = `tel:${helpline.phone.replace(/\s/g, "")}`;
  const hasPhone = Boolean(helpline.phone);

  const shuffle = useCallback((arr: string[]) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const [shuffledMessages, setShuffledMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const messages: string[] = t('hero.inspirational', { returnObjects: true }) as string[];
    if (messages?.length) {
      setShuffledMessages(shuffle(messages));
      setCurrentIndex(0);
    }
  }, [i18n.language, t, shuffle]);

  useEffect(() => {
    if (!shuffledMessages.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shuffledMessages]);

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <img
          src={`${import.meta.env.BASE_URL}hero-image.jpg`}
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Heart className="w-4 h-4" />
          {t('hero.badge')}
        </motion.div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground leading-[1.1]">
          {t('hero.title')}
        </h1>

        {/* Inspirational message slider */}
        <div className="h-16 sm:h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {shuffledMessages.length > 0 && (
              <motion.p
                key={currentIndex}
                className="text-lg sm:text-xl text-primary/80 font-medium max-w-2xl mx-auto italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                "{shuffledMessages[currentIndex]}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Emergency CTA */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="emergency" size="lg" asChild className="text-base px-8 py-6">
            {hasPhone ? (
              <a href={phoneLink}>
                <Phone className="w-5 h-5" />
                {t('hero.callCrisis')} {helpline.phone}
              </a>
            ) : (
              <a href="#helplines">
                <Phone className="w-5 h-5" />
                {t('hero.findHelp')}
              </a>
            )}
          </Button>
          <Button variant="hopeful" size="lg" asChild className="text-base px-8 py-6">
            <a href="#helplines">
              {t('hero.findHelp')}
            </a>
          </Button>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => window.dispatchEvent(new Event('open-support-chat'))}
          className="text-sm text-primary/80 underline underline-offset-4 hover:text-primary transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t('hero.talkFirst')}
        </motion.button>

        <motion.p
          className="text-sm text-muted-foreground pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {helpline.organization} — {helpline.country}
        </motion.p>

      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ArrowDown className="w-5 h-5 text-muted-foreground/50" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
