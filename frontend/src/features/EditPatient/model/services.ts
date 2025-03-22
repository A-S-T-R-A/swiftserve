import { api } from "@/shared/api/api";

export async function postUpdatePatient(data: {
  name: string;
  surname: string;
  phone: string;
  other: string;
  patientId: number;
}) {
  return await api.post(`/patients/${data.patientId}`, data);
}
