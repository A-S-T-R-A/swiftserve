import { api } from "@/shared/api/api";

export async function postCreateAppointment(data: {
  patientId: number;
  reason: string;
  diagnosis: string;
  prescription: string;
  bp: number;
  heartRate: number;
  weight: number;
  height: number;
  notes: string;
}) {
  return await api.post("/appointments", data);
}
