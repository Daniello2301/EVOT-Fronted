import { axiosConfig } from "./axios.config";

let isRefreshing = false;
let refreshSubscribers = [];

const PUBLIC_ROUTES = [
    'auth/login',
    'auth/refresh',
    'users/student',
    'diplomas/verify',
    'diplomas/by/graduate',
    'solicitar-documento',
    'institutions/actives'
];

// Función para agregar suscriptores que serán notificados cuando el token se refresque
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// Función para notificar a los suscriptores que el token ha sido refrescado
const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

// Función para configurar los interceptores de Axios
export const setupInterceptors = ({
    getAccessToken,
    refreshToken,
    logout
}) => {

    // Interceptor para agregar el token de acceso a cada solicitud
    axiosConfig.interceptors.request.use((config) => {

        const isPublic = PUBLIC_ROUTES.some(route =>
            config.url?.includes(route)
        );

        if (isPublic) {
            return config;
        }

        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    // Interceptor para manejar respuestas y refrescar el token si es necesario
    axiosConfig.interceptors.response.use(
        (response) => response,

        async (error) => {

            //console.log("ERROR INTERCEPTOR:", error);

            const originalRequest = error.config;

            if (!originalRequest || !error.response) {
                return Promise.reject(error);
            }

            // Evitar bucles infinitos de refresh para rutas públicas o de autenticación
            const isPublic = PUBLIC_ROUTES.some(route =>
                originalRequest.url?.includes(route)
            );

            const isAuthRoute =
                originalRequest.url.includes('auth/refresh') ||
                originalRequest.url.includes('auth/logout');

            if (
                isAuthRoute || isPublic) {
                return Promise.reject(error);
            }

            if (error.response?.status === 403) {
                return Promise.reject(error);
            }

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


                if (!newToken) {
                    isRefreshing = false;
                    refreshSubscribers = [];
                    logout();
                    return Promise.reject(new Error('No se pudo renovar el token'));
                }

                isRefreshing = false;
                onRefreshed(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosConfig(originalRequest);

            } catch (err) {
                isRefreshing = false;
                refreshSubscribers = [];
                logout();
                return Promise.reject(err);
            }
        }
    );
};