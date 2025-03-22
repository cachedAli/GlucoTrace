import { create } from "zustand";
import { useUserState } from "./useUserStore";
// import { useUserState } from "@/store/userState";

type ThemeState = {
    applyDarkMode: () => void;
    toggleDarkMode: () => void;
};

// Create Theme Store
export const useThemeStore = create<ThemeState>((set) => ({
    // Function to apply dark mode on page load
    applyDarkMode: () => {
        const { user } = useUserState.getState();
        if (user?.darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    },

    // Function to toggle dark mode
    toggleDarkMode: () => {
        const { user } = useUserState.getState();
        if (!user) return;

        // Toggle dark mode state
        const updatedUser = { ...user, darkMode: !user.darkMode };

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update Zustand state
        useUserState.setState({ user: updatedUser });

        // Apply the dark mode changes
        useThemeStore.getState().applyDarkMode();
    },
}));
