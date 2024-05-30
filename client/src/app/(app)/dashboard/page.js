import Header from '@/app/(app)/Header'

export const metadata = {
    title: 'Laravel - Dashboard',
}

const Dashboard = () => {
    return (
        <>
            <Header title="Dashboard" />
            <div className="py-12">
                <div className="p-6 bg-white border-b border-gray-200">
                    You are logged in!
                </div>
            </div>
        </>
    )
}

export default Dashboard