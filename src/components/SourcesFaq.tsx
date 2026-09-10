import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SOURCES, SOURCE_ORDER } from "@/data/sources";

const SourcesFaq = () => {
  const { t } = useTranslation();

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section id="fuentes" className="px-6 py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            {t("sources.sectionBadge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t("sources.sectionTitle")}</h2>
          <p className="text-muted-foreground mt-3 text-lg">{t("sources.sectionSubtitle")}</p>
        </motion.div>

        {/* FAQ */}
        <Accordion type="single" collapsible className="mb-12">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Lista de referencias */}
        <div className="rounded-2xl bg-card border border-border shadow-soft p-8">
          <h3 className="text-lg font-semibold mb-2">{t("sources.referencesTitle")}</h3>
          <p className="text-sm text-muted-foreground mb-5">{t("sources.disclaimer")}</p>
          <ul className="space-y-3">
            {SOURCE_ORDER.map((key) => (
              <li key={key}>
                <a
                  href={SOURCES[key].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 text-sm text-foreground/85 hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <span className="underline underline-offset-2 decoration-border group-hover:decoration-primary">
                    {SOURCES[key].label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SourcesFaq;
