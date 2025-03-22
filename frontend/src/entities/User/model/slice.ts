import { create } from "zustand";
import type { TUser } from "./types";

type TUserStore = {
  users: TUser[];
  setUsers: (users: TUser[]) => void;
  deleteUser: (id: number) => void;
};

export const useUserStore = create<TUserStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));
