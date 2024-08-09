import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import LoginLinks from '@/app/LoginLinks'


export const metadata = {
    title: 'Laravel',
}

const Layout = ({ children }) => {
    return (
        <div>
            
            <div className="font-sans text-gray-900 antialiased">
                <LoginLinks />
                <AuthCard
                    logo={
                        <Link href="/">
                            Home
                        </Link>
                    }>
                        
                    {children}
                </AuthCard>
            </div>
        </div>
    )
}

export default Layout
