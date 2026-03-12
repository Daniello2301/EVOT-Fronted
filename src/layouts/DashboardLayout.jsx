import { Outlet } from "react-router-dom";
import Sidebar from "../components/AsideDashBoard";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {
    return (
        <div className="h-screen flex">

            {/* Sidebar */}
            <Sidebar />

            {/* Contenido */}
            <div className="flex flex-col flex-1">

                {/* Navbar */}
                <Navbar />

                {/* Main */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}