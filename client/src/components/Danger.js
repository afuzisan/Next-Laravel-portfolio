const Danger = ({ errorMessage, setErrorMessage, className }) => {
  return (
    <div className={className} onClick={() => setErrorMessage('')}>
      <svg
        className="w-5 h-5 mr-2"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-2-14h4v8h-4v-8zm0 9h4v4h-4V15z"
          clipRule="evenodd"
        />
      </svg>
      {errorMessage}
    </div>
  )
}

export default Danger
