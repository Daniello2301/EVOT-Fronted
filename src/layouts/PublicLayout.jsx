import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col">

            <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

            <Navbar />

            <main id="main-content" tabIndex="-1" className="flex flex-1">
                <Outlet />
            </main>

            <Footer />

        </div>
    );
}