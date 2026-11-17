import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { dashboardPath, isActivePath, needsInstitucionOnboarding, sectionsForRole } from "../../helpers/dashboardNav.js";
import {
  GridIcon,
  UserCircleIcon,
  Institutions,
  Study,
  TaskIcon,
  DocsIcon,
  PencilIcon
} from "../../icons";

const ICONS = {
  inicio: GridIcon,
  diplomas: Study,
  graduados: TaskIcon,
  "solicitudes-documento": DocsIcon,
  "solicitudes-edicion": PencilIcon,
  instituciones: Institutions,
  usuarios: UserCircleIcon,
  "mi-institucion": Institutions
};

export default function AsideDashboard() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, closeMobileSidebar } = useSidebar();
  const { authUser } = useAuth();
  const location = useLocation();
  // Mientras la institución no esté registrada, el resto de secciones solo redirige al alta.
  const sections = needsInstitucionOnboarding(authUser)
    ? sectionsForRole(authUser?.rol).filter((section) => section.key === "mi-institucion")
    : sectionsForRole(authUser?.rol);
  const showLabels = isExpanded || isHovered || isMobileOpen;

  // Al navegar en móvil, cerrar el panel.
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, closeMobileSidebar]);

  return (
    <aside
      id="dashboard-sidebar"
      aria-label="Navegación del panel"
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white text-gray-900 transition-[width,transform] duration-300 ease-in-out
        ${showLabels ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex h-16 shrink-0 items-center border-b border-gray-100 px-5 ${showLabels ? "justify-start" : "justify-center"}`}>
        <Link to={dashboardPath()} className="flex items-center gap-2 rounded-lg font-display text-xl font-bold text-blue_primary">
          <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue_primary text-sm text-white">EV</span>
          {showLabels && <span>EVOT</span>}
          <span className="sr-only">Ir al inicio del panel</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1 font-medium">
          {sections.map((section) => {
            const Icon = ICONS[section.key] ?? GridIcon;
            const active = isActivePath(location.pathname, section.path);
            return (
              <li key={section.key}>
                <Link
                  to={dashboardPath(section.path)}
                  aria-current={active ? "page" : undefined}
                  title={showLabels ? undefined : section.name}
                  className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                    ${showLabels ? "" : "justify-center"}
                    ${active ? "bg-blue-50 font-semibold text-blue_primary" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  {showLabels ? <span>{section.name}</span> : <span className="sr-only">{section.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-gray-100 p-3">
        <Link
          to="/home"
          className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${showLabels ? "" : "justify-center"}`}
          title={showLabels ? undefined : "Ir al sitio público"}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
          </svg>
          {showLabels ? <span>Sitio público</span> : <span className="sr-only">Ir al sitio público</span>}
        </Link>
      </div>
    </aside>
  );
}
