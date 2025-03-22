import type { ColumnDef } from "@tanstack/table-core";
import { PatientsActions } from "../ui/PatientsActions";
import type { TUser } from "@/entities/User";

export const columns: ColumnDef<TUser>[] = [
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
    header: "Actions",
    cell: ({ row }) => {
      return <PatientsActions userId={row.original.id} />;
    },
  },
];
