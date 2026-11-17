import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
    const { isMobileOpen, closeMobileSidebar } = useSidebar();

    if (!isMobileOpen) return null;

    return (
        <button
            type="button"
            tabIndex={-1}
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
            aria-label="Cerrar menú lateral"
            onClick={closeMobileSidebar}
        />
    );
};

export default Backdrop;
