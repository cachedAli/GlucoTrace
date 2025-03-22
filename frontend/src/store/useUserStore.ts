import { SignInData, SignUpData, User } from "@/types/authTypes";
import { create } from "zustand";


type UserState = {
    user: User | null;
    signin: (userData: SignInData) => void;
    signup: (userData: Omit<SignUpData, "id">) => void;
    logout: () => void;
};
const placeholderProfile = 'https://img.asmedia.epimg.net/resizer/v2/LJOXQWQSWVBEJERI3DW467CMA4.jpg?auth=9e2aa1936e121ee7b592cbf744671e4a6df45ebe9c910cb9310492fe573aad8b&width=1200&height=1200&smart=true'

export const useUserState = create<UserState>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),

    signin: (userData) => {
        const storedUser = JSON.parse(localStorage.getItem("user") || 'null');
        if (storedUser && storedUser.email === userData?.email && storedUser?.password === userData?.password) {
            set({ user: storedUser });
        } else {
            console.log("invalid Credentials")
        }
    },

    signup: (userData) => {
        const newUser = { id: Date.now().toString(), profilePic: userData.profilePic || placeholderProfile, darkMode: false, ...userData };
        localStorage.setItem("user", JSON.stringify(newUser));
        set({ user: newUser });
    },

    logout: () => {
        localStorage.removeItem("user");
        set({ user: null });
    },
}))

