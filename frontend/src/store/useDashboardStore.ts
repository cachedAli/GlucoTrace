import { create } from "zustand";

type DashboardState = {
    showNavModal: boolean;
    setShowNavModal: (value: boolean) => void;
    handleNavModal: (e: React.MouseEvent) => void;
    showLogoutModal: boolean;
    setShowLogoutModal: (value: boolean) => void;
}
export const useDashboardStore = create<DashboardState>((set) => ({
    showNavModal: false,
    setShowNavModal: (value) => set({ showNavModal: value }),

    handleNavModal: (e: React.MouseEvent) => {
        e.stopPropagation();
        set((state) => ({ showNavModal: !state.showNavModal }))
    },

    showLogoutModal: false,
    setShowLogoutModal: (value) => set({ showLogoutModal: value })

}))