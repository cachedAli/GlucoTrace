import api from "@/libs/axios"
import { AxiosError } from "axios";
import { toast } from "sonner";


export const useFetch = async (method: "get" | "post" | "put" | "delete",
    url: string,
    data?: any,
    setLoading?: (value: boolean) => void,
    config?: any) => {

    setLoading?.(true)

    try {
        const response = await api({
            method,
            url,
            data,
            ...config,
        });

        return response
    } catch (error) {
        console.log(error)
        if (error instanceof AxiosError) {
            const message = error.response?.data?.message
                || error.message
                || "Request failed";
            toast.error(message);
            return error.response;
        }

        toast.error("Something went wrong");
        return null;

    } finally {
        setLoading?.(false)
    }

}