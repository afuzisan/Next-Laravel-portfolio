'use client'

import laravelAxios from '@/lib/laravelAxios'
import { logError } from '@/lib/logError'
import { useState } from 'react'

const Component = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const [data, setData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false) // モーダルの状態

  const fetchData = async data => {
    try {
      const response = await laravelAxios.post(
        `${apiUrl}/api/mypage/passwordReset`,
        {
          password: data,
        },
      )
      if (response.status !== 200) {
        throw new Error('パスワードの変更に失敗しました。')
      }
    } catch (error) {
      logError(error)
    }
  }

  const handlePasswordReset = async () => {
    try {
      await fetchData(data)
      alert('パスワードが変更されました。')
    } catch (error) {
      logError(error)
      alert('パスワード変更に失敗しました。')
    }
  }
  return (
    <div
      id="delete-account-button"
      className="flex flex-col items-center justify-start bg-background min-h-screen p-4 mt-16">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <p className="mb-4 text-center text-gray-700">
          パスワードの変更をします。
        </p>
        <p className="mb-4 text-center text-gray-700">
          この操作は元に戻せません。
        </p>
        <input
          type="text"
          className="w-[100%] pb-2 mb-2"
          placeholder="新しいパスワード（８文字以上、アルファベットと数字のみ）"
          onChange={e => {
            const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
            setData(value)
          }}
          value={data || ''}
        />
        <button
          onClick={() => {
            if (!data) {
              alert('入力してください')
            } else if (data.length < 8) {
              alert('８文字以上で入力してください')
            } else {
              setIsModalOpen(true)
            }
          }}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300 flex items-center justify-center">
          パスワード変更
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="bg-white p-6 rounded shadow-lg justify-around flex items-center">
            <h2>本当にパスワードを変更しますか？</h2>

            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded m-2">
              キャンセル
            </button>
            <button
              onClick={handlePasswordReset}
              className="bg-red-500 text-white py-2 px-4 rounded m-2">
              変更
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Component
