import { api } from "@/shared/api/api";

export async function printSummary({ id }: { id: number }) {
  return api.get(`appointments/${id}/pdf`, { responseType: "arraybuffer" });
}
