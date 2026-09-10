import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useTranslation } from "react-i18next";
import ChartSource from "./ChartSource";

const trendData = [
  { year: "2000", "10\u201319": 3.2, "20\u201329": 12.4, "30\u201349": 15.1, "50\u201369": 18.3, "70+": 22.1 },
  { year: "2005", "10\u201319": 3.5, "20\u201329": 12.0, "30\u201349": 14.6, "50\u201369": 17.5, "70+": 21.0 },
  { year: "2010", "10\u201319": 3.8, "20\u201329": 11.8, "30\u201349": 14.0, "50\u201369": 16.8, "70+": 19.8 },
  { year: "2015", "10\u201319": 4.1, "20\u201329": 11.5, "30\u201349": 13.2, "50\u201369": 15.9, "70+": 18.5 },
  { year: "2020", "10\u201319": 4.5, "20\u201329": 11.2, "30\u201349": 12.8, "50\u201369": 15.2, "70+": 17.2 },
];

const AREA_COLORS = [
  "hsl(173, 80%, 85%)",
  "hsl(173, 80%, 65%)",
  "hsl(173, 80%, 45%)",
  "hsl(217, 91%, 65%)",
  "hsl(217, 91%, 45%)",
];

const AgeGroupDeepDive = () => {
  const { t } = useTranslation();

  const ageGroups = [
    {
      range: "10\u201319",
      factors: [t('ageGroups.age10_19_f1'), t('ageGroups.age10_19_f2'), t('ageGroups.age10_19_f3'), t('ageGroups.age10_19_f4')],
      color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    },
    {
      range: "20\u201329",
      factors: [t('ageGroups.age20_29_f1'), t('ageGroups.age20_29_f2'), t('ageGroups.age20_29_f3'), t('ageGroups.age20_29_f4')],
      color: "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      range: "30\u201349",
      factors: [t('ageGroups.age30_49_f1'), t('ageGroups.age30_49_f2'), t('ageGroups.age30_49_f3'), t('ageGroups.age30_49_f4')],
      color: "bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400",
    },
    {
      range: "50\u201369",
      factors: [t('ageGroups.age50_69_f1'), t('ageGroups.age50_69_f2'), t('ageGroups.age50_69_f3'), t('ageGroups.age50_69_f4')],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      range: "70+",
      factors: [t('ageGroups.age70plus_f1'), t('ageGroups.age70plus_f2'), t('ageGroups.age70plus_f3'), t('ageGroups.age70plus_f4')],
      color: "bg-teal-100/50 text-teal-600 dark:bg-teal-900/10 dark:text-teal-500",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-soft text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.stroke || p.fill }} className="mt-1">
            {p.name}: {p.value} {t('ageGroups.per100k')}
          </p>
        ))}
      </div>
    );
  };

  return (
    <section className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('ageGroups.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('ageGroups.subtitle')}
          </p>
        </motion.div>

        {/* Stacked Area Chart */}
        <motion.div
          className="p-8 rounded-2xl bg-card border border-border shadow-soft mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold mb-6">{t('ageGroups.chartTitle')}</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendData} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {["10\u201319", "20\u201329", "30\u201349", "50\u201369", "70+"].map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  fill={AREA_COLORS[i]}
                  stroke={AREA_COLORS[i]}
                  fillOpacity={0.7}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <ChartSource sources={["gbd2021", "who2021"]} illustrative note={t('sources.noteAgeBuckets')} />
        </motion.div>

        {/* Age Group Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ageGroups.map((group, i) => (
            <motion.div
              key={group.range}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${group.color}`}>
                {t('ageGroups.ages')} {group.range}
              </span>
              <ul className="space-y-2">
                {group.factors.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgeGroupDeepDive;
