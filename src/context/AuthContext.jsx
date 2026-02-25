import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isloggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Logout
    const logout = () => {
        localStorage.clear();
        setAuthUser(null);
        setIsLoggedIn(false);
    }


    // Refresh access token
    const refreshAccessToken = async () => {

        try {

            const refreshToken = localStorage.getItem('REFRESH_TOKENS');
            if (!refreshToken) return null;

            const response = await fetch('http://localhost:4000/api/auth/refresh/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            if (!response.ok) {
                logout();
                return null;
            }

            const data = await response.json();

            setAuthUser({ ...data.usuario, accessToken: data?.token });

            return data?.token

        } catch (error) {

            logout();
            return null;
        }

    }
    // Reset session

    useEffect(() => {

        const initializeAuth = async () => {
            const refreshToken = localStorage.getItem("REFRESH_TOKEN");


            if (!refreshToken) {
                setLoading(false)
                return;
            }

            const newToken = await refreshAccessToken();

            if (newToken) {
                setLoading(true)
            }

            setLoading(false)

        };

        initializeAuth();

    }, [])

    return (
        <AuthContext.Provider
            value={{
                authUser,
                setAuthUser,
                isloggedIn,
                setIsLoggedIn,
                logout,
                refreshAccessToken,
                loading
            }} >
            {children}
        </AuthContext.Provider>
    );
};