import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.number(),
  reason: z.string(),
  diagnosis: z.string(),
  prescription: z.string(),
  bp: z.number(),
  heartRate: z.number(),
  weight: z.number(),
  height: z.number(),
  notes: z.string(),
});

export type TAppointment = z.infer<typeof AppointmentSchema>;
