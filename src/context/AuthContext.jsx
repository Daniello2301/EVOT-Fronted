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

    const tokenRef = useRef(null);

    // ============================================================
    // Login
    // ============================================================
    const login = async (correo, contraseña) => {

        const data = await loginService({ correo, contraseña });

        console.log("Respuesta del login:", data); // ✅ Log para verificar la respuesta del backend
        // Extraemos el token, refresh token y la información del usuario del response del backend
        const token = data.usuario.tokens.token;
        // El refresh token también viene en la respuesta del backend, lo extraemos para guardarlo en localStorage
        const refreshToken = data.usuario.tokens.refreshToken;

        //decode token para obtener la información del usuario
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); // ✅ Log para verificar el contenido del token decodificado
        // Creamos un objeto con la información del usuario que queremos guardar en el estado y localStorage
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
    };

    // ============================================================
    // Logout
    // ============================================================
    // En logout() dentro de AuthContext.jsx — simplificar:
    const logout = async () => {
        try {
            if (callBackend && tokenRef.current) {
                await logoutService();
            } 
        } catch (error) {
            // si falla el backend igual limpiamos localmente
        } finally {
            localStorage.removeItem("REFRESH_TOKEN");
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

            // ✅ Timeout de 10s para no quedarse colgado indefinidamente
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
            await logout(false); // ✅ Se mantiene — logout tiene su propio finally que garantiza la limpieza
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
    }, []);


    // ============================================================
    // Recuperar sesión al cargar la aplicación
    // ============================================================
    useEffect(() => {

        const initializeAuth = async () => {

            const refreshToken = localStorage.getItem("REFRESH_TOKEN");
            if (refreshToken) {
                const newToken = await refreshAccessToken();
            }
            setLoading(false); // Indicamos que ya no estamos cargando la autenticación, independientemente de si se pudo recuperar la sesión o no

        };

        initializeAuth();
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
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
