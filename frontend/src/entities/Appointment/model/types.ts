import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.number(),
  reason: z.string(),
  diagnosis: z.string().nullable(),
  prescription: z.string().nullable(),
  bp: z.number().nullable(),
  heartRate: z.number().nullable(),
  weight: z.number(),
  height: z.number(),
  notes: z.string().nullable(),
  createdAt: z.string(),
});

export type TAppointment = z.infer<typeof AppointmentSchema>;
