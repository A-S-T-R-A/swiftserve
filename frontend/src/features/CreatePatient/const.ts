import type { TPatient } from "@/entities/Patient";

export const defaultPatient: Omit<TPatient, "id"> = {
  name: "",
  surname: "",
  phone: "",
  other: "",
};
