import { create } from "zustand";
import type { UserModel } from "~/types/userModel";

interface CurrentUserState {
  user: UserModel | null;
  setUser: (user: UserModel) => void;
}

const useCurrentUser = create<CurrentUserState>((set) => ({
  user: null,
  setUser: (user: UserModel) => set({ user }),
}));

export default useCurrentUser;
