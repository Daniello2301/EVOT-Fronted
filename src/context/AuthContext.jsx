import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginService, logoutService, refreshTokenService } from '../services/auth.service';
import { setupInterceptors } from '../helpers/axiosInterceptor';
import { userFromClaims } from '../helpers/authSession.js';

const AuthContext = createContext(null);
const REFRESH_KEY = 'REFRESH_TOKEN';
const PENDING_KEY = 'estadoPendiente';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const tokenRef = useRef(null);
  const refreshInFlight = useRef(null);
  const generationRef = useRef(0);

  const guardarEstadoPendiente = (pending) => sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  const recuperarEstadoPendiente = () => {
    try { return JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null'); }
    catch { sessionStorage.removeItem(PENDING_KEY); return null; }
  };
  const limpiarEstadoPendiente = () => sessionStorage.removeItem(PENDING_KEY);

  const applyToken = (jwt) => {
    const user = userFromClaims(jwtDecode(jwt));
    tokenRef.current = jwt; // Must be synchronous for Axios requests immediately after login.
    setToken(jwt);
    setAuthUser(user);
    setIsLoggedIn(true);
    return user;
  };
  const clearSession = () => {
    localStorage.removeItem(REFRESH_KEY);
    tokenRef.current = null;
    limpiarEstadoPendiente();
    setToken(null);
    setAuthUser(null);
    setIsLoggedIn(false);
  };

  const login = async (correo, contraseña) => {
    const generation = ++generationRef.current;
    const data = await loginService({ correo, contraseña });
    const jwt = data?.usuario?.tokens?.token;
    const refreshCredential = data?.usuario?.tokens?.refreshToken;
    if (!jwt || !refreshCredential) throw new Error('Respuesta de autenticación incompleta');
    if (generation !== generationRef.current) return null;
    // Validate the JWT payload before storing a refresh credential.
    userFromClaims(jwtDecode(jwt));
    localStorage.setItem(REFRESH_KEY, refreshCredential);
    const user = applyToken(jwt);
    return { pending: recuperarEstadoPendiente(), user };
  };

  const logout = async ({ notifyServer = true } = {}) => {
    const generation = ++generationRef.current;
    try { if (notifyServer && tokenRef.current) await logoutService(); }
    catch { /* local logout still works if the server fails */ }
    finally { if (generation === generationRef.current) clearSession(); }
  };

  const refreshAccessToken = () => {
    if (refreshInFlight.current) return refreshInFlight.current;
    const generation = generationRef.current;
    const credential = localStorage.getItem(REFRESH_KEY);
    if (!credential) return Promise.resolve(null);

    const attempt = async () => {
      try {
        const data = await refreshTokenService(credential);
        if (!data?.token) throw new Error('Respuesta de renovación incompleta');
        if (generation !== generationRef.current) return null;
        const user = userFromClaims(jwtDecode(data.token));
        if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
        tokenRef.current = data.token;
        setToken(data.token);
        setAuthUser(user);
        setIsLoggedIn(true);
        return data.token;
      } catch {
        if (generation === generationRef.current) {
          ++generationRef.current;
          clearSession();
        }
        return null;
      }
    };
    const promise = attempt().finally(() => {
      if (refreshInFlight.current === promise) refreshInFlight.current = null;
    });
    refreshInFlight.current = promise;
    return promise;
  };

  useEffect(() => setupInterceptors({
    getAccessToken: () => tokenRef.current,
    refreshToken: refreshAccessToken,
    logout,
  // Interceptor closures access refs and are intentionally installed once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      try { await refreshAccessToken(); }
      finally { if (mounted) setLoading(false); }
    };
    restore();
    return () => { mounted = false; };
  // Restore on provider initialization only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={{
    authUser, token, isLoggedIn, loading, login, logout,
    guardarEstadoPendiente, recuperarEstadoPendiente, limpiarEstadoPendiente,
  }}>{children}</AuthContext.Provider>;
};
