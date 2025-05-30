import { create } from "zustand";
import { createUserObject } from "@/libs/utils/utils";
import { supabase } from "@/libs/supabaseClient";
import { User } from "@/types/userTypes";

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUserFromSupabase: () => Promise<void>;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  fetchUserFromSupabase: async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      set({ user: null });
      return;
    }

    const mappedUser = createUserObject(data?.user)

    set({ user: mappedUser });
  }
}));
