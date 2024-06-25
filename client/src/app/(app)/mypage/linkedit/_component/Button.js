export function Button({ type, className, children, variant, size }) {
    const baseClasses = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = variant === "ghost" ? "bg-transparent" : "bg-indigo-600 text-white";
    const sizeClasses = size === "icon" ? "p-2" : "px-4 py-2";
  
    return (
      <button type={type} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}>
        {children}
      </button>
    );
  }