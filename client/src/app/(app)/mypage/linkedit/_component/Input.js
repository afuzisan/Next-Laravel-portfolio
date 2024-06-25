export function Input({ id, type, placeholder, className }) {
    return (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`mt-1 block w-full shadow-sm  border-gray-300 rounded-md ${className}`}
      />
    );
  }