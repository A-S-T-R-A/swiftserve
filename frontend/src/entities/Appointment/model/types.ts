import { z } from "zod";

export const AppointmentSchema = z.object({
  id: z.number().nullable(),
  reason: z.string().nullable(),
  diagnosis: z.string().nullable(),
  prescription: z.string().nullable(),
  bp: z.number().nullable(),
  heartRate: z.number().nullable(),
  weight: z.number().nullable(),
  height: z.number().nullable(),
  notes: z.string().nullable().nullable(),
  createdAt: z.string().nullable(),
});

export type TAppointment = z.infer<typeof AppointmentSchema>;
