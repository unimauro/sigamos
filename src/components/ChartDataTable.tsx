// Tabla de datos oculta visualmente (sr-only) pero disponible para lectores de
// pantalla. Da el equivalente textual de cada gráfico: los SVG de Recharts no
// son legibles por AT, así que esta tabla es la fuente accesible real.

interface ChartDataTableProps {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}

const ChartDataTable = ({ caption, columns, rows }: ChartDataTableProps) => (
  <table className="sr-only">
    <caption>{caption}</caption>
    <thead>
      <tr>
        {columns.map((c) => (
          <th key={c} scope="col">
            {c}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) =>
            j === 0 ? (
              <th key={j} scope="row">
                {cell}
              </th>
            ) : (
              <td key={j}>{cell}</td>
            ),
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

export default ChartDataTable;
