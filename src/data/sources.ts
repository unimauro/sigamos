// Registro central de fuentes citables del dashboard.
// Cada gráfico referencia una o más de estas claves (ver ChartSource) y la
// sección "Fuentes y FAQ" (SourcesFaq) lista todas. Regla del proyecto: ningún
// dato en pantalla sin fuente trazable; lo que no tiene respaldo se marca como
// "datos ilustrativos".

export interface Source {
  label: string;
  url: string;
}

export const SOURCES = {
  who2021: {
    label: "OMS — Suicide worldwide in 2021 (2025)",
    url: "https://www.who.int/publications/i/item/9789240110069",
  },
  whoFactsheet: {
    label: "OMS — Ficha informativa: Suicidio",
    url: "https://www.who.int/news-room/fact-sheets/detail/suicide",
  },
  owid: {
    label: "Our World in Data — Suicide",
    url: "https://ourworldindata.org/suicide",
  },
  gbd2021: {
    label: "GBD 2021 — The Lancet Public Health (2025)",
    url: "https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(25)00006-4/fulltext",
  },
  worldBank: {
    label: "Banco Mundial — Indicadores (PIB, desempleo)",
    url: "https://data.worldbank.org",
  },
  twenge2018: {
    label: "Twenge et al. — Clinical Psychological Science (2018)",
    url: "https://journals.sagepub.com/doi/10.1177/2167702617723376",
  },
  pew2022: {
    label: "Pew Research Center — Teens and Cyberbullying (2022)",
    url: "https://www.pewresearch.org/internet/2022/12/15/teens-and-cyberbullying-2022/",
  },
  harris2024: {
    label: "The Harris Poll — Gen Z & Social Media (2024)",
    url: "https://theharrispoll.com/articles/gen-z-social-media-smart-phones/",
  },
  ocde2009: {
    label: "J Prev Med Public Health (2009) — gasto social y suicidio (OCDE)",
    url: "https://jpmph.org/journal/view.php?doi=10.3961/jpmph.2009.42.2.123",
  },
  unemployment2013: {
    label: "PLOS One (2013) — desempleo y suicidio",
    url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0051333",
  },
  econReview2022: {
    label: "Rev. crisis económica y suicidio — PMC (2022)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9298506/",
  },
} as const;

export type SourceKey = keyof typeof SOURCES;

// Orden para la lista de referencias de la sección de Fuentes.
export const SOURCE_ORDER: SourceKey[] = [
  "who2021",
  "whoFactsheet",
  "owid",
  "gbd2021",
  "worldBank",
  "twenge2018",
  "pew2022",
  "harris2024",
  "ocde2009",
  "unemployment2013",
  "econReview2022",
];
