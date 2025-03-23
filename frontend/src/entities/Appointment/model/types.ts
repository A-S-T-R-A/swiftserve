import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.number(),
  reason: z.string(),
  diagnosis: z.string(),
  prescription: z.string(),
  bp: z.number().nullable(),
  heartRate: z.number(),
  weight: z.number(),
  height: z.number(),
  notes: z.string(),
  createdAt: z.string(),
});

export type TAppointment = z.infer<typeof AppointmentSchema>;
