import Dashboard from '@mypage/accountdelete/Dashboard'

export default function Page() {
  return <Dashboard />
}

export async function generateMetadata() {
  const siteName = process.env.SITE_NAME || ''
  return {
    title: `アカウント削除 | ${siteName}`,
  }
}
