import { siteName } from "@/app/metadata_common.js"
import MemoFetch from '@@/(app)/dashboard/_component/MemoFetch.client';


export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = async () => {


    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-1 p-6 bg-white border-b border-gray-200">
                    <MemoFetch />
                </div>
            </div >
        </>
    )
}



export default Dashboard

