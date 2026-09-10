import { useTranslation } from "react-i18next";
import { SOURCES, type SourceKey } from "@/data/sources";

interface ChartSourceProps {
  sources: SourceKey[];
  /** Texto adicional ya traducido (ej. "tasas crudas 2019"). */
  note?: string;
  /** Marca la serie como no oficial / esquemática. */
  illustrative?: boolean;
}

/**
 * Línea de atribución de fuente bajo cada gráfico. Regla del proyecto: ningún
 * dato sin fuente; lo no trazable se marca como "datos ilustrativos".
 */
const ChartSource = ({ sources, note, illustrative }: ChartSourceProps) => {
  const { t } = useTranslation();
  return (
    <p className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground/70 leading-relaxed">
      {illustrative && (
        <span className="inline-block mr-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 font-medium">
          {t("sources.illustrative")}
        </span>
      )}
      <span className="font-medium text-muted-foreground">{t("sources.label")}:</span>{" "}
      {sources.map((k, i) => (
        <span key={k}>
          {i > 0 && " · "}
          <a
            href={SOURCES[k].url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            {SOURCES[k].label}
          </a>
        </span>
      ))}
      {note && <span className="text-muted-foreground/60"> — {note}</span>}
    </p>
  );
};

export default ChartSource;
