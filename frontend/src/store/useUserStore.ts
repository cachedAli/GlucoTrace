import { create } from "zustand";

import { User } from "@/types/userTypes";


type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
};


export const useUserStore = create<UserState>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
     setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },
}));


