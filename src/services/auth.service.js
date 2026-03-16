import { axiosConfig } from '../helpers/axios.config';

// Auth services

// login
export const loginService = async (data) => {
    const res = await axiosConfig.post('auth/login', data);
    return res.data;
};

// logout
export const logoutService = async () => {
    const res = await axiosConfig.post('auth/logout');
    return res.data;
};

// refresgh token
export const refreshTokenService = async (refreshToken) => {
    const res = await axiosConfig.post("/auth/refresh", {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    });
    return res.data;
};

// reset password
export const resetPasswordService = async (data) => {
    const res = await axiosConfig.put('auth/reset-password', data);
    return res.data;
};