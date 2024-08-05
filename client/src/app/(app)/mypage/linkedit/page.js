"use client"

import Select from "@@/(app)/mypage/linkedit/_component/Select"
import LinkForm from "@@/(app)/mypage/linkedit/_component/LinkForm"
import YouLinks from "@@/(app)/mypage/linkedit/_component/YouLinks"
import laravelAxios from "@/lib/laravelAxios"
import { useEffect, useState } from "react"

const Component = () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [data, setData] = useState(null)
    const [fetchTrigger, setFetchTrigger] = useState(false)

    const fetchData = () => {
        laravelAxios.get(`${apiUrl}/api/mypage/externallinks`, { cache: 'no-store' })
            .then(response => {
                setData(response.data)
            })
            .catch(error => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [fetchTrigger]) 

    return (
        <div className="flex flex-col items-center justify-start bg-background">
            <div className="w-full">
                    <Select />
                <div className="grid gap-4 grid-cols-1  xl:grid-cols-[1fr_550px] xl:grid-cols-3">
                    <LinkForm onRefetch={() => setFetchTrigger(!fetchTrigger)}/>
                    <div className="border rounded-lg p-4 space-y-4 col-span-1 mr-3.5">
                        {data !== null && <YouLinks data={data} onRefetch={() => setFetchTrigger(!fetchTrigger)} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Component;