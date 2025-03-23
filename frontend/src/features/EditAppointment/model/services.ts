import { api } from "@/shared/api/api";

export function postEditAppointment({
  appointmentId,
  data,
}: {
  appointmentId: number;
  data: {
    patientId: number;
    reason: string;
    diagnosis: string;
    prescription: string;
    bp: number;
    heartRate: number;
    weight: number;
    height: number;
    notes: string;
  };
}) {
  return api.patch(`/appointments/${appointmentId}`, data);
}
