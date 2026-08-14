import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

export const axiosConfig = axios.create({
    baseURL: `${API_BASE_URL}/`,
    headers: {
        "Content-Type": "application/json"
    }

});
