import { createContext, useContext, useEffect, useState } from "react";
import {
    loginService,
    logoutService,
    refreshTokenService,
} from "../services/auth.service";

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
        const data = await loginService({ correo, contraseña });

        console.log("Respuesta del login:", data); // ✅ Log para verificar la respuesta del backend
        // Extraemos el token, refresh token y la información del usuario del response del backend
        const token = data.usuario.tokens.token;
        // El refresh token también viene en la respuesta del backend, lo extraemos para guardarlo en localStorage
        const refreshToken = data.usuario.tokens.refreshToken;
        // Creamos un objeto con la información del usuario que queremos guardar en el estado y localStorage
        const usuario = {
            _id: data.usuario._id,
            nombreUsuario: data.usuario.nombreUsuario,
            correo: data.usuario.correo,
            rol: data.usuario.rol,
            institucion: data.usuario.institucion,
        };

        localStorage.setItem("ACCESS_TOKEN", token);
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
        localStorage.setItem("USER", JSON.stringify(usuario)); // ✅ guardar usuario

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
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("REFRESH_TOKEN");
            setAuthUser(null);
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

            const data = await refreshTokenService(refreshToken);
            const newToken = data.token;

            // ✅ Reconstruir authUser desde localStorage
            const usuario = JSON.parse(localStorage.getItem("USER"));

            localStorage.setItem("ACCESS_TOKEN", newToken);
            setAuthUser({ ...usuario, accessToken: newToken });
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
        try {
            const storedUser = localStorage.getItem("USER");
            const accessToken = localStorage.getItem("ACCESS_TOKEN");

            if (storedUser && accessToken) {
                const usuario = JSON.parse(storedUser);
                setAuthUser({ ...usuario, accessToken });
                setIsLoggedIn(true);
            }
        } catch (error) {
            localStorage.removeItem("USER"); // ← limpia datos corruptos
            localStorage.removeItem("ACCESS_TOKEN");
            setAuthUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false); // ← SIEMPRE se ejecuta
        }
    }, []);

    return (
        // Proveemos el contexto de autenticación a toda la aplicación con los valores y funciones necesarias para manejar la autenticación
        <AuthContext.Provider
            value={{
                authUser,
                setAuthUser,
                isLoggedIn,
                setIsLoggedIn,
                login,
                logout,
                refreshAccessToken,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
