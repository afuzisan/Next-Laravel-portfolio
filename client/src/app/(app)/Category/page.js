import React from 'react'
const env = (key) => process.env[key] || '';

export const metadata = {
    title: env('SITE_NAME'),
    description: env('SITE_DESCRIPTION'),
}

const page = () => {
  return (
    <div>page</div>
  )
}

export default page