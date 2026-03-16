import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Ruta privada — redirige a /login si no está autenticado
export const PrivateRoute = () => {
    const { authUser, isLoggedIn, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen text-blue_primary">Cargando...</div>;
    return authUser ? <Outlet /> : <Navigate to="/login" replace />;
};

// Ruta por rol — redirige a /home si no tiene el rol requerido
export const RoleRoute = ({ roles }) => {
    const { authUser, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen text-blue_primary">Cargando...</div>;
    return roles.includes(authUser?.rol) ? <Outlet /> : <Navigate to="/home" replace />;
};

// Ruta pública — redirige al dashboard si ya está autenticado
export const PublicOnlyRoute = () => {
    const { authUser, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen text-blue_primary">Cargando...</div>;
    return !authUser ? <Outlet /> : <Navigate to="/admin-dashboard" replace />;
};