import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ScatterChart, Scatter, ZAxis, CartesianGrid, LabelList } from "recharts";
import { useTranslation } from "react-i18next";
import ChartSource from "./ChartSource";

const crisisData = [
  { year: "2005", unemployment: 5.1, suicideRate: 11.2 },
  { year: "2006", unemployment: 4.6, suicideRate: 11.0 },
  { year: "2007", unemployment: 4.6, suicideRate: 11.3 },
  { year: "2008", unemployment: 5.8, suicideRate: 11.8 },
  { year: "2009", unemployment: 9.3, suicideRate: 12.4 },
  { year: "2010", unemployment: 9.6, suicideRate: 12.4 },
  { year: "2011", unemployment: 8.9, suicideRate: 12.7 },
  { year: "2015", unemployment: 5.3, suicideRate: 13.3 },
  { year: "2019", unemployment: 3.7, suicideRate: 13.9 },
  { year: "2020", unemployment: 8.1, suicideRate: 13.5 },
  { year: "2021", unemployment: 5.4, suicideRate: 14.1 },
];

const scatterData = [
  { gdp: 2000, rate: 15, country: "India", flag: "🇮🇳", z: 500 },
  { gdp: 5000, rate: 12, country: "Brasil", flag: "🇧🇷", z: 300 },
  { gdp: 8000, rate: 6, country: "Perú", flag: "🇵🇪", z: 150 },
  { gdp: 10000, rate: 8, country: "México", flag: "🇲🇽", z: 200 },
  { gdp: 12000, rate: 22, country: "Lituania", flag: "🇱🇹", z: 100 },
  { gdp: 15000, rate: 18, country: "Rusia", flag: "🇷🇺", z: 400 },
  { gdp: 25000, rate: 14, country: "Japón", flag: "🇯🇵", z: 350 },
  { gdp: 35000, rate: 11, country: "Alemania", flag: "🇩🇪", z: 250 },
  { gdp: 45000, rate: 12, country: "Australia", flag: "🇦🇺", z: 200 },
  { gdp: 65000, rate: 14, country: "EE.UU.", flag: "🇺🇸", z: 450 },
];

// Etiqueta con banderita + país sobre cada punto del scatter.
const FlagLabel = (props: { x?: number; y?: number; index?: number }) => {
  const { x, y, index } = props;
  if (x == null || y == null || index == null) return null;
  const d = scatterData[index];
  return (
    <text x={x} y={y - 12} textAnchor="middle" fontSize={13} fill="hsl(215, 16%, 47%)">
      <tspan fontSize={15}>{d.flag}</tspan>
      <tspan dx={3} fontSize={10}>{d.country}</tspan>
    </text>
  );
};

const EconomicFactors = () => {
  const { t } = useTranslation();

  const incomeData = [
    { group: t('economic.lowIncome'), rate: 11.2 },
    { group: t('economic.lowerMiddle'), rate: 12.8 },
    { group: t('economic.upperMiddle'), rate: 8.5 },
    { group: t('economic.highIncome'), rate: 11.6 },
  ];

  const insights = [
    { text: t('economic.insight1'), icon: "\ud83d\udcc9" },
    { text: t('economic.insight2'), icon: "\ud83d\udcbc" },
    { text: t('economic.insight3'), icon: "\ud83c\udfe6" },
    { text: t('economic.insight4'), icon: "\ud83d\udee1\ufe0f" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-soft text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="mt-1">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-soft text-sm">
        <p className="font-semibold text-foreground">{d.flag} {d.country}</p>
        <p className="text-muted-foreground">{t('economic.gdpCapita')}: ${d.gdp.toLocaleString()}</p>
        <p className="text-primary">{t('economic.rate')}: {d.rate} {t('economic.ratePer100k')}</p>
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('economic.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('economic.subtitle')}
          </p>
        </motion.div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {insights.map((card) => (
            <motion.div
              key={card.text}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-2xl">{card.icon}</span>
              <p className="text-foreground font-medium mt-3 leading-relaxed text-sm">{card.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scatter: GDP vs Rate */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('economic.gdpVsRate')}</h3>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 24, right: 16, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis
                  type="number"
                  dataKey="gdp"
                  name="GDP"
                  domain={[0, 70000]}
                  ticks={[0, 10000, 20000, 30000, 40000, 50000, 60000, 70000]}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(215, 16%, 47%)"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis type="number" dataKey="rate" name="Rate" domain={[0, 26]} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <ZAxis dataKey="z" range={[60, 300]} />
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatterData} fill="hsl(173, 80%, 35%)" fillOpacity={0.75}>
                  <LabelList content={FlagLabel} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <ChartSource sources={["worldBank", "who2021"]} illustrative note={t('sources.noteExample')} />
          </motion.div>

          {/* Line: Unemployment vs Suicide */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('economic.unemploymentVsRate')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={crisisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="unemployment" name={t('economic.unemployment')} stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="suicideRate" name={t('economic.suicideRate')} stroke="hsl(173, 80%, 30%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <ChartSource sources={["worldBank", "unemployment2013"]} illustrative note={t('sources.noteExample')} />
          </motion.div>

          {/* Bar: By Income Level */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('economic.ratesByIncome')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="group" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name={t('economic.ratePer100k')} fill="hsl(217, 91%, 65%)" radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="rate" position="top" style={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <ChartSource sources={["whoFactsheet"]} illustrative note={t('sources.noteExample')} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EconomicFactors;
