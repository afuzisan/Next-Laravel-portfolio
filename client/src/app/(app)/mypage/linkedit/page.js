"use client"

import Select from "@@/(app)/mypage/linkedit/_component/Select"
import LinkForm from "@@/(app)/mypage/linkedit/_component/LinkForm"
import YouLinks from "@@/(app)/mypage/linkedit/_component/YouLinks"
import laravelAxios from "@/lib/laravelAxios"
import { useEffect, useState } from "react"

const Component = () => {
    const [data, setData] = useState(null)

    const fetchData = () => {
        laravelAxios.get('http://localhost:8080/api/mypage/externallinks', { cache: 'no-store' })
            .then(response => {
                setData(response.data)
                console.log("Data fetched:", response.data) // データ取得の確認
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchData()
    }, []) 
    console.log(data) // データが正しく取得されているか確認するために追加

    return (
        <div className="flex flex-col items-center justify-start bg-background">
            <div className="w-full">
                <div className="grid gap-4 grid-cols-1  xl:grid-cols-[1fr_550px] xl:grid-cols-3">
                    <LinkForm />
                    <div className="border rounded-lg p-4 space-y-4 col-span-1 mr-3.5">
                        <Select />
                        {data !== null && <YouLinks data={data} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Component;