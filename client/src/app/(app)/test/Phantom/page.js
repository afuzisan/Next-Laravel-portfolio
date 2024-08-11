'use client'

import laravelAxios from '@/lib/laravelAxios'
import axios from 'axios'

import React from 'react'

const page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const handleClick = async () => {
    try {
      await laravelAxios.post(`${apiUrl}/api/dashboard/PhantomJS`)
    } catch (error) {
      process.env.NODE_ENV === 'development'
        ? console.error('Error fetching data:', error)
        : ''
    }
  }

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}

export default page
