import { Td, Th, Table } from "@/components/ui/table";

export function SimpleReportTable({ columns, rows }: { columns: string[]; rows: Array<Record<string, string | number>> }) {
  return (
    <Table>
      <thead>
        <tr>{columns.map((column) => <Th key={column}>{column}</Th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => <Td key={column}>{row[column]}</Td>)}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
