// ISO 3166-1 alpha-3 → alpha-2, para los países presentes en los CSV de datos.
// Se usa para derivar la bandera emoji a partir del country_code del CSV.
const ISO3_TO_ISO2: Record<string, string> = {
  ARG: "AR", AUS: "AU", AUT: "AT", BEL: "BE", BLR: "BY", BOL: "BO", BRA: "BR",
  CAN: "CA", CHE: "CH", CHL: "CL", CHN: "CN", COL: "CO", CRI: "CR", CUB: "CU",
  DEU: "DE", DOM: "DO", ECU: "EC", EGY: "EG", ESP: "ES", FIN: "FI", FRA: "FR",
  GBR: "GB", GTM: "GT", GUY: "GY", HND: "HN", HUN: "HU", IND: "IN", IRL: "IE",
  ITA: "IT", JPN: "JP", KAZ: "KZ", KEN: "KE", KIR: "KI", KOR: "KR", LSO: "LS",
  LTU: "LT", LVA: "LV", MEX: "MX", NGA: "NG", NIC: "NI", NLD: "NL", NOR: "NO",
  NZL: "NZ", PAN: "PA", PER: "PE", POL: "PL", PRT: "PT", PRY: "PY", RUS: "RU",
  SLV: "SV", SUR: "SR", SVN: "SI", SWE: "SE", SWZ: "SZ", THA: "TH", URY: "UY",
  USA: "US", VEN: "VE", ZAF: "ZA",
};

/** Bandera emoji a partir de un código ISO alpha-2 (indicadores regionales). */
export function flagFromIso2(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "🏳️";
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join("");
}

/** Bandera emoji a partir de un código ISO alpha-3 (el que traen los CSV). */
export function flagFromIso3(code3: string): string {
  const code2 = ISO3_TO_ISO2[code3?.toUpperCase()];
  return code2 ? flagFromIso2(code2) : "🏳️";
}
