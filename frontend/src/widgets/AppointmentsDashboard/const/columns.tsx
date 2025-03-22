import type { ColumnDef } from "@tanstack/table-core";
import type { TAppointment } from "@/entities/Appointment";

export const columns: ColumnDef<TAppointment>[] = [
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
  },
  {
    accessorKey: "prescription",
    header: "Prescription",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "bp",
    header: "Blood Pressure",
    enableGlobalFilter: false,
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     return <ActionsUser userId={row.original.id} />;
  //   },
  // },
];
