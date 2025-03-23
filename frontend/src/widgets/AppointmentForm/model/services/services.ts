import { api } from "@/shared/api/api";
import type { TCreateAppointmentResponse } from "../types";

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
}): Promise<TCreateAppointmentResponse> {
  return await api.post("/appointments", data).then((res) => res.data);
}
