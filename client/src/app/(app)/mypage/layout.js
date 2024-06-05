'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import { siteName } from "@/app/metadata_common.js"
import InputChange from "@@/mypage/_component/inputChange.client"
import Sidebar from '@@/manage/sidebar.js'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="py-6 grid--2 grid grid-flow-col grid-cols-[300px_1fr] gap-4">
            <div className="">
                <Sidebar />
            </div>
            <div className="bg-white">
                {children}
            </div>
        </div>
    )
}

export default AppLayout
