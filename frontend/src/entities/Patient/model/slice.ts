import { create } from "zustand";
import type { TPatient } from "./types";

type TPatientStore = {
  patients: TPatient[];
  setPatients: (patients: TPatient[]) => void;
  getSelectedPatient: (id: number) => TPatient | undefined;
};

export const usePatientStore = create<TPatientStore>((set, get) => ({
  patients: [],

  setPatients: (patients) => set({ patients }),
  getSelectedPatient: (id) =>
    get().patients.find((patient) => patient.id === id),
}));
