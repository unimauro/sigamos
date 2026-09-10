import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, LabelList } from "recharts";
import { useTranslation } from "react-i18next";
import ChartSource from "./ChartSource";

const COLORS = {
  male: "hsl(217, 91%, 65%)",
  female: "hsl(173, 80%, 40%)",
};

const GenderAnalysis = () => {
  const { t } = useTranslation();

  const regionData = [
    { region: t('gender.regionAmericas'), male: 16.2, female: 4.8 },
    { region: t('gender.regionEurope'), male: 20.1, female: 5.4 },
    { region: t('gender.regionSEAsia'), male: 12.4, female: 8.1 },
    { region: t('gender.regionWPacific'), male: 12.8, female: 6.2 },
    { region: t('gender.regionAfrica'), male: 18.4, female: 5.8 },
    { region: t('gender.regionEMed'), male: 5.6, female: 2.9 },
  ];

  const trendData = [
    { year: "2000", male: 18.6, female: 7.2 },
    { year: "2005", male: 17.4, female: 6.8 },
    { year: "2010", male: 16.2, female: 6.1 },
    { year: "2015", male: 14.8, female: 5.5 },
    { year: "2020", male: 13.5, female: 5.0 },
  ];

  const insightCards = [
    { text: t('gender.insight1'), icon: "\ud83d\udcca" },
    { text: t('gender.insight2'), icon: "\ud83d\udcc8" },
    { text: t('gender.insight3'), icon: "\ud83d\udd0d" },
  ];

  const maleFactors = [
    t('gender.maleFactor1'),
    t('gender.maleFactor2'),
    t('gender.maleFactor3'),
    t('gender.maleFactor4'),
  ];

  const femaleFactors = [
    t('gender.femaleFactor1'),
    t('gender.femaleFactor2'),
    t('gender.femaleFactor3'),
    t('gender.femaleFactor4'),
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-soft text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="mt-1">
            {p.name}: {p.value} {t('gender.per100k')}
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('gender.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('gender.subtitle')}
          </p>
        </motion.div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {insightCards.map((card) => (
            <motion.div
              key={card.text}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl">{card.icon}</span>
              <p className="text-foreground font-medium mt-3 leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: By Region */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('gender.ratesByRegion')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData} barGap={2}>
                <XAxis dataKey="region" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="male" name={t('gender.male')} fill={COLORS.male} radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="male" position="top" style={{ fontSize: 10, fill: "hsl(215, 16%, 47%)" }} />
                </Bar>
                <Bar dataKey="female" name={t('gender.female')} fill={COLORS.female} radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="female" position="top" style={{ fontSize: 10, fill: "hsl(215, 16%, 47%)" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartSource sources={["who2021"]} illustrative note={t('sources.noteRegional')} />
          </motion.div>

          {/* Line Chart: Historical Trend */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('gender.historicalTrend')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="male" name={t('gender.male')} stroke={COLORS.male} strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="female" name={t('gender.female')} stroke={COLORS.female} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <ChartSource sources={["who2021", "owid"]} illustrative note={t('sources.noteEstimate')} />
          </motion.div>
        </div>

        {/* Contributing Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-8 rounded-2xl overflow-hidden border border-border">
          <div className="p-8 bg-secondary/5">
            <h3 className="text-lg font-semibold mb-4 text-secondary">{t('gender.contributingMale')}</h3>
            <ul className="space-y-3">
              {maleFactors.map((f) => (
                <li key={f} className="flex items-start gap-3 text-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-primary/5">
            <h3 className="text-lg font-semibold mb-4 text-primary">{t('gender.contributingFemale')}</h3>
            <ul className="space-y-3">
              {femaleFactors.map((f) => (
                <li key={f} className="flex items-start gap-3 text-foreground/80">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderAnalysis;
