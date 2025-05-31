import { create } from "zustand";

import { useDashboardStore } from "./useDashboardStore";
import { supabase } from "@/libs/supabaseClient";
import { useUserStore } from "./useUserStore";
import { useFetch } from "@/hooks/useFetch";
import { userApi } from "@/libs/axios";

type ThemeState = {
    isDarkMode: boolean;
    darkMode: boolean;
    applyDarkMode: () => void;
    toggleDarkMode: () => void;
    resetTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    // Sidebar state
    isDarkMode: false,

    // Global state
    darkMode: false,

    applyDarkMode: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const darkMode = user?.user_metadata?.darkMode;

        // ⚡️ Update Zustand
        useUserStore.setState((prev) => ({
            user: {
                ...prev.user!,
                darkMode,
            }
        }));

        // 🌙 Apply class
        const darkClass = "dark";
        if (darkMode) {
            document.documentElement.classList.add(darkClass);
            set({ isDarkMode: true, darkMode: true });
        } else {
            document.documentElement.classList.remove(darkClass);
            set({ isDarkMode: false, darkMode: false });
        }

        setTimeout(() => {
            set({ isDarkMode: false });
        }, 300);
    },

    toggleDarkMode: async () => {
        const { user } = useUserStore.getState();
        if (!user) return;

        const newDarkMode = !user.darkMode;
        const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);

        try {
            await useFetch("post", "/dark-mode", { darkMode: newDarkMode }, useDashboardStore.getState().setDarkModeLoading, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }, userApi, {
                type: "promise",
                loadingMessage: "Applying theme...",
            })

            // 🔁 Fetch updated user again from Supabase (to get correct user_metadata)
            const { data: { user: updatedUser } } = await supabase.auth.getUser();

            const newDarkModeValue = updatedUser?.user_metadata?.darkMode ?? false;

            useUserStore.setState((prev) => ({
                user: {
                    ...prev.user!,
                    darkMode: newDarkModeValue,
                }
            }));

            // 🌙 Apply theme based on new value
            const darkClass = "dark";
            if (updatedUser?.user_metadata?.darkMode) {
                document.documentElement.classList.add(darkClass);
                set({ isDarkMode: true, darkMode: true });
            } else {
                document.documentElement.classList.remove(darkClass);
                set({ isDarkMode: false, darkMode: false });
            }

            setTimeout(() => {
                set({ isDarkMode: false });
            }, 300);
        } catch (error) {
            console.error("Failed to update dark mode:", error);
        }
    },

    resetTheme: () => {
        document.documentElement.classList.remove("dark");
        set({ darkMode: false, isDarkMode: false });
    }

}));
useThemeStore.getState().applyDarkMode();
