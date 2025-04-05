import { Reading } from "@/types/userTypes";
import { create } from "zustand";

type ReadingState = {
    readings: Reading[];
    setReadings: (newReading: Reading) => void;
    logReadings: () => void;
}
export const useReadingStore = create<ReadingState>((set) => ({
    readings: JSON.parse(localStorage.getItem("readings") || "[]"),

    setReadings: (newReading) => set((state) => {
        const updatedReadings = [...state.readings, newReading];
        localStorage.setItem("readings", JSON.stringify(updatedReadings));
        return { readings: updatedReadings }
    }),

    logReadings: () => {
        const savedReadings = JSON.parse(localStorage.getItem("readings") || "[]");
        set({ readings: savedReadings })
    }
}))