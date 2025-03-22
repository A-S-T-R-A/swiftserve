import { create } from "zustand";
import type { TPatient } from "./types";

type TUserStore = {
  users: TPatient[];
  setUsers: (users: TPatient[]) => void;
  deleteUser: (id: number) => void;
  getSelectedUser: (id: number) => TPatient | undefined;
};

export const useUserStore = create<TUserStore>((set, get) => ({
  users: [],

  setUsers: (users) => set({ users }),
  getSelectedUser: (id) => get().users.find((user) => user.id === id),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
