/* eslint-disable no-unused-vars */
import React from 'react'
/* eslint-enable no-unused-vars */
import '@/app/global.css'

export const metadata = {
  title: 'incoll vol.2',
}
const RootLayout = ({ children }) => {
  return (
    <html lang="ja" className="scroll-behavior">
      <body className="antialiased">{children}</body>
    </html>
  )
}

export default RootLayout
