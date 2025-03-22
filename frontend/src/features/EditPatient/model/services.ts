import { api } from "@/shared/api/api";

export async function postUpdatePatient(data: {
  name: string;
  surname: string;
  phone: string;
  other: string;
  patientId: number;
}) {
  const { patientId, ...rest } = data;

  return await api.patch(`/patients/${patientId}`, rest);
}
