import { Reading } from "@/types/userTypes";
import { create } from "zustand";
import { useDashboardStore } from "./useDashboardStore";

type ReadingState = {
    readings: Reading[];
    filteredReadings: Reading[];
    setReadings: (newReading: Reading) => void;
    setFilteredReadings: (filtered: Reading[]) => void;
    resetFilteredReadings: () => void;
    logReadings: () => void;
    deleteReading: (id: string) => void
    updateReadings: (id: string, updatedReading: Reading) => void
}
export const useReadingStore = create<ReadingState>((set) => ({
    readings: JSON.parse(localStorage.getItem("readings") || "[]"),
    filteredReadings: JSON.parse(localStorage.getItem("readings") || "[]"),

    setReadings: (newReading) => set((state) => {
        const readingWithTimestamp = {
            ...newReading,
            createdAt: new Date()
        };
        const updatedReadings = [readingWithTimestamp, ...state.readings];
        localStorage.setItem("readings", JSON.stringify(updatedReadings));
        return { readings: updatedReadings, filteredReadings: updatedReadings }
    }),

    setFilteredReadings: (filtered) => set({ filteredReadings: filtered }),

    resetFilteredReadings: () => {
        useDashboardStore.getState().setSelectedFilterOption(undefined);
        useDashboardStore.getState().setSelectedSortOption(undefined);

        set((state) => {
            return { filteredReadings: [...state.readings] }
        })
    },

    logReadings: () => {
        const savedReadings = JSON.parse(localStorage.getItem("readings") || "[]");
        set({ readings: savedReadings })
    },

    deleteReading: (id: string) =>
        set((state) => {
            const updatedReadings = state.readings.filter((reading) => reading.id !== id);
            localStorage.setItem("readings", JSON.stringify(updatedReadings));
            return {
                readings: updatedReadings,
                filteredReadings: updatedReadings,
            };
        }),

    updateReadings: (id: string, updatedReading: Reading) =>
        set((state) => {
            const updatedReadings = state.readings.map(reading => reading.id === id ? { ...reading, ...updatedReading } : reading)

            state.setFilteredReadings(updatedReadings)

            localStorage.setItem("readings", JSON.stringify(updatedReadings))

            return { readings: updatedReadings };
        })
}))