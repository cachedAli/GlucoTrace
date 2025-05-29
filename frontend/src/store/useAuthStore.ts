import { create } from "zustand";
import { ResendVerifyOtpData, ResetPassword, SignInData, SignUpData, VerifyForgotPasswordData, VerifyOtpData } from "@/types/authTypes";
import { User } from "@/types/userTypes";
import { useUserStore } from "./useUserStore";
import { supabase } from "@/libs/supabaseClient";
import { toast } from "sonner";
import { useDashboardStore } from "./useDashboardStore";
import { useFetch } from "@/hooks/useFetch";
import { useThemeStore } from "./useThemeStore";


type AuthState = {

    // Actions
    signin: (userData: SignInData) => Promise<User | { success: boolean } | null>;
    signInWithGoogle: () => Promise<any>;
    verifyOtp: (userData: VerifyOtpData) => Promise<User | undefined>;
    resendVerifyOtp: (userData: ResendVerifyOtpData) => Promise<boolean>;
    forgotPassword: (userData: { email: string }) => Promise<boolean>;
    verifyForgotPasswordEmail: (userData: VerifyForgotPasswordData) => Promise<boolean>;
    resetPassword: (userData: ResetPassword) => Promise<boolean>;

    resendForgotPasswordOtp: (userData: ResendVerifyOtpData) => Promise<boolean>;
    signup: (userData: Omit<SignUpData, "id">) => Promise<User | { success: boolean } | null>;
    logout: (navigate: (path: string) => void) => void;
    checkAuth: () => Promise<User | null>

    // loading States
    signInLoading: boolean;
    setSignInLoading: (value: boolean) => void;
    signUpLoading: boolean;
    setSignUpLoading: (value: boolean) => void;
    googleLoading: boolean;
    setGoogleLoading: (value: boolean) => void;
    verifyEmailLoading: boolean;
    setVerifyEmailLoading: (value: boolean) => void;
    forgotPasswordLoading: boolean;
    setForgotPasswordLoading: (value: boolean) => void;
    verifyForgotPasswordLoading: boolean;
    setVerifyForgotPasswordLoading: (value: boolean) => void;
    resetPasswordLoading: boolean;
    setResetPasswordLoading: (value: boolean) => void;

};

export const useAuthStore = create<AuthState>((set) => ({

    // Loading states
    signInLoading: false,
    setSignInLoading: (value) => set({ signInLoading: value }),

    signUpLoading: false,
    setSignUpLoading: (value) => set({ signUpLoading: value }),


    googleLoading: false,
    setGoogleLoading: (value) => set({ googleLoading: value }),

    verifyEmailLoading: false,
    setVerifyEmailLoading: (value) => set({ verifyEmailLoading: value }),

    forgotPasswordLoading: false,
    setForgotPasswordLoading: (value) => set({ forgotPasswordLoading: value }),

    verifyForgotPasswordLoading: false,
    setVerifyForgotPasswordLoading: (value) => set({ verifyForgotPasswordLoading: value }),

    resetPasswordLoading: false,
    setResetPasswordLoading: (value) => set({ resetPasswordLoading: value }),


    // Actions
    signin: async (userData) => {
        useAuthStore.getState().setSignInLoading(true);
        const { email, password } = userData;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                toast.error(error.message);
                useAuthStore.getState().setSignInLoading(false);
                return null;
            }

            if (!data?.user?.user_metadata?.otpVerified) {
                useAuthStore.getState().setSignInLoading(false);
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
                darkMode: userMeta.darkMode ?? false,
                profilePic: userMeta?.custom_avatar_url || userMeta?.avatar_url || undefined,
                medicalProfile: {
                bloodSugarUnit: userMeta?.medicalProfile?.bloodSugarUnit ?? "",
                age: userMeta?.medicalProfile?.age ?? "",
                diabetesType: userMeta?.medicalProfile?.diabetesType ?? "",
                diagnosisDate: userMeta?.medicalProfile?.diagnosisDate ?? "",
                gender: userMeta?.medicalProfile?.gender ?? "",
                targetBloodSugarRange: userMeta?.medicalProfile?.targetBloodSugarRange ?? "",
            },
            };

            useUserStore.getState().setUser(newUser);
            const hasCompletedSetup = user.user_metadata?.hasCompletedSetup;
            if (!hasCompletedSetup) {
                useDashboardStore.getState().setShowSetupModal(true)
            }
            useAuthStore.getState().setSignInLoading(false);
            toast.success(`Welcome back, ${newUser.firstName} ${newUser.lastName}`);
            return newUser;

        } catch (err) {
            toast.error("Something went wrong during sign in.");
            useAuthStore.getState().setSignInLoading(false);
            console.error(err);
            return null;
        }
    },

    signInWithGoogle: async () => {
        useAuthStore.getState().setGoogleLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                },
            });
            if (error) {
                useAuthStore.getState().setGoogleLoading(false);
                toast.error(error.message)
            };

            return data

        } catch (err) {
            useAuthStore.getState().setGoogleLoading(false);
            console.log(err)
        }
    },


    signup: async (userData) => {
        useAuthStore.getState().setSignUpLoading(true);
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
                        custom_avatar_url: import.meta.env.VITE_CLOUDINARY_DEFAULT_IMAGE
                    }
                }
            });
            await useFetch("post", "/send-otp", { email, userId: data?.user?.id })
            if (error) {
                toast.error(error.message)
                useAuthStore.getState().setSignUpLoading(false);
                return { success: false }

            } else {
                useAuthStore.getState().setSignUpLoading(false);

                return { success: true }
            }

        } catch (err) {
            toast.error("Something went wrong during signup.");
            useAuthStore.getState().setSignUpLoading(false);
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
                useThemeStore.getState().resetTheme();

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
            darkMode: user?.user_metadata?.darkMode ?? false,
            profilePic: meta?.custom_avatar_url || meta?.avatar_url,
            medicalProfile: {
                bloodSugarUnit: meta?.medicalProfile?.bloodSugarUnit ?? "",
                age: meta?.medicalProfile?.age ?? "",
                diabetesType: meta?.medicalProfile?.diabetesType ?? "",
                diagnosisDate: meta?.medicalProfile?.diagnosisDate ?? "",
                gender: meta?.medicalProfile?.gender ?? "",
                targetBloodSugarRange: meta?.medicalProfile?.targetBloodSugarRange ?? "",
            },
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
        const existingMeta = data?.user?.user_metadata || {}

        await supabase.auth.updateUser({
            data: { ...existingMeta, hasCompletedSetup: false }
        });

        const response = await useFetch("post", "/verify-email", { email, code: otpCode }, useAuthStore.getState().setVerifyEmailLoading)

        if (!response?.data?.success) {
            return
        }
        const meta = data?.user?.user_metadata || {}
        const newUser: User = {
            id: data.user?.id ?? '',
            createdAt: data.user?.created_at || new Date(),
            email,
            firstName,
            lastName,
            darkMode: data?.user?.user_metadata?.darkMode ?? false,
            profilePic: data?.user?.user_metadata?.custom_avatar_url || data?.user?.user_metadata?.avatar_url || undefined,
            medicalProfile: {
                bloodSugarUnit: meta?.medicalProfile?.bloodSugarUnit ?? "",
                age: meta?.medicalProfile?.age ?? "",
                diabetesType: meta?.medicalProfile?.diabetesType ?? "",
                diagnosisDate: meta?.medicalProfile?.diagnosisDate ?? "",
                gender: meta?.medicalProfile?.gender ?? "",
                targetBloodSugarRange: meta?.medicalProfile?.targetBloodSugarRange ?? "",
            },
        };
        useUserStore.getState().setUser(newUser);

        if (!data?.user?.user_metadata?.hasCompletedSetup) {
            useDashboardStore.getState().setShowSetupModal(true);
        } else {
            useDashboardStore.getState().setShowSetupModal(false);
        }
        return newUser;
    },

    resendVerifyOtp: async (userData) => {
        const { email } = userData;

        const response = await useFetch("post", "/resend-verify-email", { email })

        if (!response?.data?.success) {
            return false;
        }

        return true

    },

    forgotPassword: async (userData) => {
        const { email } = userData;

        const response = await useFetch("post", "/forgot-password", { email }, useAuthStore.getState().setForgotPasswordLoading);

        if (!response?.data?.success) {
            return false;
        }
        return true
    },

    verifyForgotPasswordEmail: async (userData) => {

        const { email, otp } = userData;

        const response = await useFetch("post", "/verify-reset-password", { email, code: otp }, useAuthStore.getState().setVerifyForgotPasswordLoading);

        if (!response?.data?.success) {
            return false;
        }
        return true
    },

    resendForgotPasswordOtp: async (userData) => {
        const { email } = userData;

        const response = await useFetch("post", "/resend-reset-password-otp", { email })

        if (!response?.data?.success) {
            return false;
        }

        return true
    },

    resetPassword: async (userData) => {
        const { token, password } = userData;

        const response = await useFetch("post", "/reset-password", { token, password }, useAuthStore.getState().setResetPasswordLoading)

        if (!response?.data?.success) {
            return false;
        }

        return true
    }


}));
