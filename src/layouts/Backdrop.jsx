import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
    const { isMobileOpen, toggleMobileSidebar } = useSidebar();

    if (!isMobileOpen) return null;

    return (
        <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden"
            aria-label="Cerrar menu lateral"
            onClick={toggleMobileSidebar}
        />
    );
}

export default Backdrop;