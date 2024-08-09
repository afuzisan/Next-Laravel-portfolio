'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { usePathname } from 'next/navigation'

const LoginLinks = () => {
    const { user } = useAuth({ middleware: 'guest' })
    const pathname = usePathname()

    const links = [
        { href: '/', text: 'Home' },
        { href: '/login', text: 'Login' },
        { href: '/register', text: 'Register' }
    ]

    return (
        <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
            {user ? (
                <Link
                    href="/dashboard"
                    className="ml-4 text-sm text-gray-700 underline"
                >
                    Dashboard
                </Link>
            ) : (
                <>
                    {links.map((link, index) => (
                        pathname !== link.href && (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${index !== 0 ? 'ml-4' : ''} text-sm text-gray-700 underline`}
                            >
                                {link.text}
                            </Link>
                        )
                    ))}
                </>
            )}
        </div>
    )
}

export default LoginLinks