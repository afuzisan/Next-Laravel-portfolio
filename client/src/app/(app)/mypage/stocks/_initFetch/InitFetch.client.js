'use client'

import InputChange from "@/app/(app)/mypage/stocks/_initFetch/_InputChange/inputChange.client"
import laravelAxios from "@/lib/laravelAxios"

async function getData() {
    let data = { memo_display_number: 90 } // デフォルト値をオブジェクトに変更
    try {
        const response = await laravelAxios.get('http://localhost:8080/api/mypage/memo_display_number', { cache: 'no-cache' })
        data.memo_display_number = response.data.memo_display_number // 修正
        console.log('data:', data)
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message)
    }
    return data.memo_display_number
}

export default async function InitFetch() {
    const initialData = await getData()

    return (
        <div className="flex flex-col items-center">
            <InputChange placeholder='表示銘柄数' initialValue={initialData} type='number' />
        </div>
    )
}