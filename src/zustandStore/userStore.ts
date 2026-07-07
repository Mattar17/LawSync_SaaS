// userStore.ts
import { create } from "zustand";

type Office = {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  owner_id: string;
};

type User = {
  id: string;
  email: string;
  name: string;
  bio?: string;
  pictureUrl?: string;
  hasOffice?: boolean;
  offices?: Office[];
};

type UserStore = {
  user: User | null;
  currentOffice: Office | null;
  setUser: (user: User) => void;
  setCurrentOffice: (office: Office) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  currentOffice: null,
  setCurrentOffice: (office) => set({ currentOffice: office }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
