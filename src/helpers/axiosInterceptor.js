import { axiosConfig } from "./axios.config";

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

export const setupInterceptors = ({
    getAccessToken,
    refreshToken,
    logout
}) => {

    axiosConfig.interceptors.request.use((config) => {

        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    axiosConfig.interceptors.response.use(
        (response) => response,

        async (error) => {

            const originalRequest = error.config;

            if (error.response?.status !== 401) {
                return Promise.reject(error);
            }

            if (originalRequest._retry) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {

                return new Promise((resolve) => {

                    subscribeTokenRefresh((token) => {

                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(axiosConfig(originalRequest));

                    });

                });
            }

            isRefreshing = true;

            try {

                const newToken = await refreshToken();

                isRefreshing = false;

                onRefreshed(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return axiosConfig(originalRequest);

            } catch (err) {

                isRefreshing = false;
                logout();

                return Promise.reject(err);
            }
        }
    );
};