import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  phone: z.string(),
  other: z.string(),
});

export type TPatient = z.infer<typeof UserSchema>;
