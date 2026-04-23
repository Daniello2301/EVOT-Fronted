import { Outlet } from "react-router-dom";
import Sidebar from "../components/AsideDashBoard";
import NavDashboard from "../components/NavDashboard";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import Backdrop from "./Backdrop";


const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    return (
        <div className="min-h-screen xl:flex">

            {/* Sidebar */}
            <Backdrop />
            <Sidebar />

            {/* Contenido */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                } ${isMobileOpen ? "ml-0" : ""}`}>

                {/* Navbar */}
                <NavDashboard />

                {/* Main */}
                <main className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    <Outlet />
                </main>

            </div>

        </div>

    )

}

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
}