import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/AsideDashBoard";
import NavDashboard from "../components/NavDashboard";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import Backdrop from "./Backdrop";

const LayoutContent = () => {
    const { isExpanded, isHovered } = useSidebar();
    return (
        <div className="min-h-screen bg-white_primary">
            <a href="#dashboard-main" className="skip-link">Saltar al contenido</a>
            <Backdrop />
            <Sidebar />

            <div className={`min-w-0 transition-[margin] duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}`}>
                <NavDashboard />
                <main id="dashboard-main" tabIndex={-1} className="mx-auto w-full max-w-screen-2xl px-4 py-6 focus:outline-none md:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
}
