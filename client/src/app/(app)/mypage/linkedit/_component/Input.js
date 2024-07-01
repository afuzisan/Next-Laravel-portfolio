export function Input({ id, type, placeholder, className, onChange, value }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`mt-1 block w-full shadow-sm  border-gray-300 rounded-md ${className}`}
      onChange={onChange}
      value={value}
    />
  );
}
