import type { TPatient } from "@/entities/Patient";
import { columns } from "../const/columns";

const getNestedValue = (obj: Record<string, any>, path: string): string => {
  const value = path
    .split(".")
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
  return typeof value === "string" ? value : "";
};

const convertJsonToCsv = (jsonData: TPatient[]) => {
  const rows = jsonData.map((rowData: TPatient) =>
    columns
      .map((column) => {
        const value = getNestedValue(rowData, column.accessorKey);
        return JSON.stringify(value, (_, value) =>
          value === null ? "" : value
        );
      })
      .join(",")
  );
  return [columns.map((c) => c.header).join(","), ...rows].join("\n");
};

export const downloadJsonToCsv = (data: TPatient[]) => {
  const csv = convertJsonToCsv(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.csv";
  link.click();
};
