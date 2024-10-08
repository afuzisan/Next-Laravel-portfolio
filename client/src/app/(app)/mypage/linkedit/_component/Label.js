export function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-gray-700">
      {children}
    </label>
  )
}
