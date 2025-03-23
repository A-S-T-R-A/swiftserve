import type { ColumnDef } from "@tanstack/table-core";
import { PatientsActions } from "../ui/PatientsActions";
import type { TPatient } from "@/entities/Patient";

export const columns: ColumnDef<TPatient>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "surname",
    header: "Surname",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "other",
    header: "Other",
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <PatientsActions userId={row.original.id} />
        </div>
      );
    },
  },
];
