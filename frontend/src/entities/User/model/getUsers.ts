import { UserSchema } from "@/entities/User";
import { api } from "@/shared/api/api";
import { z } from "zod";

const ResponseSchema = z.array(UserSchema);

export async function getUsers() {
  const response = await api.get("/patients");

  const result = ResponseSchema.safeParse(response.data);

  if (result.error) {
    console.log(result.error);
    throw new Error("Wrong Api Response");
  }

  return result.data;
}
