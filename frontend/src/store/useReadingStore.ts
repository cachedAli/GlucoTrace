import { Reading } from "@/types/userTypes.js";
import { create } from "zustand";
import { useDashboardStore } from "./useDashboardStore.js";
import { useFetch } from "@/hooks/useFetch.js";
import { supabase } from "@/libs/supabaseClient.js";
import { userApi } from "@/libs/axios.js";
import { formatReading } from "@/libs/utils/utils.js";

type ReadingState = {
    // States
    readings: Reading[];
    filteredReadings: Reading[];

    setReadings: (readings: Reading[]) => void;
    setFilteredReadings: (filtered: Reading[]) => void;

    // Loading states
    addReadingLoading: boolean;
    setAddReadingLoading: (value: boolean) => void;
    editReadingLoading: boolean;
    setEditReadingLoading: (value: boolean) => void;
    deleteReadingLoading: boolean;
    setDeleteReadingLoading: (value: boolean) => void;
    fetchReadingLoading: boolean;
    setFetchReadingLoading: (value: boolean) => void;

    // Actions
    fetchReadings: () => Promise<void>;
    addReading: (userData: Reading) => Promise<boolean>;
    deleteReading: (id: string) => Promise<boolean>;
    updateReadings: (userData: Reading) => Promise<boolean>;

    resetFilteredReadings: () => void;
}

export const useReadingStore = create<ReadingState>((set, get) => ({

    // States
    readings: [],
    filteredReadings: [],

    setReadings: (readings) => set({ readings, filteredReadings: readings }),
    setFilteredReadings: (filtered) => set({ filteredReadings: filtered }),

    // Loading states
    addReadingLoading: false,
    setAddReadingLoading: (value) => set({ addReadingLoading: value }),

    editReadingLoading: false,
    setEditReadingLoading: (value) => set({ editReadingLoading: value }),

    deleteReadingLoading: false,
    setDeleteReadingLoading: (value) => set({ deleteReadingLoading: value }),

    fetchReadingLoading: false,
    setFetchReadingLoading: (value) => set({ fetchReadingLoading: value }),

    // Actions
    fetchReadings: async () => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from("readings")
            .select("*")
            .eq("user_id", user?.id)
            .order("timestamp", { ascending: false, });

        if (!error && data) {
            useReadingStore.getState().setFetchReadingLoading(false)
            const formatted = data?.map(formatReading)
            set({ readings: formatted, filteredReadings: formatted });
        } else {
            console.error("Error fetching readings:", error);
        }
    },

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

    deleteReading: async (id: string) => {
        const token = await supabase.auth.getSession().then(res => res?.data?.session?.access_token)

        const response = await useFetch("delete", "/delete-reading", { id }, useReadingStore.getState().setDeleteReadingLoading, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, userApi)

        if (!response?.data?.success) {
            return false;
        }

        const currentReadings = useReadingStore.getState().readings;
        const filteredReadings = useReadingStore.getState().filteredReadings;

        const updatedReadings = currentReadings.filter((r) => r.id !== id);
        const updatedFilteredReadings = filteredReadings.filter((r) => r.id !== id);


        useReadingStore.setState({
            readings: updatedReadings,
            filteredReadings: updatedFilteredReadings,
        });

        return true;
    },

    updateReadings: async (userData) => {
        const { id, mealTiming, timestamp, value, note } = userData
        const token = await supabase.auth.getSession().then(res => res?.data?.session?.access_token)

        const response = await useFetch("put", "/edit-reading", { id, mealTiming, timestamp, value, note }, useReadingStore.getState().setEditReadingLoading, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, userApi, {
            type: "promise",
            loadingMessage: "Updating your reading..."
        })

        if (!response?.data?.success) {
            return false;
        }

        const newReading = formatReading(response?.data?.data[0]);
        const currentReadings = useReadingStore.getState().readings;
        const filteredReadings = useReadingStore.getState().filteredReadings;


        const updatedReadings = currentReadings.map((r) =>
            r.id === newReading.id ? newReading : r
        );

        const updatedFilteredReadings = filteredReadings.map((r) => r.id === newReading.id ? newReading : r)

        set({
            readings: updatedReadings,
            filteredReadings: updatedFilteredReadings,
        });

        return true;
    },


    addReading: async (userData) => {
        const { mealTiming, timestamp, value, note } = userData
        const token = await supabase.auth.getSession().then(res => res?.data?.session?.access_token)

        const response = await useFetch("post", "/add-reading", { mealTiming, timestamp, value, note }, useReadingStore.getState().setAddReadingLoading, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, userApi)

        if (!response?.data?.success) {
            return false;
        }
        const newReading = formatReading(response?.data?.data[0]);
        const currentReadings = useReadingStore.getState().readings;

        // ✅ append it cleanly
        useReadingStore.getState().setReadings([newReading, ...currentReadings]);

        return response?.data

    }
}))