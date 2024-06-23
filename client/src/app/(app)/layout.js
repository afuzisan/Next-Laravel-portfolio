'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100 max-w-screen-2xl bg-white" style={{ margin: '0px auto' }}>
            <Navigation user={user} />
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
