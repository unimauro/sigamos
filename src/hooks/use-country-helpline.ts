import { useState, useEffect } from "react";
import { HELPLINE_BY_CODE, DEFAULT_HELPLINE, type Helpline } from "@/data/helplines";

// Forma que consumen los componentes de CTA (barra de emergencia, chat, hero).
// Mantiene alias `phone`/`organization` sobre la fuente única (`number`/`org`).
export interface CountryHelpline extends Helpline {
  phone: string;
  organization: string;
}

const toCountryHelpline = (h: Helpline): CountryHelpline => ({
  ...h,
  phone: h.number,
  organization: h.org,
});

const DEFAULT = toCountryHelpline(DEFAULT_HELPLINE);

export function useCountryHelpline() {
  const [helpline, setHelpline] = useState<CountryHelpline>(DEFAULT);
  const [countryCode, setCountryCode] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const cachedCountry = sessionStorage.getItem("user_country");
        if (cachedCountry && HELPLINE_BY_CODE[cachedCountry]) {
          setHelpline(toCountryHelpline(HELPLINE_BY_CODE[cachedCountry]));
          setCountryCode(cachedCountry);
          setLoading(false);
          return;
        }

        const response = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
        const data = await response.json();
        const code = data.country_code;

        if (code && HELPLINE_BY_CODE[code]) {
          setHelpline(toCountryHelpline(HELPLINE_BY_CODE[code]));
          setCountryCode(code);
          sessionStorage.setItem("user_country", code);
        }
      } catch {
        // fallback al default internacional
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { helpline, countryCode, loading };
}
