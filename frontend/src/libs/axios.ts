import axios from "axios";


export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_AUTH_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export const userApi = axios.create({
    baseURL: import.meta.env.VITE_API_USER_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

export const statApi = axios.create({
    baseURL: import.meta.env.VITE_API_STATS_URL,
    headers: {
        "Content-Type": "application/json",
    },
})
