import { axiosConfig } from "../helpers/axios.config";

// AuthService.js
export const loginService = async (data) => {
    const response = await axiosConfig.post('auth/login', data);
    return response.data;
};

// Logout service to invalidate the token on the server
export const logoutService = async (token) => {
    const response = await axiosConfig.post('auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Refresh token service to get a new access token using the refresh token
export const refreshTokenService = async (refreshToken) => {
    // Send the refresh token in the Authorization header
    const response = await axiosConfig.post('auth/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
    });
    return response.data;
};

// Reset password service to update the user's password
export const resetPasswordService = async (data, token) => {
    // Send the new password data along with the access token in the Authorization header
    const response = await axiosConfig.put('auth/reset-password', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};