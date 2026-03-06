import { createContext, useContext, useEffect, useState } from "react";
import { loginService, logoutService, refreshTokenService } from "../services/auth.service";

const AuthContext = createContext();

// Custom hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Proveedor de autenticación que envuelve la aplicación
export const AuthProvider = ({ children }) => {

    // Estado para almacenar el usuario autenticado y el estado de inicio de sesión
    const [authUser, setAuthUser] = useState(null);
    // Estado para indicar si el usuario está autenticado o no
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Estado para indicar si se está cargando la autenticación (útil para mostrar un spinner mientras se verifica el token)
    const [loading, setLoading] = useState(true);

    // ============================================================
    // Login
    // ============================================================
    const login = async (correo, contraseña) => {

        // Llamamos al servicio de login para obtener el token y la información del usuario
        const data = await loginService({ correo, contraseña });

        // Extraemos el token, refreshToken y la información del usuario del response
        const { token, refreshToken, ...usuario } = data.usuario.tokens
            ? { // Si el backend devuelve los tokens dentro de un objeto "tokens", los extraemos de ahí
                token: data.usuario.tokens.token,
                refreshToken: data.usuario.tokens.refreshToken,
                ...data.usuario
            }// Si el backend devuelve los tokens directamente en el objeto usuario, los extraemos de ahí
            : data;

        // Guardamos el token y el refreshToken en localStorage para mantener la sesión activa           
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('REFRESH_TOKEN', refreshToken);

        // Actualizamos el estado del usuario autenticado y el estado de inicio de sesión
        setAuthUser({ ...usuario, accessToken: token });
        setIsLoggedIn(true);
    };

    // ============================================================
    // Logout
    // ============================================================
    // En logout() dentro de AuthContext.jsx — simplificar:
    const logout = async () => {
        try {
            await logoutService(); // ✅ el interceptor inyecta el token
        } catch (error) {
            // si falla el backend igual limpiamos localmente
        } finally {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
            setAuthUser(null);
            setIsLoggedIn(false);
        }
    };
    // ============================================================
    // Refresh access token
    // ============================================================
    const refreshAccessToken = async () => {
        try {
            // Obtenemos el refresh token del localStorage
            const refreshToken = localStorage.getItem('REFRESH_TOKEN');
            if (!refreshToken) return null; // Si no hay refresh token, no podemos refrescar el access token

            // Llamamos al servicio de refresh token para obtener un nuevo access token
            const data = await refreshTokenService(refreshToken);

            // Si obtenemos un nuevo token, lo guardamos en localStorage y actualizamos el estado del usuario autenticado
            const newToken = data.token;
            localStorage.setItem('ACCESS_TOKEN', newToken);
            setAuthUser(prev => ({ ...prev, accessToken: newToken }));
            setIsLoggedIn(true);

            return newToken;

        } catch (error) {
            await logout();
            return null;
        }
    };

    // ============================================================
    // Inicializar sesión al montar la app
    // ============================================================
    useEffect(() => {
        // Función para verificar si hay un refresh token válido al cargar la aplicación y refrescar el access token
        const initializeAuth = async () => {
            try {
                // Verificamos si hay un refresh token en localStorage
                const refreshToken = localStorage.getItem('REFRESH_TOKEN');
                if (!refreshToken) return;

                // Si hay un refresh token, intentamos refrescar el access token para mantener la sesión activa
                await refreshAccessToken();

            } catch (error) {
                // Si ocurre un error al refrescar el token (por ejemplo, el refresh token es inválido o ha expirado), cerramos la sesión
                await logout();
            } finally {
                setLoading(false);
            }
        };

        // Llamamos a la función de inicialización de autenticación al montar el componente
        initializeAuth();
    }, []);

    return (
        // Proveemos el contexto de autenticación a toda la aplicación con los valores y funciones necesarias para manejar la autenticación
        <AuthContext.Provider value={{
            authUser,
            setAuthUser,
            isLoggedIn,
            setIsLoggedIn,
            login,
            logout,
            refreshAccessToken,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};