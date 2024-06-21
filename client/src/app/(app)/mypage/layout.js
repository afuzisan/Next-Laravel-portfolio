'use client'

import { useAuth } from '@/hooks/auth'
import Loading from '@/app/(app)/Loading'
import Sidebar from '@@/mypage/sidebar'

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
