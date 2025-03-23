import { api } from "@/shared/api/api";

export async function deleteAppointment({
  appointmentId,
}: {
  appointmentId: number;
}) {
  return await api.delete(`/appointments/${appointmentId}`);
}
