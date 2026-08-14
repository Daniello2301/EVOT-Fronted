import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

import {
  GridIcon,
  UserCircleIcon,
  Institutions,
  Study
} from "../../icons";

const navItems = [

  {
    name: "Dashboard",
    icon: <GridIcon />,
    path: "/admin-dashboard"
  },
  {
    name: "Diplomas",
    icon: <Study />,
    path: "/admin-dashboard/diplomas"
  },
  {
    name: "Estudiantes",
    icon: <UserCircleIcon />,
    path: "/admin-dashboard/estudiantes"
  },
  {
    name: "Instituciones",
    icon: <Institutions />,
    path: "/admin-dashboard/instituciones"
  }

]



export default function AsideDashboard() {

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();


  const location = useLocation();
  const isActive = (path) => location.pathname === path;


  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">

        {/* LOGO */}
        <div className="mb-6 flex justify-center">
          <Link to="/admin-dashboard">
            <span className="text-xl font-bold">EVOT</span>
          </Link>
        </div>

        {/* MENU */}
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition
                  ${isActive(item.path)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="w-5 h-5">{item.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
