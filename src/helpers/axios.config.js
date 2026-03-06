import axios from "axios";

export const axiosConfig = axios.create({
    baseURL: `http://localhost:4000/api/`
});

// Inyecta el token automáticamente en cada request
axiosConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});