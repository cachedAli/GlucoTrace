import { create } from "zustand";
import { SignInData, SignUpData } from "@/types/authTypes";
import { MedicalProfile, User } from "@/types/userTypes";
import { useUserStore } from "./useUserStore";

const placeholderProfile = 'https://img.asmedia.epimg.net/resizer/v2/LJOXQWQSWVBEJERI3DW467CMA4.jpg?auth=9e2aa1936e121ee7b592cbf744671e4a6df45ebe9c910cb9310492fe573aad8b&width=1200&height=1200&smart=true';

const defaultMedicalProfile: MedicalProfile = {
    diabetesType: "Type 1",
    bloodSugarUnit: "mg/dL",
    weight: 0,
    height: 0,
    insulinDependent: true,
    conditions: [],
    targetBloodSugarRange: { min: 70, max: 180 }
}
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
            medicalProfile: {
                ...defaultMedicalProfile,
                ...userData.medicalProfile,
            },
            ...userData
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        useUserStore.getState().setUser(newUser);
    },

    logout: (navigate) => {
        localStorage.removeItem("user");
        useUserStore.getState().setUser(null);
        document.documentElement.classList.remove("dark");
        navigate("/signin");
    },
}));
