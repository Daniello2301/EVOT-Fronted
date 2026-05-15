export default function Badge({ children, variant = "default", size = "md", className = "" }) {
    const variants = {
        default: "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300",
        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
        error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </span>
    );
}
