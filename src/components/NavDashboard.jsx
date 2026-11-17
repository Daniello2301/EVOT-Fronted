import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { currentSection } from '../helpers/dashboardNav.js';
import { rolLabel } from '../helpers/estados.js';
import ChangePasswordModal from './Dashboard/ChangePasswordModal';

const initials = (name = '') => name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'EV';

/** Encabezado del panel: abrir/colapsar menú, sección actual y menú de usuario. */
export default function NavDashboard() {
  const { isMobileOpen, isExpanded, isDesktop, toggleSidebar } = useSidebar();
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const section = currentSection(location.pathname);
  const nombre = authUser?.nombreUsuario || authUser?.correo || 'Usuario';

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointer = (event) => { if (!menuRef.current?.contains(event.target)) setMenuOpen(false); };
    const onKey = (event) => {
      if (event.key === 'Escape') { setMenuOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  const toggleLabel = isDesktop
    ? (isExpanded ? 'Colapsar menú lateral' : 'Expandir menú lateral')
    : (isMobileOpen ? 'Cerrar menú' : 'Abrir menú');

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={toggleLabel}
          aria-controls="dashboard-sidebar"
          aria-expanded={isDesktop ? isExpanded : isMobileOpen}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          {isMobileOpen ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.22 7.28a.75.75 0 0 1 1.06-1.06L12 10.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L13.06 12l4.72 4.72a.75.75 0 1 1-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L10.94 12 6.22 7.28Z" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 16 12" fill="currentColor" className="h-4 w-5">
              <path fillRule="evenodd" clipRule="evenodd" d="M.58 1A.75.75 0 0 1 1.33.25h13.34a.75.75 0 0 1 0 1.5H1.33A.75.75 0 0 1 .58 1Zm0 10a.75.75 0 0 1 .75-.75h13.34a.75.75 0 0 1 0 1.5H1.33a.75.75 0 0 1-.75-.75Zm.75-5.75a.75.75 0 0 0 0 1.5H8a.75.75 0 0 0 0-1.5H1.33Z" />
            </svg>
          )}
        </button>

        <p className="min-w-0 flex-1 truncate font-display text-base font-semibold text-black_primary sm:text-lg">
          {section?.name ?? 'Panel'}
        </p>

        <div className="relative" ref={menuRef}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="dashboard-user-menu"
            className="flex min-h-[44px] items-center gap-2 rounded-lg px-1.5 py-1 text-left hover:bg-gray-100 sm:px-2"
          >
            <span aria-hidden="true" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue_primary text-sm font-bold text-white">
              {initials(nombre)}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-[12rem] truncate text-sm font-semibold text-gray-900">{nombre}</span>
              <span className="block text-xs text-gray-500">{rolLabel(authUser?.rol)}</span>
            </span>
            <span className="sr-only sm:hidden">Menú de {nombre}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}>
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
            </svg>
          </button>

          {menuOpen && (
            <div id="dashboard-user-menu" role="menu" aria-label="Opciones de usuario" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-evot-card">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-900">{nombre}</p>
                {authUser?.correo && <p className="truncate text-xs text-gray-500">{authUser.correo}</p>}
                <p className="mt-1 text-xs font-medium text-blue_primary">{rolLabel(authUser?.rol)}</p>
              </div>
              <button type="button" role="menuitem" className="flex min-h-[44px] w-full items-center px-4 text-left text-sm text-gray-700 hover:bg-gray-50" onClick={() => { setMenuOpen(false); setPasswordOpen(true); }}>
                Cambiar contraseña
              </button>
              <button type="button" role="menuitem" className="flex min-h-[44px] w-full items-center px-4 text-left text-sm text-gray-700 hover:bg-gray-50" onClick={() => navigate('/home')}>
                Ir al sitio público
              </button>
              <div className="border-t border-gray-100">
                <button type="button" role="menuitem" disabled={loggingOut} className="flex min-h-[44px] w-full items-center px-4 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" onClick={handleLogout}>
                  {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ChangePasswordModal show={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </header>
  );
}
