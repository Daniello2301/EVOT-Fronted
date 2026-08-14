import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
    loginService,
    logoutService,
    refreshTokenService,
} from "../services/auth.service";

import { jwtDecode } from "jwt-decode";
import { setupInterceptors } from "../helpers/axiosInterceptor";

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

    const [token, setToken] = useState(null);

    const [, setEstadoPendiente] = useState(null);

    const tokenRef = useRef(null);

    
    const guardarEstadoPendiente = (estado) => {
        setEstadoPendiente(estado);
        sessionStorage.setItem('estadoPendiente', JSON.stringify(estado));
    };

    
    const recuperarEstadoPendiente = () => {
        const estadoGuardado = sessionStorage.getItem('estadoPendiente');
        return estadoGuardado ? JSON.parse(estadoGuardado) : null;
    };

    
    const limpiarEstadoPendiente = () => {
        setEstadoPendiente(null);
        sessionStorage.removeItem('estadoPendiente');
    };

    // ============================================================
    // Login
    // ============================================================
    const login = async (correo, contraseña) => {

        const data = await loginService({ correo, contraseña });

        const token = data.usuario.tokens.token;
        // El refresh token también viene en la respuesta del backend, lo extraemos para guardarlo en localStorage
        const refreshToken = data.usuario.tokens.refreshToken;

        //decode token para obtener la información del usuario
        const decodedToken = jwtDecode(token);

        const usuario = {
            _id: decodedToken._id,
            nombreUsuario: decodedToken.nombreUsuario,
            correo: decodedToken.correo,
            rol: decodedToken.rol,
            institucion: decodedToken.institucion,
        };

        localStorage.setItem("REFRESH_TOKEN", refreshToken);

        setAuthUser(usuario);
        setToken(token);
        setIsLoggedIn(true);

        return recuperarEstadoPendiente(); // Devolvemos el estado pendiente para que el componente que llamó a login pueda redirigir al usuario a la página que intentaba acceder originalmente
    };

    // ============================================================
    // Logout
    // ============================================================
    const logout = async ({ notifyServer = true } = {}) => {
        try {
            if (notifyServer && tokenRef.current) {
                await logoutService();
            }
        } catch (error) {
            // si falla el backend igual limpiamos localmente
        } finally {
            localStorage.removeItem("REFRESH_TOKEN");
            tokenRef.current = null;
            limpiarEstadoPendiente();
            setAuthUser(null);
            setToken(null);
            setIsLoggedIn(false);
        }
    };
    // ============================================================
    // Refresh access token
    // ============================================================
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (!refreshToken) return null;

            // Timeout de 10s para no quedarse colgado indefinidamente
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout al refrescar token")), 10000)
            );

            const data = await Promise.race([
                refreshTokenService(refreshToken),
                timeoutPromise
            ]);

            const newToken = data.token;

            const decodedToken = jwtDecode(newToken);

            const usuario = {
                _id: decodedToken._id,
                nombreUsuario: decodedToken.nombreUsuario,
                correo: decodedToken.correo,
                rol: decodedToken.rol,
                institucion: decodedToken.institucion,
            }

            setAuthUser(usuario);
            setToken(newToken);
            setIsLoggedIn(true);
            return newToken;

        } catch (error) {
            await logout({ notifyServer: false });
            return null;
        }
    };


    useEffect(() => {
        tokenRef.current = token;
    }, [token]);

    // ============================================================
    // Axios Interceptors
    // ============================================================

    useEffect(() => {
        setupInterceptors({
            getAccessToken: () => tokenRef.current,
            refreshToken: refreshAccessToken,
            logout
        });
    // Interceptors are registered once and read the current token from tokenRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ============================================================
    // Recuperar sesión al cargar la aplicación
    // ============================================================
    useEffect(() => {

        const initializeAuth = async () => {

            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (refreshToken) {
                await refreshAccessToken();
            }
            setLoading(false); // Indicamos que ya no estamos cargando la autenticación, independientemente de si se pudo recuperar la sesión o no

        };

        initializeAuth();
    // Session restoration runs only during provider initialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // Proveemos el contexto de autenticación a toda la aplicación con los valores y funciones necesarias para manejar la autenticación
        <AuthContext.Provider
            value={{
                authUser,
                token,
                isLoggedIn,
                login,
                logout,
                loading,
                guardarEstadoPendiente,
                recuperarEstadoPendiente,
                limpiarEstadoPendiente,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
