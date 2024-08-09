import Dashboard from '@Category/Dashboard';
const env = (key) => process.env[key] || '';

export const metadata = {
    title: `Category | ${env('SITE_NAME')}`,
    description:  `Category | env('SITE_DESCRIPTION')`,
}

const page = ({ params }) => {
  return (
    <Dashboard params={params}/>
  )
}

export default page