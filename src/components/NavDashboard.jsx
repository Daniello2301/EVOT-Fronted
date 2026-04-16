import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.webp';
import { useAuth } from '../context/AuthContext';

export default function NavDashboard() {
  const { authUser, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const syncSidebarState = (event) => {
      setIsSidebarOpen(Boolean(event.detail?.isOpen));
    };

    window.addEventListener('dashboard-sidebar-state', syncSidebarState);
    return () => window.removeEventListener('dashboard-sidebar-state', syncSidebarState);
  }, []);

  const toggleSidebar = () => {
    const nextState = !isSidebarOpen;
    setIsSidebarOpen(nextState);
    window.dispatchEvent(
      new CustomEvent('dashboard-sidebar-toggle', {
        detail: { isOpen: nextState },
      })
    );
  };

  const handleLogout = async () => {
    await logout(); // llama al backend y limpia localStorage
  };

  return (
    <nav className="bg-blue_primary border-b border-blue_primary/80 px-4 py-2.5 fixed left-0 right-0 top-0 z-50 shadow-evot-card">
      <div className="flex justify-between items-center gap-3">

        {/* Logo */}
        <div className="flex justify-start items-center min-w-0">
          <button
            onClick={toggleSidebar}
            aria-controls="drawer-navigation"
            aria-expanded={isSidebarOpen}
            aria-label={isSidebarOpen ? 'Cerrar menu lateral' : 'Abrir menu lateral'}
            className="p-2 mr-2 text-white_primary rounded-lg cursor-pointer md:hidden hover:text-blue_primary hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-2 focus-visible:ring-gray-100 focus-visible:text-blue_primary"
          >
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>

          <Link to="/admin-dashboard" className="flex items-center justify-between mr-4 min-w-0">
            <img src={logo} className="mr-3 h-8" alt="Evot Logo" />
            <span className="text-white_primary self-center text-xl md:text-2xl font-semibold whitespace-nowrap truncate">
              Evot Project
            </span>
          </Link>
          <nav className='mx-3 hidden sm:block'>
            <Link to="/home" className="text-white_primary hover:underline">
              Principal
            </Link>
          </nav>
        </div>

        {/* Usuario y acciones */}
        <div className="flex gap-2 sm:gap-3 items-center lg:order-2">

          {/* Info del usuario */}
          <div className="hidden lg:flex flex-col items-end max-w-44">
            <span className="block text-sm font-semibold text-white_primary">
              {authUser?.nombreUsuario ?? 'Usuario'}
            </span>
            <span className="block text-xs text-blue-100 truncate max-w-44">
              {authUser?.correo ?? ''}
            </span>
          </div>

          {/* Badge de rol */}
          <span className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-0.5 rounded-full ${
            authUser?.rol === 'ADMIN'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {authUser?.rol ?? ''}
          </span>

          {/* Logout */} 
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-2.5 block text-sm text-white_primary hover:bg-gray-100 hover:text-blue_primary hover:rounded-md transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" />
              <path d="M15 12h-12l3 -3" />
              <path d="M6 15l-3 -3" />
            </svg>
          </button>

          {/* Perfil */}
          <Link
            to="/user/profile"
            title="Mi perfil"
            className="flex mx-0.5 text-sm rounded-full text-white_primary hover:scale-105 transition-transform"
          >
            <svg className="icon icon-tabler icon-tabler-user-circle" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
              <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
            </svg>
          </Link>

        </div>
      </div>
    </nav>
  );
}