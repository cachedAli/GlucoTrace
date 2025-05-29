import { useFetch } from "@/hooks/useFetch";
import { statApi } from "@/libs/axios";
import { supabase } from "@/libs/supabaseClient";
import { Stats } from "@/types/dashboardTypes";


export const getPreviousStat = async (statName: string): Promise<Stats | null> => {
    const token = await supabase.auth.getSession().then(res => res.data.session?.access_token)
    try {
        const response = await useFetch("get", `/${statName}`, undefined, undefined, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, statApi, {
            type: "success"
        }, false)

        return response?.data?.data || null;
    } catch (error) {
        console.error("Error fetching previous stat:", error);
        return null;
    }
};

// Saves or updates a specific health stat in localStorage.
export const saveStat = async (statName: string, newData: Stats) => {
    const token = await supabase.auth.getSession().then(res => res.data.session?.access_token)
    try {
        const response = await useFetch("post", `/${statName}`, { newData }, undefined, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, statApi, {
            type: "success"
        }, false)

        if (!response?.data?.success) {
            return;
        }
        return true;
    } catch (error) {
        console.error("Error saving stat:", error);
        return null;
    }
};

export const archiveStats = async () => {
    const token = await supabase.auth.getSession().then(res => res.data.session?.access_token)
    try {
        const response = await useFetch("post", `/archive`, undefined, undefined, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, statApi, {
            type: "success"
        }, false)

        if (!response?.data?.success) {
            return;
        }
        return true;
    } catch (error) {
        console.error("Archiving error:", error);
        return null;
    }
}