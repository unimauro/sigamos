import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import ChartSource from "./ChartSource";

const globalTrend = [
  { year: "2000", rate: 14.5 }, { year: "2002", rate: 14.0 }, { year: "2004", rate: 13.5 },
  { year: "2006", rate: 13.0 }, { year: "2008", rate: 12.8 }, { year: "2010", rate: 12.0 },
  { year: "2012", rate: 11.5 }, { year: "2014", rate: 11.0 }, { year: "2016", rate: 10.5 },
  { year: "2018", rate: 10.2 }, { year: "2020", rate: 9.8 },
];

const topCountries = [
  { country: "🇱🇸 Lesotho", rate: 72.4 },
  { country: "🇬🇾 Guyana", rate: 40.3 },
  { country: "🇸🇿 Eswatini", rate: 29.4 },
  { country: "🇰🇷 South Korea", rate: 28.6 },
  { country: "🇰🇮 Kiribati", rate: 28.3 },
  { country: "🇫🇲 Micronesia", rate: 25.5 },
  { country: "🇱🇹 Lithuania", rate: 24.4 },
  { country: "🇸🇷 Suriname", rate: 23.2 },
  { country: "🇷🇺 Russia", rate: 21.6 },
  { country: "🇿🇦 South Africa", rate: 20.2 },
  { country: "🇧🇾 Belarus", rate: 19.1 },
  { country: "🇺🇾 Uruguay", rate: 18.4 },
  { country: "🇧🇪 Belgium", rate: 17.6 },
  { country: "🇯🇵 Japan", rate: 16.7 },
  { country: "🇭🇺 Hungary", rate: 16.2 },
];

const ageDistribution = [
  { name: "15\u201329", value: 17, color: "hsl(173, 80%, 75%)" },
  { name: "30\u201349", value: 32, color: "hsl(173, 80%, 50%)" },
  { name: "50\u201369", value: 28, color: "hsl(217, 91%, 65%)" },
  { name: "70+", value: 23, color: "hsl(217, 91%, 45%)" },
];

const ChartsSection = () => {
  const { t } = useTranslation();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-soft text-sm">
        <p className="font-semibold text-foreground">{label || payload[0]?.name}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color || p.fill }} className="mt-1">
            {p.name}: {p.value}{typeof p.value === 'number' && p.value < 100 ? (label ? ` ${t('charts.ratePer100k')}` : '%') : ''}
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('charts.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('charts.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Global Trend */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('charts.globalTrend')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={globalTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" domain={[8, 16]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="rate" name={t('charts.ratePer100k')} stroke="hsl(173, 80%, 30%)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <ChartSource sources={["owid", "who2021"]} note={t('sources.noteAgeStd')} />
          </motion.div>

          {/* Age Distribution */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('charts.distributionByAge')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                  stroke="none"
                >
                  {ageDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <ChartSource sources={["gbd2021"]} illustrative note={t('sources.noteExample')} />
          </motion.div>

          {/* Top Countries */}
          <motion.div
            className="p-8 rounded-2xl bg-card border border-border shadow-soft lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6">{t('charts.top15Countries')}</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topCountries} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <YAxis dataKey="country" type="category" width={130} tick={{ fontSize: 11 }} stroke="hsl(215, 16%, 47%)" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name={t('charts.ratePer100k')} fill="hsl(173, 80%, 35%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartSource sources={["who2021", "owid"]} note={t('sources.noteCrude2019')} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;
