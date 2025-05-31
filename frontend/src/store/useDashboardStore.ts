import { useFetch } from "@/hooks/useFetch";
import { userApi } from "@/libs/axios";
import { supabase } from "@/libs/supabaseClient";
import { ShareReport } from "@/types/dashboardTypes";
import { MedicalProfile } from "@/types/userTypes";
import { Dayjs } from "dayjs";
import { create } from "zustand";

type DashboardState = {
    showSetupModal: boolean;
    setShowSetupModal: (value: boolean) => void;
    showNavModal: boolean;
    setShowNavModal: (value: boolean) => void;
    handleNavModal: (e: React.MouseEvent) => void;
    showLogoutModal: boolean;
    setShowLogoutModal: (value: boolean) => void;
    showDeleteReading: boolean;
    setShowDeleteReading: (value: boolean) => void;
    readingToDelete: string;
    setReadingToDelete: (value: string) => void;
    selectedSortOption: string | undefined;
    setSelectedSortOption: (value: string | undefined) => void;
    selectedFilterOption: string | undefined;
    setSelectedFilterOption: (value: string | undefined) => void
    timeRange: "last7Days" | "thisMonth" | "custom";
    setTimeRange: (value: "last7Days" | "thisMonth" | "custom") => void
    startDate: Dayjs | null;
    setStartDate: (value: Dayjs | null) => void;
    endDate: Dayjs | null;
    setEndDate: (value: Dayjs | null) => void;
    showDeleteAccountModal: boolean;
    setShowDeleteAccountModal: (value: boolean) => void;
    showShareReportModal: boolean;
    setShowShareReportModal: (value: boolean) => void;

    // loading states
    loading: boolean;
    setLoading: (value: boolean) => void;
    signOutLoading: boolean;
    setSignOutLoading: (value: boolean) => void;
    darkModeLoading: boolean;
    setDarkModeLoading: (value: boolean) => void;
    uploadImageLoading: boolean;
    setUploadImageLoading: (value: boolean) => void;
    medicalProfileLoading: boolean;
    setMedicalProfileLoading: (value: boolean) => void;
    updateProfileLoading: boolean;
    setUpdateProfileLoading: (value: boolean) => void;
    glucosePreferenceLoading: boolean;
    setGlucosePreferenceLoading: (value: boolean) => void;
    shareReportLoading: boolean;
    setShareReportLoading: (value: boolean) => void;
    deleteAccountLoading: boolean;
    setDeleteAccountLoading: (value: boolean) => void;

    //Actions
    uploadImage: (file: File) => Promise<boolean>
    medicalProfile: (userData: MedicalProfile) => Promise<boolean>
    updateProfile: (userData: { firstName?: string, lastName?: string } & MedicalProfile) => Promise<boolean>
    updateGlucosePreference: (userData: MedicalProfile) => Promise<boolean>
    shareReportWithEmail: (userData: ShareReport) => Promise<boolean>
    deleteAccount: () => Promise<boolean>


}
export const useDashboardStore = create<DashboardState>((set) => ({

    showSetupModal: false,
    setShowSetupModal: (value) => set({ showSetupModal: value }),

    showNavModal: false,
    setShowNavModal: (value) => set({ showNavModal: value }),

    showDeleteReading: false,
    setShowDeleteReading: (value) => set({ showDeleteReading: value }),
    readingToDelete: "",
    setReadingToDelete: (value) => set({ readingToDelete: value }),

    handleNavModal: (e: React.MouseEvent) => {
        e.stopPropagation();
        set((state) => ({ showNavModal: !state.showNavModal }))
    },

    showLogoutModal: false,
    setShowLogoutModal: (value) => set({ showLogoutModal: value }),

    selectedSortOption: undefined,
    setSelectedSortOption: (value) => set({ selectedSortOption: value }),

    selectedFilterOption: undefined,
    setSelectedFilterOption: (value) => set({ selectedFilterOption: value }),

    timeRange: "last7Days",
    setTimeRange: (value) => set({ timeRange: value }),

    startDate: null,
    setStartDate: (value) => set({ startDate: value }),

    endDate: null,
    setEndDate: (value) => set({ endDate: value }),

    showDeleteAccountModal: false,
    setShowDeleteAccountModal: (value) => set({ showDeleteAccountModal: value }),

    showShareReportModal: false,
    setShowShareReportModal: (value) => set({ showShareReportModal: value }),

    // Loading states
    loading: true,
    setLoading: (value) => set({ loading: value }),

    signOutLoading: false,
    setSignOutLoading: (value) => set({ signOutLoading: value }),

    darkModeLoading: false,
    setDarkModeLoading: (value) => set({ darkModeLoading: value }),

    uploadImageLoading: false,
    setUploadImageLoading: (value) => set({ uploadImageLoading: value }),

    medicalProfileLoading: false,
    setMedicalProfileLoading: (value) => set({ medicalProfileLoading: value }),

    updateProfileLoading: false,
    setUpdateProfileLoading: (value) => set({ updateProfileLoading: value }),

    glucosePreferenceLoading: false,
    setGlucosePreferenceLoading: (value) => set({ glucosePreferenceLoading: value }),

    shareReportLoading: false,
    setShareReportLoading: (value) => set({ shareReportLoading: value }),

    deleteAccountLoading: false,
    setDeleteAccountLoading: (value) => set({ deleteAccountLoading: value }),

    // Actions
    uploadImage: async (file: File) => {
        const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);

        const formData = new FormData();
        formData.append("file", file);

        const response = await useFetch("post", "/upload-avatar", formData, useDashboardStore.getState().setUploadImageLoading, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined,
            }
        }, userApi)

        if (!response?.data?.success) {
            return false
        }
        return response?.data?.avatarUrl
    },

    medicalProfile: async (userData) => {

        const { diabetesType, age, bloodSugarUnit, diagnosisDate, gender } = userData
        const token = await supabase.auth.getSession().then(res => res.data?.session?.access_token)

        const response = await useFetch("post", "/medical-profile", { diabetesType, age, bloodSugarUnit, diagnosisDate, gender }, useDashboardStore.getState().setMedicalProfileLoading, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }, userApi)

        if (!response?.data?.success) {
            return false
        }
        return true

    },

    updateProfile: async (userData) => {

        const { firstName, lastName, diabetesType, age, diagnosisDate, gender } = userData
        const token = await supabase.auth.getSession().then(res => res.data?.session?.access_token)

        const response = await useFetch("put", "/update-profile", { firstName, lastName, diabetesType, age, diagnosisDate, gender }, useDashboardStore.getState().setUpdateProfileLoading, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }, userApi)

        if (!response?.data?.success) {
            return false
        }
        return true

    },
    updateGlucosePreference: async (userData) => {

        const { bloodSugarUnit, targetBloodSugarRange } = userData
        const token = await supabase.auth.getSession().then(res => res.data?.session?.access_token)

        const response = await useFetch("put", "/update-glucose-preference", { bloodSugarUnit, targetBloodSugarRange }, useDashboardStore.getState().setGlucosePreferenceLoading, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }, userApi)

        if (!response?.data?.success) {
            return false
        }
        return true

    },

    shareReportWithEmail: async (userData) => {

        const { email, file, fullName, emailMessage } = userData

        const formData = new FormData();
        formData.append("file", file!);
        formData.append("email", email);
        formData.append("fullName", fullName!);
        formData.append("emailMessage", emailMessage ?? "");

        const response = await useFetch("post", "/share-report", formData, useDashboardStore.getState().setShareReportLoading, {
            headers: {
                "Content-Type": undefined,
            }
        }, userApi)

        if (!response?.data?.success) {
            return false
        }
        return true

    },

    deleteAccount: async () => {

        const token = await supabase.auth.getSession().then(res => res.data.session?.access_token);

        const response = await useFetch("delete", "/delete-account", undefined, useDashboardStore.getState().setDeleteAccountLoading, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }, userApi)

        if (!response?.data?.success) {
            return false
        }
        return true

    }

}))