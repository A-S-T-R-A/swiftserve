import { api } from "@/shared/api/api";
import { AppointmentSchema } from "./types";
import { z } from "zod";

const ResponseSchema = z.array(AppointmentSchema);
export async function getAppointments() {
  const response = await api.get("/appointments");

  const result = ResponseSchema.safeParse(response.data);

  if (result.error) {
    console.log(result.error);
    throw new Error("Wrong Api Response");
  }

  return result.data;
}

export async function getAppointmentById(id: number) {
  const response = await api.get(`/appointments/${id}`);

  const result = AppointmentSchema.safeParse(response.data);

  if (result.error) {
    console.log(result.error);
    throw new Error("Wrong Api Response");
  }

  return result.data;
}
