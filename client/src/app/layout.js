import '@/app/global.css'

export const metadata = {
    title: 'Laravel',
}
const RootLayout = ({ children }) => {
    return (
        <html lang="ja" className="scroll-behavior">
            <body className="antialiased">{children}</body>
        </html>
    )
}

export default RootLayout
