export default function RootLayout({ children, modal }) {
  return (
    <main>
      {children}
      {modal}
    </main>
  )
}
