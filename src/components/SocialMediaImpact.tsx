import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { ShieldAlert, ShieldCheck, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCountryHelpline } from "@/hooks/use-country-helpline";
import ChartSource from "./ChartSource";

const usageData = [
  { age: "13\u201317", hours: 4.8, ideation: 18 },
  { age: "18\u201324", hours: 5.2, ideation: 15 },
  { age: "25\u201334", hours: 3.8, ideation: 9 },
];

const SocialMediaImpact = () => {
  const { t } = useTranslation();
  const { helpline } = useCountryHelpline();

  const localHelplineText = `${t('social.helpful1')}: ${helpline.phone} — ${helpline.organization} (${helpline.country})`;

  const harmful = [
    t('social.harmful1'), t('social.harmful2'), t('social.harmful3'),
    t('social.harmful4'), t('social.harmful5'), t('social.harmful6'),
  ];

  const helpful = [
    localHelplineText, t('social.helpful2'), t('social.helpful3'),
    t('social.helpful4'), t('social.helpful5'), t('social.helpful6'),
  ];

  const statCards = [
    { stat: t('social.stat1Value'), text: t('social.stat1Text') },
    { stat: t('social.stat2Value'), text: t('social.stat2Text') },
    { stat: t('social.stat3Value'), text: t('social.stat3Text') },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-soft text-sm">
        <p className="font-semibold text-foreground">Age {label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="mt-1">
            {p.name}: {p.value}{p.name.includes("Hours") || p.name.includes(t('social.avgHours')) ? " hrs/day" : "%"}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="px-6 py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('social.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('social.subtitle')}
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {statCards.map((card) => (
            <motion.div
              key={card.stat}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-bold text-primary">{card.stat}</p>
              <p className="text-muted-foreground mt-2 text-sm">{card.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mb-12 -mt-8">
          <ChartSource sources={["twenge2018", "pew2022", "harris2024"]} />
        </div>

        {/* Chart */}
        <motion.div
          className="p-8 rounded-2xl bg-card border border-border shadow-soft mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-6">{t('social.chartTitle')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData} barGap={4} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hours" name={t('social.avgHours')} fill="hsl(217, 91%, 65%)" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="hours" position="top" style={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
              </Bar>
              <Bar dataKey="ideation" name={t('social.ideationRate')} fill="hsl(173, 80%, 30%)" radius={[6, 6, 0, 0]}>
                <LabelList dataKey="ideation" position="top" formatter={(v: number) => `${v}%`} style={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <ChartSource sources={["twenge2018"]} illustrative note={t('sources.noteExample')} />
        </motion.div>

        {/* Dual perspective */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border">
          <div className="p-8 bg-accent/5">
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">{t('social.harmfulTitle')}</h3>
            </div>
            <ul className="space-y-3">
              {harmful.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{t('social.helpfulTitle')}</h3>
            </div>
            <ul className="space-y-3">
              {helpful.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaImpact;
