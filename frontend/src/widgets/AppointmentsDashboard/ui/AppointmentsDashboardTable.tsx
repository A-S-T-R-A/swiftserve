import { AppointmentsTable } from "./AppointmentsTable";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../const/columns";
import { getAppointments } from "@/entities/Appointment";

export function AppointmentsDashboardTable() {
  const { data, isPending, error } = useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return <AppointmentsTable columns={columns} data={data} />;
}
