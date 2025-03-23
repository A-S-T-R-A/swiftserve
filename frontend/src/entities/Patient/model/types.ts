import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().nullable(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  phone: z.string().nullable(),
  other: z.string().nullable(),
});

export type TPatient = z.infer<typeof UserSchema>;
