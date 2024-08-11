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
