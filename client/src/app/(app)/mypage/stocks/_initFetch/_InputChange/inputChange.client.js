'use client'

import laravelAxios from '@/lib/laravelAxios'
import { useRef, useState } from 'react'

const InputChange = ({ placeholder, initialValue, type }) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [inputValue, setInputValue] = useState(initialValue)
  const formRef = useRef(null) // useRef added

  const handleInputChange = event => {
    setInputValue(event.target.value)
  }

  const handleSubmit = async () => {
    try {
      const response = await laravelAxios.post(
        `${apiUrl}/api/mypage/memo_display_number_update`,
        {
          memo_display_number: inputValue,
        },
      )
      localStorage.setItem('itemsPerPage', inputValue)
      const popup = document.createElement('div')
      popup.textContent = response.data.message
      popup.style.color = 'white'
      popup.style.border = '1px solid green'
      popup.style.background = 'green'
      popup.style.marginTop = '10px'
      popup.style.padding = '5px'
      popup.style.borderRadius = '3px'
      formRef.current.appendChild(popup)
    } catch (error) {
      const errorPopup = document.createElement('div')
      errorPopup.textContent = '更新に失敗しました'
      errorPopup.style.color = 'white'
      errorPopup.style.border = '1px solid red'
      errorPopup.style.background = 'red'
      errorPopup.style.marginTop = '10px'
      errorPopup.style.padding = '5px'
      errorPopup.style.borderRadius = '3px'
      errorPopup.style.textAlign = 'center'
      formRef.current.appendChild(errorPopup)
    }
  }

  return (
    <div ref={formRef}>
      <input
        placeholder={placeholder}
        type={type}
        onChange={handleInputChange}
        value={inputValue}
        className="w-full"
        min="1"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 cursor-pointer border-color-blue-500 w-full mt-2">
        変更
      </button>
    </div>
  )
}

export default InputChange
