'use client'

import laravelAxios from '@/lib/laravelAxios'
import { logError } from '@/lib/logError'
import { useState } from 'react'

const Component = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [isModalOpen, setIsModalOpen] = useState(false) // モーダルの状態

  const fetchData = async () => {
    try {
      const response = await laravelAxios.post(
        `${apiUrl}/api/mypage/deleteAccount`,
      )
      if (response.status !== 200) {
        throw new Error('アカウント削除に失敗しました。')
      }
    } catch (error) {
      logError(error)
      throw error
    }
  }

  const handleDelete = async () => {
    try {
      await fetchData()
      alert('アカウントが削除されました。')
    } catch (error) {
      logError(error)
      alert('アカウント削除に失敗しました。')
    }
  }

  return (
    <div
      id="delete-account-button"
      className="flex flex-col items-center justify-start bg-background min-h-screen p-4 mt-16">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <p className="mb-4 text-center text-gray-700">
          アカウントを削除すると、すべてのデータが失われます。
        </p>
        <p className="mb-4 text-center text-gray-700">
          この操作は元に戻せません。
        </p>
        <button
          onClick={() => {
            setIsModalOpen(true)
          }}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 flex items-center justify-center">
          アカウント削除
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="bg-white p-6 rounded shadow-lg justify-around flex items-center">
            <h2>本当にアカウントを削除しますか？</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded m-2">
              キャンセル
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded m-2">
              削除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Component
