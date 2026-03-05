import { axiosConfig } from "./axios.config";

// Helper para hacer fetch con autenticación y manejo de token expirado
export const fetchConAuth = async (url, options = {}, authUser, refreshAccessToken, logout) => {
    try {

      // Hacemos la petición con el token de acceso actual
        const response = await axiosConfig({
            url, // ...options para permitir pasar método, body, etc.
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${authUser?.accessToken}`
            }
        });

        return response.data;

    } catch (error) {

        // Token expirado — intentar refresh
        if (error.response?.status === 401) {
          // Intentamos refrescar el token
            const newToken = await refreshAccessToken();

            // Si no se pudo refrescar el token, cerramos sesión
            if (!newToken) {
                logout();
                throw error;
            }

            // Reintentar con nuevo token
            const retryResponse = await axiosConfig({
                url,
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${newToken}`
                }
            });
            // Si el reintento es exitoso, devolvemos la respuesta
            return retryResponse.data;
        }
        // Otros errores (no relacionados con autenticación) simplemente los lanzamos para que sean manejados por el componente que hizo la petición
        throw error;
    }
};