'use client'
/* eslint-disable no-unused-vars */
import React from 'react'
/* eslint-enable no-unused-vars */
import Loading from '@/app/(app)/Loading'
import Navigation from '@/app/(app)/Navigation'
import { useAuth } from '@/hooks/auth'

const AppLayout = ({ children }) => {
  const { user } = useAuth({ middleware: 'auth' })

  if (!user) {
    return <Loading />
  }

  return (
    <div
      id="root"
      className="min-h-screen bg-gray-100 max-w-screen-2xl bg-white"
      style={{ margin: '0px auto' }}>
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  )
}

export default AppLayout
