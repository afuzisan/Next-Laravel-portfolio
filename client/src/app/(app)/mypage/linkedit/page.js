import DashboardComponent from '@mypage/linkedit/Dashboard'

export default function Page() {
  return <DashboardComponent />
}

export async function generateMetadata() {
  const siteName = process.env.SITE_NAME || ''
  return {
    title: `リンク編集 | ${siteName}`,
  }
}
