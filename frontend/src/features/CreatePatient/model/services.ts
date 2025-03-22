import { api } from "@/shared/api/api";

export async function postCreatePatient(data: {
  name: string;
  surname: string;
  phone: string;
  other: string;
}) {
  return await api.post("/patients", data);
}
