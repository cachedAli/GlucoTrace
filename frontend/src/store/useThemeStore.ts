import { useUserStore } from "./useUserStore";
import { create } from "zustand";

type ThemeState = {
    isDarkMode: boolean;
    darkMode: boolean;
    applyDarkMode: () => void;
    toggleDarkMode: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
    // Sidebar state
    isDarkMode: false,

    // Global state
    darkMode: false,

    applyDarkMode: () => {
        const user = useUserStore.getState().user;
        const darkClass = "dark";

        if (user?.darkMode) {
            document.documentElement.classList.add(darkClass);
            set({ isDarkMode: true });
            set({ darkMode: true });

            setTimeout(() => {
                set({ isDarkMode: false });
            }, 300);


        } else {
            document.documentElement.classList.remove(darkClass);
            set({ darkMode: false });

            setTimeout(() => {
                set({ isDarkMode: false });
            }, 300);

        }
    },

    toggleDarkMode: () => {
        useUserStore.setState((state) => {
            if (!state.user) return state;

            const updatedUser = {
                ...state.user,
                darkMode: !state.user.darkMode,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            set({ isDarkMode: true });
            set({ darkMode: false });


            return { user: updatedUser };
        });
        useThemeStore.getState().applyDarkMode();
    },
}));
useThemeStore.getState().applyDarkMode();
