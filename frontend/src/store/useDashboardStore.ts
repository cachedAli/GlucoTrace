import { create } from "zustand";

type DashboardState = {
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
}
export const useDashboardStore = create<DashboardState>((set) => ({
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
    setSelectedFilterOption: (value) => set({ selectedFilterOption: value })


}))