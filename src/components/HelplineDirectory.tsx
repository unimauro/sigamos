import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface HelplineEntry {
  country: string;
  flag: string;
  number: string;
  org: string;
  hours: string;
  region: string;
  whatsapp?: string;
  telegram?: string;
}

const helplines: HelplineEntry[] = [
  // North America
  { country: "USA", flag: "\ud83c\uddfa\ud83c\uddf8", number: "988", org: "988 Suicide & Crisis Lifeline", hours: "24/7", region: "North America" },
  { country: "Canada", flag: "\ud83c\udde8\ud83c\udde6", number: "988", org: "988 Suicide Crisis Helpline", hours: "24/7", region: "North America" },

  // LATAM
  { country: "Peru", flag: "\ud83c\uddf5\ud83c\uddea", number: "113", org: "L\u00ednea 113 (MINSA)", hours: "24/7", region: "LATAM" },
  { country: "Mexico", flag: "\ud83c\uddf2\ud83c\uddfd", number: "800-290-0024", org: "SAPTEL", hours: "24/7", region: "LATAM" },
  { country: "Mexico", flag: "\ud83c\uddf2\ud83c\uddfd", number: "800-911-2000", org: "L\u00ednea de la Vida", hours: "24/7", region: "LATAM" },
  { country: "Argentina", flag: "\ud83c\udde6\ud83c\uddf7", number: "135", org: "Centro de Asistencia al Suicida", hours: "24/7", region: "LATAM", whatsapp: "+5491152751135" },
  { country: "Chile", flag: "\ud83c\udde8\ud83c\uddf1", number: "*4141", org: "L\u00ednea Libre", hours: "24/7", region: "LATAM" },
  { country: "Chile", flag: "\ud83c\udde8\ud83c\uddf1", number: "600-360-7777", org: "L\u00ednea de Prevenci\u00f3n del Suicidio", hours: "24/7", region: "LATAM" },
  { country: "Colombia", flag: "\ud83c\udde8\ud83c\uddf4", number: "106", org: "L\u00ednea 106", hours: "24/7", region: "LATAM" },
  { country: "Brasil", flag: "\ud83c\udde7\ud83c\uddf7", number: "188", org: "CVV - Centro de Valoriza\u00e7\u00e3o da Vida", hours: "24/7", region: "LATAM" },
  { country: "Uruguay", flag: "\ud83c\uddfa\ud83c\uddfe", number: "0800-0767", org: "\u00daltima Esperanza / *0767", hours: "24/7", region: "LATAM" },
  { country: "Ecuador", flag: "\ud83c\uddea\ud83c\udde8", number: "171", org: "ECU 911", hours: "24/7", region: "LATAM" },
  { country: "Bolivia", flag: "\ud83c\udde7\ud83c\uddf4", number: "800-10-0639", org: "L\u00ednea Gratuita", hours: "24/7", region: "LATAM" },
  { country: "Paraguay", flag: "\ud83c\uddf5\ud83c\uddfe", number: "(021) 220-418", org: "Prevenci\u00f3n del Suicidio", hours: "24/7", region: "LATAM" },
  { country: "Venezuela", flag: "\ud83c\uddfb\ud83c\uddea", number: "0-800-29832-0", org: "L\u00ednea de la Vida (0-800-AYUDA-0)", hours: "24/7", region: "LATAM" },
  { country: "Costa Rica", flag: "\ud83c\udde8\ud83c\uddf7", number: "2272-3774", org: "L\u00ednea de la Vida", hours: "24/7", region: "LATAM" },
  { country: "Panama", flag: "\ud83c\uddf5\ud83c\udde6", number: "169", org: "L\u00ednea de Crisis", hours: "24/7", region: "LATAM" },
  { country: "Dominican Republic", flag: "\ud83c\udde9\ud83c\uddf4", number: "(809) 920-0674", org: "L\u00ednea de Crisis", hours: "24/7", region: "LATAM" },
  { country: "Guatemala", flag: "\ud83c\uddec\ud83c\uddf9", number: "1546", org: "L\u00ednea de Apoyo", hours: "24/7", region: "LATAM" },
  { country: "Honduras", flag: "\ud83c\udded\ud83c\uddf3", number: "2232-1314", org: "CPTPS", hours: "24/7", region: "LATAM" },
  { country: "El Salvador", flag: "\ud83c\uddf8\ud83c\uddfb", number: "2251-3000", org: "L\u00ednea de Emergencia", hours: "24/7", region: "LATAM" },
  { country: "Nicaragua", flag: "\ud83c\uddf3\ud83c\uddee", number: "2277-1010", org: "Centro de Ayuda", hours: "8am-8pm", region: "LATAM" },
  { country: "Cuba", flag: "\ud83c\udde8\ud83c\uddfa", number: "838-8388", org: "L\u00ednea Confidencial", hours: "24/7", region: "LATAM" },
  { country: "Suriname", flag: "\ud83c\uddf8\ud83c\uddf7", number: "471-000", org: "Suriname Crisis Line", hours: "24/7", region: "LATAM" },
  { country: "Guyana", flag: "\ud83c\uddec\ud83c\uddfe", number: "223-0001", org: "Guyana Crisis Line", hours: "24/7", region: "LATAM" },

  // High suicide rate countries
  { country: "Lesotho", flag: "\ud83c\uddf1\ud83c\uddf8", number: "800-22-800", org: "Lesotho Crisis Line", hours: "24/7", region: "Africa" },
  { country: "Eswatini", flag: "\ud83c\uddf8\ud83c\uddff", number: "2404-3556", org: "Eswatini Crisis Line", hours: "24/7", region: "Africa" },
  { country: "Lithuania", flag: "\ud83c\uddf1\ud83c\uddf9", number: "116 123", org: "Vilties Linija", hours: "24/7", region: "Europe" },
  { country: "Belarus", flag: "\ud83c\udde7\ud83c\uddfe", number: "8-017-352-44-44", org: "\u0422\u0435\u043b\u0435\u0444\u043e\u043d \u0414\u043e\u0432\u0435\u0440\u0438\u044f", hours: "24/7", region: "Europe" },
  { country: "Hungary", flag: "\ud83c\udded\ud83c\uddfa", number: "116 123", org: "Lelki Els\u0151seg\u00e9ly", hours: "24/7", region: "Europe" },

  // Europe
  { country: "Spain", flag: "\ud83c\uddea\ud83c\uddf8", number: "024", org: "L\u00ednea de Atenci\u00f3n a la Conducta Suicida", hours: "24/7", region: "Europe" },
  { country: "UK", flag: "\ud83c\uddec\ud83c\udde7", number: "116 123", org: "Samaritans", hours: "24/7", region: "Europe" },
  { country: "France", flag: "\ud83c\uddeb\ud83c\uddf7", number: "3114", org: "Num\u00e9ro National de Pr\u00e9vention du Suicide", hours: "24/7", region: "Europe" },
  { country: "Germany", flag: "\ud83c\udde9\ud83c\uddea", number: "0800-111-0-111", org: "Telefonseelsorge", hours: "24/7", region: "Europe" },
  { country: "Italy", flag: "\ud83c\uddee\ud83c\uddf9", number: "800-274-274", org: "Telefono Amico Italia", hours: "24/7", region: "Europe" },
  { country: "Portugal", flag: "\ud83c\uddf5\ud83c\uddf9", number: "808-200-204", org: "SOS Voz Amiga", hours: "16:00-24:00", region: "Europe" },
  { country: "Netherlands", flag: "\ud83c\uddf3\ud83c\uddf1", number: "113", org: "113 Zelfmoordpreventie", hours: "24/7", region: "Europe" },
  { country: "Sweden", flag: "\ud83c\uddf8\ud83c\uddea", number: "90101", org: "Mind Sj\u00e4lvmordslinjen", hours: "24/7", region: "Europe" },
  { country: "Norway", flag: "\ud83c\uddf3\ud83c\uddf4", number: "116 123", org: "Mental Helse", hours: "24/7", region: "Europe" },
  { country: "Finland", flag: "\ud83c\uddeb\ud83c\uddee", number: "09-2525-0111", org: "MIELI Crisis Line", hours: "24/7", region: "Europe" },
  { country: "Denmark", flag: "\ud83c\udde9\ud83c\uddf0", number: "70-201-201", org: "Livslinien", hours: "24/7", region: "Europe" },
  { country: "Austria", flag: "\ud83c\udde6\ud83c\uddf9", number: "142", org: "Telefonseelsorge", hours: "24/7", region: "Europe" },
  { country: "Switzerland", flag: "\ud83c\udde8\ud83c\udded", number: "143", org: "Die Dargebotene Hand", hours: "24/7", region: "Europe" },
  { country: "Poland", flag: "\ud83c\uddf5\ud83c\uddf1", number: "116 123", org: "Telefon Zaufania", hours: "24/7", region: "Europe" },
  { country: "Czech Republic", flag: "\ud83c\udde8\ud83c\uddff", number: "116 123", org: "Linka Bezpe\u010d\u00ed", hours: "24/7", region: "Europe" },
  { country: "Romania", flag: "\ud83c\uddf7\ud83c\uddf4", number: "0800-801-200", org: "Telefonul Sufletului", hours: "24/7", region: "Europe" },
  { country: "Ukraine", flag: "\ud83c\uddfa\ud83c\udde6", number: "7333", org: "Lifeline Ukraine", hours: "24/7", region: "Europe" },
  { country: "Greece", flag: "\ud83c\uddec\ud83c\uddf7", number: "1018", org: "Klimaka NGO", hours: "24/7", region: "Europe" },
  { country: "Ireland", flag: "\ud83c\uddee\ud83c\uddea", number: "116 123", org: "Samaritans Ireland", hours: "24/7", region: "Europe" },
  { country: "Belgium (NL)", flag: "\ud83c\udde7\ud83c\uddea", number: "1813", org: "Zelfmoordlijn", hours: "24/7", region: "Europe" },
  { country: "Belgium (FR)", flag: "\ud83c\udde7\ud83c\uddea", number: "0800-32-123", org: "Centre de Pr\u00e9vention du Suicide", hours: "24/7", region: "Europe" },
  { country: "Russia", flag: "\ud83c\uddf7\ud83c\uddfa", number: "8-800-2000-122", org: "\u0422\u0435\u043b\u0435\u0444\u043e\u043d \u0414\u043e\u0432\u0435\u0440\u0438\u044f", hours: "24/7", region: "Europe" },

  // Asia
  { country: "Japan", flag: "\ud83c\uddef\ud83c\uddf5", number: "0120-783-556", org: "Inochi no Denwa", hours: "24/7", region: "Asia" },
  { country: "Japan", flag: "\ud83c\uddef\ud83c\uddf5", number: "0570-064-556", org: "Yorisoi Hotline", hours: "24/7", region: "Asia" },
  { country: "South Korea", flag: "\ud83c\uddf0\ud83c\uddf7", number: "1393", org: "\uc815\uc2e0\uac74\uac15\uc704\uae30\uc0c1\ub2f4\uc804\ud654", hours: "24/7", region: "Asia" },
  { country: "South Korea", flag: "\ud83c\uddf0\ud83c\uddf7", number: "109", org: "\uc790\uc0b4\uc608\ubc29\uc0c1\ub2f4\uc804\ud654", hours: "24/7", region: "Asia" },
  { country: "China", flag: "\ud83c\udde8\ud83c\uddf3", number: "010-82951332", org: "Beijing Crisis Center", hours: "24/7", region: "Asia" },
  { country: "China", flag: "\ud83c\udde8\ud83c\uddf3", number: "400-161-9995", org: "Hope 24 Line", hours: "24/7", region: "Asia" },
  { country: "India", flag: "\ud83c\uddee\ud83c\uddf3", number: "9820466726", org: "iCall (TISS)", hours: "Mon-Sat 8am-10pm", region: "Asia" },
  { country: "India", flag: "\ud83c\uddee\ud83c\uddf3", number: "9152987821", org: "AASRA", hours: "24/7", region: "Asia" },
  { country: "Philippines", flag: "\ud83c\uddf5\ud83c\udded", number: "(02) 8893-7603", org: "Natasha Goulbourn Foundation", hours: "24/7", region: "Asia" },
  { country: "Thailand", flag: "\ud83c\uddf9\ud83c\udded", number: "1323", org: "Department of Mental Health", hours: "24/7", region: "Asia" },
  { country: "Indonesia", flag: "\ud83c\uddee\ud83c\udde9", number: "119 ext 8", org: "Into The Light", hours: "24/7", region: "Asia" },
  { country: "Malaysia", flag: "\ud83c\uddf2\ud83c\uddfe", number: "03-7956-8145", org: "Befrienders KL", hours: "24/7", region: "Asia" },
  { country: "Singapore", flag: "\ud83c\uddf8\ud83c\uddec", number: "1800-221-4444", org: "Samaritans of Singapore (SOS)", hours: "24/7", region: "Asia" },
  { country: "Taiwan", flag: "\ud83c\uddf9\ud83c\uddfc", number: "1925", org: "Taiwan Suicide Prevention Center", hours: "24/7", region: "Asia" },
  { country: "Vietnam", flag: "\ud83c\uddfb\ud83c\uddf3", number: "1800-599-920", org: "Vietnam Crisis Line", hours: "24/7", region: "Asia" },

  // Oceania
  { country: "Australia", flag: "\ud83c\udde6\ud83c\uddfa", number: "13 11 14", org: "Lifeline Australia", hours: "24/7", region: "Oceania" },
  { country: "New Zealand", flag: "\ud83c\uddf3\ud83c\uddff", number: "1737", org: "Need to Talk?", hours: "24/7", region: "Oceania" },

  // Africa
  { country: "South Africa", flag: "\ud83c\uddff\ud83c\udde6", number: "0800-567-567", org: "SADAG Suicide Crisis Line", hours: "24/7", region: "Africa" },
  { country: "Nigeria", flag: "\ud83c\uddf3\ud83c\uddec", number: "0800-123-0800", org: "MANI Nigeria", hours: "24/7", region: "Africa" },
  { country: "Kenya", flag: "\ud83c\uddf0\ud83c\uddea", number: "0800-720-990", org: "Befrienders Kenya", hours: "24/7", region: "Africa" },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const HelplineDirectory = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const regions = [
    { key: "All", label: t('helplines.all') },
    { key: "LATAM", label: t('helplines.regionLATAM') },
    { key: "North America", label: t('helplines.regionNorthAmerica') },
    { key: "Europe", label: t('helplines.regionEurope') },
    { key: "Asia", label: t('helplines.regionAsia') },
    { key: "Oceania", label: t('helplines.regionOceania') },
    { key: "Africa", label: t('helplines.regionAfrica', { defaultValue: 'Africa' }) },
  ];

  const filtered = helplines.filter((h) => {
    const matchSearch = h.country.toLowerCase().includes(search.toLowerCase()) ||
      h.org.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "All" || h.region === region;
    return matchSearch && matchRegion;
  });

  return (
    <section id="helplines" className="px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t('helplines.title')}</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
            {t('helplines.subtitle')}
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('helplines.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background transition-shadow"
            />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {regions.map((r) => (
              <button
                key={r.key}
                onClick={() => setRegion(r.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  region === r.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((h, i) => (
            <motion.div
              key={`${h.country}-${h.number}`}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft flex flex-col justify-between"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{h.flag}</span>
                  <div>
                    <p className="font-semibold text-foreground">{h.country}</p>
                    <p className="text-xs text-muted-foreground">{h.org}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{t('helplines.available')}: {h.hours}</p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button variant="emergency" size="sm" asChild className="w-full">
                  <a href={`tel:${h.number.replace(/\s/g, '')}`}>
                    <Phone className="w-4 h-4" />
                    {t('helplines.call')} {h.number}
                  </a>
                </Button>
                {h.whatsapp && (
                  <Button variant="outline" size="sm" asChild className="w-full text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950">
                    <a href={`https://wa.me/${h.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                  </Button>
                )}
                {h.telegram && (
                  <Button variant="outline" size="sm" asChild className="w-full text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950">
                    <a href={h.telegram} target="_blank" rel="noopener noreferrer">
                      <TelegramIcon />
                      Telegram
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelplineDirectory;
