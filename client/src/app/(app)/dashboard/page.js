import { siteName } from "@/app/metadata_common.js"
import MemoFetch from '@@/(app)/dashboard/_component/MemoFetch.client';


export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = async () => {



    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-2 h-full gap-2">

                    <nav aria-label="Page navigation" className="col-span-2 flex justify-between pr-6">
                        <div className="flex items-center pl-6">
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">日付 (新しい順)</button>
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">日付 (古い順)</button>
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">証券コード (大きい順)</button>
                            <button className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">証券コード (小さい順)</button>
                        </div>
                        <ul className="inline-flex -space-x-px items-center">
                            <li>
                                <a href="#" className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">前</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">2</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">3</a>
                            </li>
                            <li>
                                <a href="#" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">次</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="grid grid-cols-1 pt-6 pl-6 pr-6 bg-white border-b border-gray-200 ">
                    <MemoFetch />
                </div>
            </div >
        </>
    )
}



export default Dashboard
