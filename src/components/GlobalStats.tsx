import { motion } from "framer-motion";
import { Globe, Users, TrendingDown, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import AnimatedCounter from "./AnimatedCounter";
import { SOURCES, type SourceKey } from "@/data/sources";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] } },
};

const GlobalStats = () => {
  const { t } = useTranslation();

  const stats: {
    icon: typeof Globe;
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    description?: string;
    sourceKey: SourceKey;
  }[] = [
    {
      icon: Globe,
      label: t('globalStats.annualDeaths'),
      value: 727000,
      suffix: "+",
      description: t('globalStats.annualDeathsDesc'),
      sourceKey: "who2021",
    },
    {
      icon: Activity,
      label: t('globalStats.ratePer100k'),
      value: 9,
      suffix: "",
      decimals: 1,
      description: t('globalStats.ratePer100kDesc'),
      sourceKey: "who2021",
    },
    {
      icon: Users,
      label: t('globalStats.maleToFemale'),
      value: 2.3,
      suffix: "x",
      prefix: "~",
      decimals: 1,
      description: t('globalStats.maleToFemaleDesc'),
      sourceKey: "who2021",
    },
    {
      icon: TrendingDown,
      label: t('globalStats.mostAffectedAge'),
      value: 70,
      suffix: "+",
      description: t('globalStats.mostAffectedAgeDesc'),
      sourceKey: "gbd2021",
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t('globalStats.title')}
          </h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('globalStats.subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="p-8 rounded-2xl bg-card border border-border shadow-soft hover:-translate-y-1 transition-transform duration-300"
            >
              <stat.icon className="w-6 h-6 text-primary mb-4" />
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-4xl font-bold text-primary mt-2">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix || ""}
                  decimals={stat.decimals || 0}
                />
              </h3>
              {stat.description && (
                <p className="text-muted-foreground text-sm mt-3">{stat.description}</p>
              )}
              <p className="text-muted-foreground/60 text-xs mt-4">
                {t('globalStats.source')}:{" "}
                <a
                  href={SOURCES[stat.sourceKey].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-primary"
                >
                  {SOURCES[stat.sourceKey].label}
                </a>
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalStats;
