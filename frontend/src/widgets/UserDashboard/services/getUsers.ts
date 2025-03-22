import { UserSchema, type TUser } from "@/entities/User";
import { api } from "@/shared/api/api";
import { z } from "zod";

const ResponseSchema = z.array(UserSchema);

export async function getUsers() {
  const response = await api.get("/users");
  const updatedData: TUser[] = response.data.map((user: any) => ({
    id: user.id,
    name: user.name,
    surname: user.username,
    phone: user.address.zipcode,
    other: user.email,
  }));

  const result = ResponseSchema.safeParse(updatedData);

  if (result.error) {
    console.log(result.error);
    throw new Error("Wrong Api Response");
  }

  return result.data;
}
