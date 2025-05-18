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
}))