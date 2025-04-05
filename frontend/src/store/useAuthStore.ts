import { create } from "zustand";
import { SignInData, SignUpData } from "@/types/authTypes";
import { User } from "@/types/userTypes";
import { useUserStore } from "./useUserStore";

const placeholderProfile = 'https://img.asmedia.epimg.net/resizer/v2/LJOXQWQSWVBEJERI3DW467CMA4.jpg?auth=9e2aa1936e121ee7b592cbf744671e4a6df45ebe9c910cb9310492fe573aad8b&width=1200&height=1200&smart=true';

type AuthState = {
    signin: (userData: SignInData) => void;
    signup: (userData: Omit<SignUpData, "id">) => void;
    logout: (navigate: (path: string) => void) => void;
};

export const useAuthStore = create<AuthState>(() => ({
    signin: (userData) => {
        const storedUser: User | null = JSON.parse(localStorage.getItem("user") || "null");
        if (storedUser && storedUser.email === userData.email && storedUser.password === userData.password) {
            useUserStore.getState().setUser(storedUser);
        } else {
            console.log("Invalid Credentials");
        }
    },

    signup: (userData) => {
        const newUser: User = {
            id: Date.now().toString(),
            profilePic: userData.profilePic || placeholderProfile,
            darkMode: false,
            ...userData
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        useUserStore.getState().setUser(newUser);
    },

    logout: (navigate) => {
        // localStorage.removeItem("user");
        useUserStore.getState().setUser(null);
        document.documentElement.classList.remove("dark");
        navigate("/signin");
    },
}));
