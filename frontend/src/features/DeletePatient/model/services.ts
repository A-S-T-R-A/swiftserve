import { api } from "@/shared/api/api";

export async function deletePatient({ patientId }: { patientId: number }) {
  return await api.delete(`/patients/${patientId}`);
}
