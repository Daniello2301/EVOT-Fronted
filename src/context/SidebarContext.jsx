import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Un solo punto de corte para todo el panel: lg (1024px).
// Por debajo, la barra lateral es un panel deslizable (isMobileOpen);
// por encima, se expande (290px) o colapsa (90px).
export const DESKTOP_BREAKPOINT = 1024;

const SidebarContext = createContext(null);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
    }
    return context;
};

const isDesktopWidth = () => typeof window !== "undefined" && window.innerWidth >= DESKTOP_BREAKPOINT;

export const SidebarProvider = ({ children }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(isDesktopWidth);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const desktop = isDesktopWidth();
            setIsDesktop(desktop);
            if (desktop) setIsMobileOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Escape cierra el panel móvil.
    useEffect(() => {
        if (!isMobileOpen) return undefined;
        const onKeyDown = (event) => { if (event.key === "Escape") setIsMobileOpen(false); };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isMobileOpen]);

    const toggleSidebar = useCallback(() => {
        if (isDesktopWidth()) setIsExpanded((prev) => !prev);
        else setIsMobileOpen((prev) => !prev);
    }, []);

    const closeMobileSidebar = useCallback(() => setIsMobileOpen(false), []);

    return (
        <SidebarContext.Provider value={{
            isExpanded: isDesktop ? isExpanded : false,
            isMobileOpen,
            isDesktop,
            isHovered,
            toggleSidebar,
            toggleMobileSidebar: toggleSidebar,
            closeMobileSidebar,
            setIsHovered
        }}>
            {children}
        </SidebarContext.Provider>
    );
};
