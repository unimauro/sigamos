import { useState, useEffect } from "react";

interface Helpline {
  country: string;
  phone: string;
  organization: string;
  whatsapp?: string;
  telegram?: string;
}

const helplinesByCountry: Record<string, Helpline> = {
  // North America
  US: { country: "USA", phone: "988", organization: "988 Suicide & Crisis Lifeline" },
  CA: { country: "Canada", phone: "988", organization: "988 Suicide Crisis Helpline" },

  // LATAM
  PE: { country: "Peru", phone: "113", organization: "Línea 113 - MINSA" },
  MX: { country: "Mexico", phone: "800-290-0024", organization: "SAPTEL" },
  AR: { country: "Argentina", phone: "135", organization: "Centro de Asistencia al Suicida", whatsapp: "+5491152751135" },
  CL: { country: "Chile", phone: "*4141", organization: "Línea Libre" },
  CO: { country: "Colombia", phone: "106", organization: "Línea 106" },
  BR: { country: "Brazil", phone: "188", organization: "CVV" },
  UY: { country: "Uruguay", phone: "0800-0767", organization: "Última Esperanza" },
  EC: { country: "Ecuador", phone: "171", organization: "ECU 911" },
  BO: { country: "Bolivia", phone: "800-10-0639", organization: "Línea Gratuita" },
  PY: { country: "Paraguay", phone: "(021) 220-418", organization: "Prevención del Suicidio" },
  VE: { country: "Venezuela", phone: "0-800-29832-0", organization: "Línea de la Vida (0-800-AYUDA-0)" },
  CR: { country: "Costa Rica", phone: "2272-3774", organization: "Línea de la Vida" },
  PA: { country: "Panama", phone: "169", organization: "Línea de Crisis" },
  DO: { country: "Dominican Republic", phone: "(809) 920-0674", organization: "Línea de Crisis" },
  GT: { country: "Guatemala", phone: "1546", organization: "Línea de Apoyo" },
  HN: { country: "Honduras", phone: "2232-1314", organization: "CPTPS" },
  SV: { country: "El Salvador", phone: "2251-3000", organization: "Línea de Emergencia" },
  NI: { country: "Nicaragua", phone: "2277-1010", organization: "Centro de Ayuda" },
  CU: { country: "Cuba", phone: "838-8388", organization: "Línea Confidencial" },
  SR: { country: "Suriname", phone: "471-000", organization: "Suriname Crisis Line" },
  GY: { country: "Guyana", phone: "223-0001", organization: "Guyana Crisis Line" },

  // High suicide rate countries
  LS: { country: "Lesotho", phone: "800-22-800", organization: "Lesotho Crisis Line" },
  SZ: { country: "Eswatini", phone: "2404-3556", organization: "Eswatini Crisis Line" },
  LT: { country: "Lithuania", phone: "116 123", organization: "Vilties Linija" },
  BY: { country: "Belarus", phone: "8-017-352-44-44", organization: "Телефон Доверия" },
  HU: { country: "Hungary", phone: "116 123", organization: "Lelki Elsősegély" },

  // Europe
  ES: { country: "Spain", phone: "024", organization: "Línea 024" },
  GB: { country: "UK", phone: "116 123", organization: "Samaritans" },
  FR: { country: "France", phone: "3114", organization: "Numéro National" },
  DE: { country: "Germany", phone: "0800-111-0-111", organization: "Telefonseelsorge" },
  IT: { country: "Italy", phone: "800-274-274", organization: "Telefono Amico" },
  PT: { country: "Portugal", phone: "808-200-204", organization: "SOS Voz Amiga" },
  NL: { country: "Netherlands", phone: "113", organization: "113 Zelfmoordpreventie" },
  SE: { country: "Sweden", phone: "90101", organization: "Mind Självmordslinjen" },
  NO: { country: "Norway", phone: "116 123", organization: "Mental Helse" },
  FI: { country: "Finland", phone: "09-2525-0111", organization: "MIELI Crisis Line" },
  DK: { country: "Denmark", phone: "70-201-201", organization: "Livslinien" },
  AT: { country: "Austria", phone: "142", organization: "Telefonseelsorge" },
  CH: { country: "Switzerland", phone: "143", organization: "Die Dargebotene Hand" },
  PL: { country: "Poland", phone: "116 123", organization: "Telefon Zaufania" },
  CZ: { country: "Czech Republic", phone: "116 123", organization: "Linka Bezpečí" },
  RO: { country: "Romania", phone: "0800-801-200", organization: "Telefonul Sufletului" },
  UA: { country: "Ukraine", phone: "7333", organization: "Lifeline Ukraine" },
  GR: { country: "Greece", phone: "1018", organization: "Klimaka NGO" },
  IE: { country: "Ireland", phone: "116 123", organization: "Samaritans Ireland" },
  BE: { country: "Belgium", phone: "1813", organization: "Zelfmoordlijn" },
  RU: { country: "Russia", phone: "8-800-2000-122", organization: "Телефон Доверия" },

  // Asia
  JP: { country: "Japan", phone: "0120-783-556", organization: "Inochi no Denwa" },
  KR: { country: "South Korea", phone: "1393", organization: "정신건강위기상담전화" },
  CN: { country: "China", phone: "010-82951332", organization: "Beijing Crisis Center" },
  IN: { country: "India", phone: "9820466726", organization: "iCall" },
  PH: { country: "Philippines", phone: "(02) 8893-7603", organization: "Natasha Goulbourn Foundation" },
  TH: { country: "Thailand", phone: "1323", organization: "Department of Mental Health" },
  ID: { country: "Indonesia", phone: "119 ext 8", organization: "Into The Light" },
  MY: { country: "Malaysia", phone: "03-7956-8145", organization: "Befrienders KL" },
  SG: { country: "Singapore", phone: "1800-221-4444", organization: "Samaritans of Singapore (SOS)" },
  TW: { country: "Taiwan", phone: "1925", organization: "Taiwan Suicide Prevention Center" },
  VN: { country: "Vietnam", phone: "1800-599-920", organization: "Vietnam Crisis Line" },

  // Oceania
  AU: { country: "Australia", phone: "13 11 14", organization: "Lifeline" },
  NZ: { country: "New Zealand", phone: "1737", organization: "Need to Talk?" },

  // Africa
  ZA: { country: "South Africa", phone: "0800-567-567", organization: "SADAG" },
  NG: { country: "Nigeria", phone: "0800-123-0800", organization: "MANI Nigeria" },
  KE: { country: "Kenya", phone: "0800-720-990", organization: "Befrienders Kenya" },
};

const defaultHelpline: Helpline = {
  country: "International",
  phone: "988",
  organization: "Crisis Lifeline",
};

export function useCountryHelpline() {
  const [helpline, setHelpline] = useState<Helpline>(defaultHelpline);
  const [countryCode, setCountryCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const cachedCountry = sessionStorage.getItem("user_country");
        if (cachedCountry && helplinesByCountry[cachedCountry]) {
          setHelpline(helplinesByCountry[cachedCountry]);
          setCountryCode(cachedCountry);
          setLoading(false);
          return;
        }

        const response = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
        const data = await response.json();
        const code = data.country_code;

        if (code && helplinesByCountry[code]) {
          setHelpline(helplinesByCountry[code]);
          setCountryCode(code);
          sessionStorage.setItem("user_country", code);
        }
      } catch {
        // fallback to default
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { helpline, countryCode, loading };
}
