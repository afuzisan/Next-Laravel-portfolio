import LoginLinks from '@/app/LoginLinks'
import MainContents from '@/app/_RootComponents/MainContents.client'
const env = key => process.env[key] || ''

export const metadata = {
  title: env('SITE_NAME'),
  description: env('SITE_DESCRIPTION'),
}

const Home = () => {
  return (
    <>
      <MainContents />
      <LoginLinks />
    </>
  )
}

export default Home
