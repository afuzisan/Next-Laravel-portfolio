import Dashboard from '@mypage/passwordreset/Dashboard'

export default function Page() {
  return <Dashboard />
}

export async function generateMetadata() {
  const siteName = process.env.SITE_NAME || ''
  return {
    title: `パスワードリセット | ${siteName}`,
  }
}
