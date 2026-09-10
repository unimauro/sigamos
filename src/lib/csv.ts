import { useEffect, useState } from "react";

/** Divide una línea CSV respetando comillas dobles. */
function splitLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = splitLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

/**
 * Carga y parsea un CSV de `public/` (respeta el base path de Vite/GitHub Pages).
 * Devuelve `null` mientras carga o si falla, para que el consumidor use su
 * fallback y el gráfico nunca se rompa.
 */
export function useCsv(path: string): Record<string, string>[] | null {
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}${path}`, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((text) => {
        if (alive) setRows(parseCsv(text));
      })
      .catch(() => {
        if (alive) setRows(null);
      });
    return () => {
      alive = false;
    };
  }, [path]);
  return rows;
}
