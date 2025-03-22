import { create } from "zustand";
import type { TUser } from "./types";

type TUserStore = {
  users: TUser[];
  setUsers: (users: TUser[]) => void;
  deleteUser: (id: number) => void;
  getSelectedUser: (id: number) => TUser | undefined;
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
