// Fuente ÚNICA de líneas de ayuda. La consumen tanto el directorio
// (HelplineDirectory) como la detección de país (use-country-helpline), para
// evitar que diverjan (fue lo que dejó un WhatsApp roto en Perú).
//
// Cada país puede tener varias líneas; para las CTA de crisis (barra de
// emergencia, chat, hero) se usa la PRIMERA entrada con `code` de ese país.

// Fecha de última revisión del directorio (verificación de números).
export const HELPLINES_LAST_REVIEWED = "2026-09";

export interface Helpline {
  country: string;
  /** ISO 3166-1 alpha-2. Se usa para la autodetección por IP. */
  code?: string;
  flag: string;
  number: string;
  org: string;
  hours: string;
  region: string;
  whatsapp?: string;
  telegram?: string;
  /** URL alternativa cuando no hay un número marcable (p. ej. el fallback). */
  url?: string;
}

export const HELPLINES: Helpline[] = [
  // North America
  { country: "USA", code: "US", flag: "🇺🇸", number: "988", org: "988 Suicide & Crisis Lifeline", hours: "24/7", region: "North America" },
  { country: "Canada", code: "CA", flag: "🇨🇦", number: "988", org: "988 Suicide Crisis Helpline", hours: "24/7", region: "North America" },

  // LATAM
  { country: "Peru", code: "PE", flag: "🇵🇪", number: "113", org: "Línea 113 (MINSA)", hours: "24/7", region: "LATAM" },
  { country: "Mexico", code: "MX", flag: "🇲🇽", number: "800-290-0024", org: "SAPTEL", hours: "24/7", region: "LATAM" },
  { country: "Mexico", flag: "🇲🇽", number: "800-911-2000", org: "Línea de la Vida", hours: "24/7", region: "LATAM" },
  { country: "Argentina", code: "AR", flag: "🇦🇷", number: "135", org: "Centro de Asistencia al Suicida", hours: "24/7", region: "LATAM", whatsapp: "+5491152751135" },
  { country: "Chile", code: "CL", flag: "🇨🇱", number: "*4141", org: "Línea Libre", hours: "24/7", region: "LATAM" },
  { country: "Chile", flag: "🇨🇱", number: "600-360-7777", org: "Línea de Prevención del Suicidio", hours: "24/7", region: "LATAM" },
  { country: "Colombia", code: "CO", flag: "🇨🇴", number: "106", org: "Línea 106", hours: "24/7", region: "LATAM" },
  { country: "Brasil", code: "BR", flag: "🇧🇷", number: "188", org: "CVV - Centro de Valorização da Vida", hours: "24/7", region: "LATAM" },
  { country: "Uruguay", code: "UY", flag: "🇺🇾", number: "0800-0767", org: "Última Esperanza / *0767", hours: "24/7", region: "LATAM" },
  { country: "Ecuador", code: "EC", flag: "🇪🇨", number: "171", org: "ECU 911", hours: "24/7", region: "LATAM" },
  { country: "Bolivia", code: "BO", flag: "🇧🇴", number: "800-10-0639", org: "Línea Gratuita", hours: "24/7", region: "LATAM" },
  { country: "Paraguay", code: "PY", flag: "🇵🇾", number: "(021) 220-418", org: "Prevención del Suicidio", hours: "24/7", region: "LATAM" },
  { country: "Venezuela", code: "VE", flag: "🇻🇪", number: "0-800-29832-0", org: "Línea de la Vida (0-800-AYUDA-0)", hours: "24/7", region: "LATAM" },
  { country: "Costa Rica", code: "CR", flag: "🇨🇷", number: "2272-3774", org: "Línea de la Vida", hours: "24/7", region: "LATAM" },
  { country: "Panama", code: "PA", flag: "🇵🇦", number: "169", org: "Línea de Crisis", hours: "24/7", region: "LATAM" },
  { country: "Dominican Republic", code: "DO", flag: "🇩🇴", number: "(809) 920-0674", org: "Línea de Crisis", hours: "24/7", region: "LATAM" },
  { country: "Guatemala", code: "GT", flag: "🇬🇹", number: "1546", org: "Línea de Apoyo", hours: "24/7", region: "LATAM" },
  { country: "Honduras", code: "HN", flag: "🇭🇳", number: "2232-1314", org: "CPTPS", hours: "24/7", region: "LATAM" },
  { country: "El Salvador", code: "SV", flag: "🇸🇻", number: "2251-3000", org: "Línea de Emergencia", hours: "24/7", region: "LATAM" },
  { country: "Nicaragua", code: "NI", flag: "🇳🇮", number: "2277-1010", org: "Centro de Ayuda", hours: "8am-8pm", region: "LATAM" },
  { country: "Cuba", code: "CU", flag: "🇨🇺", number: "838-8388", org: "Línea Confidencial", hours: "24/7", region: "LATAM" },
  { country: "Suriname", code: "SR", flag: "🇸🇷", number: "471-000", org: "Suriname Crisis Line", hours: "24/7", region: "LATAM" },
  { country: "Guyana", code: "GY", flag: "🇬🇾", number: "223-0001", org: "Guyana Crisis Line", hours: "24/7", region: "LATAM" },

  // Europe (incl. países de alta tasa)
  { country: "Lesotho", code: "LS", flag: "🇱🇸", number: "800-22-800", org: "Lesotho Crisis Line", hours: "24/7", region: "Africa" },
  { country: "Eswatini", code: "SZ", flag: "🇸🇿", number: "2404-3556", org: "Eswatini Crisis Line", hours: "24/7", region: "Africa" },
  { country: "Lithuania", code: "LT", flag: "🇱🇹", number: "116 123", org: "Vilties Linija", hours: "24/7", region: "Europe" },
  { country: "Belarus", code: "BY", flag: "🇧🇾", number: "8-017-352-44-44", org: "Телефон Доверия", hours: "24/7", region: "Europe" },
  { country: "Hungary", code: "HU", flag: "🇭🇺", number: "116 123", org: "Lelki Elsősegély", hours: "24/7", region: "Europe" },
  { country: "Spain", code: "ES", flag: "🇪🇸", number: "024", org: "Línea de Atención a la Conducta Suicida", hours: "24/7", region: "Europe" },
  { country: "UK", code: "GB", flag: "🇬🇧", number: "116 123", org: "Samaritans", hours: "24/7", region: "Europe" },
  { country: "France", code: "FR", flag: "🇫🇷", number: "3114", org: "Numéro National de Prévention du Suicide", hours: "24/7", region: "Europe" },
  { country: "Germany", code: "DE", flag: "🇩🇪", number: "0800-111-0-111", org: "Telefonseelsorge", hours: "24/7", region: "Europe" },
  { country: "Italy", code: "IT", flag: "🇮🇹", number: "800-274-274", org: "Telefono Amico Italia", hours: "24/7", region: "Europe" },
  { country: "Portugal", code: "PT", flag: "🇵🇹", number: "808-200-204", org: "SOS Voz Amiga", hours: "16:00-24:00", region: "Europe" },
  { country: "Netherlands", code: "NL", flag: "🇳🇱", number: "113", org: "113 Zelfmoordpreventie", hours: "24/7", region: "Europe" },
  { country: "Sweden", code: "SE", flag: "🇸🇪", number: "90101", org: "Mind Självmordslinjen", hours: "24/7", region: "Europe" },
  { country: "Norway", code: "NO", flag: "🇳🇴", number: "116 123", org: "Mental Helse", hours: "24/7", region: "Europe" },
  { country: "Finland", code: "FI", flag: "🇫🇮", number: "09-2525-0111", org: "MIELI Crisis Line", hours: "24/7", region: "Europe" },
  { country: "Denmark", code: "DK", flag: "🇩🇰", number: "70-201-201", org: "Livslinien", hours: "24/7", region: "Europe" },
  { country: "Austria", code: "AT", flag: "🇦🇹", number: "142", org: "Telefonseelsorge", hours: "24/7", region: "Europe" },
  { country: "Switzerland", code: "CH", flag: "🇨🇭", number: "143", org: "Die Dargebotene Hand", hours: "24/7", region: "Europe" },
  { country: "Poland", code: "PL", flag: "🇵🇱", number: "116 123", org: "Telefon Zaufania", hours: "24/7", region: "Europe" },
  { country: "Czech Republic", code: "CZ", flag: "🇨🇿", number: "116 123", org: "Linka Bezpečí", hours: "24/7", region: "Europe" },
  { country: "Romania", code: "RO", flag: "🇷🇴", number: "0800-801-200", org: "Telefonul Sufletului", hours: "24/7", region: "Europe" },
  { country: "Ukraine", code: "UA", flag: "🇺🇦", number: "7333", org: "Lifeline Ukraine", hours: "24/7", region: "Europe" },
  { country: "Greece", code: "GR", flag: "🇬🇷", number: "1018", org: "Klimaka NGO", hours: "24/7", region: "Europe" },
  { country: "Ireland", code: "IE", flag: "🇮🇪", number: "116 123", org: "Samaritans Ireland", hours: "24/7", region: "Europe" },
  { country: "Belgium (NL)", code: "BE", flag: "🇧🇪", number: "1813", org: "Zelfmoordlijn", hours: "24/7", region: "Europe" },
  { country: "Belgium (FR)", flag: "🇧🇪", number: "0800-32-123", org: "Centre de Prévention du Suicide", hours: "24/7", region: "Europe" },
  { country: "Russia", code: "RU", flag: "🇷🇺", number: "8-800-2000-122", org: "Телефон Доверия", hours: "24/7", region: "Europe" },

  // Asia
  { country: "Japan", code: "JP", flag: "🇯🇵", number: "0120-783-556", org: "Inochi no Denwa", hours: "24/7", region: "Asia" },
  { country: "Japan", flag: "🇯🇵", number: "0570-064-556", org: "Yorisoi Hotline", hours: "24/7", region: "Asia" },
  { country: "South Korea", code: "KR", flag: "🇰🇷", number: "1393", org: "정신건강위기상담전화", hours: "24/7", region: "Asia" },
  { country: "South Korea", flag: "🇰🇷", number: "109", org: "자살예방상담전화", hours: "24/7", region: "Asia" },
  { country: "China", code: "CN", flag: "🇨🇳", number: "010-82951332", org: "Beijing Crisis Center", hours: "24/7", region: "Asia" },
  { country: "China", flag: "🇨🇳", number: "400-161-9995", org: "Hope 24 Line", hours: "24/7", region: "Asia" },
  { country: "India", code: "IN", flag: "🇮🇳", number: "9820466726", org: "iCall (TISS)", hours: "Mon-Sat 8am-10pm", region: "Asia" },
  { country: "India", flag: "🇮🇳", number: "9152987821", org: "AASRA", hours: "24/7", region: "Asia" },
  { country: "Philippines", code: "PH", flag: "🇵🇭", number: "(02) 8893-7603", org: "Natasha Goulbourn Foundation", hours: "24/7", region: "Asia" },
  { country: "Thailand", code: "TH", flag: "🇹🇭", number: "1323", org: "Department of Mental Health", hours: "24/7", region: "Asia" },
  { country: "Indonesia", code: "ID", flag: "🇮🇩", number: "119 ext 8", org: "Into The Light", hours: "24/7", region: "Asia" },
  { country: "Malaysia", code: "MY", flag: "🇲🇾", number: "03-7956-8145", org: "Befrienders KL", hours: "24/7", region: "Asia" },
  { country: "Singapore", code: "SG", flag: "🇸🇬", number: "1800-221-4444", org: "Samaritans of Singapore (SOS)", hours: "24/7", region: "Asia" },
  { country: "Taiwan", code: "TW", flag: "🇹🇼", number: "1925", org: "Taiwan Suicide Prevention Center", hours: "24/7", region: "Asia" },
  { country: "Vietnam", code: "VN", flag: "🇻🇳", number: "1800-599-920", org: "Vietnam Crisis Line", hours: "24/7", region: "Asia" },

  // Oceania
  { country: "Australia", code: "AU", flag: "🇦🇺", number: "13 11 14", org: "Lifeline Australia", hours: "24/7", region: "Oceania" },
  { country: "New Zealand", code: "NZ", flag: "🇳🇿", number: "1737", org: "Need to Talk?", hours: "24/7", region: "Oceania" },

  // Africa
  { country: "South Africa", code: "ZA", flag: "🇿🇦", number: "0800-567-567", org: "SADAG Suicide Crisis Line", hours: "24/7", region: "Africa" },
  { country: "Nigeria", code: "NG", flag: "🇳🇬", number: "0800-123-0800", org: "MANI Nigeria", hours: "24/7", region: "Africa" },
  { country: "Kenya", code: "KE", flag: "🇰🇪", number: "0800-720-990", org: "Befrienders Kenya", hours: "24/7", region: "Africa" },
];

// Fallback internacional cuando no se detecta el país (antes era "988", que solo
// sirve en EE. UU./Canadá). Sin número marcable: dirige a un directorio global.
export const DEFAULT_HELPLINE: Helpline = {
  country: "Internacional",
  flag: "🌍",
  number: "",
  org: "Find A Helpline",
  hours: "24/7",
  region: "International",
  url: "https://findahelpline.com/",
};

// Primera línea (con código) por país, para la autodetección por IP.
export const HELPLINE_BY_CODE: Record<string, Helpline> = HELPLINES.reduce(
  (acc, h) => {
    if (h.code && !acc[h.code]) acc[h.code] = h;
    return acc;
  },
  {} as Record<string, Helpline>,
);
