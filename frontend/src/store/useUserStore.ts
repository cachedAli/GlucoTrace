import { create } from "zustand";
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

    const supabaseUser = data.user;

    const fullName = data.user?.user_metadata.full_name || "";
    const [firstName, ...lastParts] = fullName.split(" ");
    const lastName = lastParts.join(" ");

    const mappedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      firstName: supabaseUser.user_metadata?.firstName || firstName,
      lastName: supabaseUser.user_metadata?.lastName || lastName,
      profilePic: supabaseUser.user_metadata?.custom_avatar_url || supabaseUser.user_metadata?.custom_avatar_url || undefined,
      darkMode: supabaseUser.user_metadata?.darkMode,
      medicalProfile: supabaseUser.user_metadata?.medicalProfile,
    };

    set({ user: mappedUser });
  }
}));
