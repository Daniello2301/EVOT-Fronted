import { useEffect, useRef, useState } from "react";

export default function Dropdown({ children, trigger, position = "bottom-right" }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const positionClasses = {
        "bottom-right": "top-full mt-2 right-0",
        "bottom-left": "top-full mt-2 left-0",
        "top-right": "bottom-full mb-2 right-0",
        "top-left": "bottom-full mb-2 left-0",
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>
            {isOpen && (
                <div
                    className={`absolute z-50 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 ${positionClasses[position]}`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export function DropdownItem({ children, onClick, className = "" }) {
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick && onClick();
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            role="menuitem"
        >
            {children}
        </a>
    );
}

export function DropdownSeparator({ className = "" }) {
    return <div className={`h-px bg-gray-200 dark:bg-gray-700 my-1 ${className}`} />;
}
