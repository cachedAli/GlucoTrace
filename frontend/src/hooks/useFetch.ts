import { authApi } from "@/libs/axios.js";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

type ToastOptions = {
  type?: "success" | "promise";
  loadingMessage?: string;
};

export const useFetch = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  setLoading?: (value: boolean) => void,
  config?: any,
  customApi = authApi,
  toastOptions?: ToastOptions,
  showToast: boolean = true
): Promise<AxiosResponse | null> => {
  setLoading?.(true);

  const toastType = toastOptions?.type ?? "success";

  try {
    let response: AxiosResponse;

    if (toastType === "promise") {
      // First, assign the promise directly to a variable
      const promise = customApi({ method, url, data, ...config });

      // Await toast.promise, but don't try to return anything custom here
      await toast.promise(promise, {
        loading: toastOptions?.loadingMessage || "Loading...",
        success: (res) => res?.data?.message || "Success",
        error: (err) => {
          if (err instanceof AxiosError) {
            return (
              err.response?.data?.message ||
              err.message ||
              "Request failed"
            );
          }
          return "Something went wrong";
        },
      });

      // Now await the real response separately
      response = await promise;
    } else {
      response = await customApi({ method, url, data, ...config });

      showToast && toast.success(response?.data?.message || "Success");

    }

    return response;
  } catch (error) {
    console.error(error);

    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      showToast && toast.error(message);
      return error.response as AxiosResponse;
    }

    toast.error("Something went wrong");
    return null;
  } finally {
    setLoading?.(false);
  }
};
