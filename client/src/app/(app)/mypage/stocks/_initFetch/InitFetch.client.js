'use client'

import InputChange from '@/app/(app)/mypage/stocks/_initFetch/_InputChange/inputChange.client'
import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState } from 'react'

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  let data = { memo_display_number: 90 } // デフォルト値をオブジェクトに変更
  try {
    const response = await laravelAxios.get(
      `${apiUrl}/api/mypage/memo_display_number`,
      { cache: 'no-cache' },
    )
    data.memo_display_number = response.data.memo_display_number
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'Error fetching data:',
        error.response ? error.response.data : error.message,
      )
    }
  }
  return data.memo_display_number
}

export default function InitFetch() {
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const data = await getData()
      setInitialData(data)
      localStorage.setItem('currentPage', 0)
    }
    fetchData()
  }, [])

  if (!initialData) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center">
      <InputChange
        placeholder="表示銘柄数"
        initialValue={initialData}
        type="number"
      />
    </div>
  )
}
