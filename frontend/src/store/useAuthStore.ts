import { create } from "zustand";
import { ResendVerifyOtpData, SignInData, SignUpData, VerifyOtpData } from "@/types/authTypes";
import { User } from "@/types/userTypes";
import { useUserStore } from "./useUserStore";
import { supabase } from "@/libs/supabaseClient";
import { toast } from "sonner";
import { useDashboardStore } from "./useDashboardStore";
import { useFetch } from "@/hooks/useFetch";


type AuthState = {
    signin: (userData: SignInData) => Promise<User | { success: boolean } | null>;
    signInWithGoogle: () => Promise<any>;
    verifyOtp: (userData: VerifyOtpData) => Promise<User | undefined>;
    resendVerifyOtp: (userData: ResendVerifyOtpData) => Promise<boolean>;
    signup: (userData: Omit<SignUpData, "id">) => Promise<User | { success: boolean } | null>;
    logout: (navigate: (path: string) => void) => void;
    checkAuth: () => Promise<User | null>
};

export const useAuthStore = create<AuthState>(() => ({
    signin: async (userData) => {
        useDashboardStore.getState().setSignInLoading(true);
        const { email, password } = userData;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                toast.error(error.message);
                useDashboardStore.getState().setSignInLoading(false);
                return null;
            }

            if (!data?.user?.user_metadata?.otpVerified) {
                useDashboardStore.getState().setSignInLoading(false);
                toast.info("Please verify your email first.")
                return { success: false };
            }

            const { user } = data;
            const userMeta = user?.user_metadata || {};

            const newUser: User = {
                id: user?.id ?? '',
                createdAt: user?.created_at || new Date(),
                email: user?.email ?? email,
                firstName: userMeta.firstName ?? '',
                lastName: userMeta.lastName ?? '',
                darkMode: false,
                profilePic: undefined,
                medicalProfile: undefined,
            };

            useUserStore.getState().setUser(newUser);
            const hasCompletedSetup = user.user_metadata?.hasCompletedSetup;
            if (!hasCompletedSetup) {
                useDashboardStore.getState().setShowSetupModal(true)
            }
            useDashboardStore.getState().setSignInLoading(false);
            toast.success(`Welcome back, ${newUser.firstName} ${newUser.lastName}`);
            return newUser;

        } catch (err) {
            toast.error("Something went wrong during sign in.");
            useDashboardStore.getState().setSignInLoading(false);
            console.error(err);
            return null;
        }
    },

    signInWithGoogle: async () => {
        useDashboardStore.getState().setGoogleLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                },
            });
            if (error) {
                useDashboardStore.getState().setGoogleLoading(false);
                toast.error(error.message)
            };
            return data

        } catch (err) {
            useDashboardStore.getState().setGoogleLoading(false);
            console.log(err)
        }
    },


    signup: async (userData) => {
        useDashboardStore.getState().setSignUpLoading(true);
        const { firstName, lastName, email, password } = userData;
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstName,
                        lastName,
                        hasCompletedSetup: false,
                        otpVerified: false,
                    }
                }
            });
            console.log(data)
            await useFetch("post", "/send-otp", { email, userId: data?.user?.id })
            if (error) {
                toast.error(error.message)
                useDashboardStore.getState().setSignUpLoading(false);
                return { success: false }

            } else {
                useDashboardStore.getState().setSignUpLoading(false);
                toast.success(`We've sent a 6-digit code to ${email}. Please enter it below to verify your account.`)

                return { success: true }
            }

        } catch (err) {
            toast.error("Something went wrong during signup.");
            useDashboardStore.getState().setSignUpLoading(false);
            console.error(err);
            return { success: false };
        }
    },

    logout: async (navigate) => {
        useDashboardStore.getState().setSignOutLoading(true);
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                toast.error(error.message)
                useDashboardStore.getState().setLoading(false);
                return null;
            } else {
                document.documentElement.classList.remove("dark");
                useDashboardStore.getState().setSignOutLoading(false);
                useUserStore.getState().setUser(null);
                toast.success("Sign out successfully")
                navigate("/signin");
            }
        } catch (err) {
            toast.error("Something went wrong during signout.");
            useDashboardStore.getState().setSignOutLoading(false);
            console.error(err);
            return null;
        }
    },
    checkAuth: async () => {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
            useUserStore.getState().setUser(null);
            return null;
        }

        if (data?.user && !data?.user?.user_metadata?.otpVerified) {
            useUserStore.getState().setUser(null);
            return null;
        }

        const user = data.user;
        const meta = user.user_metadata || {};

        const fullName = meta.full_name || meta.name || "";
        const [firstName = "", ...lastParts] = fullName.split(" ");
        const lastName = lastParts.join(" ");

        const newUser: User = {
            id: user.id,
            createdAt: user.created_at || new Date(),
            email: user.email ?? '',
            firstName: firstName || meta.firstName || "",
            lastName: lastName || meta.lastName || "",
            darkMode: false,
            profilePic: meta.avatar_url || meta.profilePic || undefined,
            medicalProfile: undefined,
        };

        useUserStore.getState().setUser(newUser);
        return newUser;
    },

    verifyOtp: async (userData) => {
        const { otpCode } = userData;
        const { data } = await supabase.auth.getUser()

        const email = data?.user?.email || ""
        const firstName = data?.user?.user_metadata?.firstName || "";
        const lastName = data?.user?.user_metadata?.lastName || "";

        await supabase.auth.updateUser({
            data: { hasCompletedSetup: false }
        });

        const response = await useFetch("post", "/verify-email", { email, code: otpCode }, useDashboardStore.getState().setVerifyEmailLoading)

        if (!response?.data?.success) {
            return
        }

        const newUser: User = {
            id: data.user?.id ?? '',
            createdAt: data.user?.created_at || new Date(),
            email,
            firstName,
            lastName,
            darkMode: false,
            profilePic: undefined,
            medicalProfile: undefined,
        };
        useUserStore.getState().setUser(newUser);
        toast.success(`Welcome ${firstName} ${lastName}`)
        return newUser;
    },

    resendVerifyOtp: async (userData) => {
        const { email } = userData;

        const response = await useFetch("post", "/resend-verify-email", { email })

        if (!response?.data?.success) {
            return false;
        }

        return true

    }
}));
