import Dashboard from '@/app/(app)/dashboard/_TopComponents/Dashboard'
const env = key => process.env[key] || ''

export const metadata = {
  title: `ダッシュボード | ${env('SITE_NAME')}`,
  description: `ダッシュボード | ${env('SITE_DESCRIPTION')}`,
}

export default function DashboardPage() {
  return (
    <>
      <Dashboard />
    </>
  )
}
