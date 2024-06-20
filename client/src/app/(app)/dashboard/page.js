import { siteName } from "@/app/metadata_common.js"
import Memos from '@@/(app)/dashboard/_component/memos.client';
// import {DataFetcher} from './_component/DataFetcher.client'


export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = async () => {
    const result = await initFetch()

    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-1 p-6 bg-white border-b border-gray-200">

                    {result.stocks.slice(0, 8).map((stock,index) => (
                        <>
                            <div className="grid grid-cols-6 border">
                                <div className="col-span-5 ">
                                    <span className="grid-item px-6">{stock.stock_at_edit}</span>
                                    <span className="grid-item px-6">{stock.stock_name}</span>
                                    <span className="grid-item px-6">{stock.stock_code}</span>
                                </div>
                                <div className="col-span-1 "> {/* 空のグリッドセル */}</div>
                            </div>
                            <div className="grid grid-cols-[1fr_3fr_1fr_3fr] h-full">
                                <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                                    {/* <LinkComponent links={stock.links} /> */}
                                </div>
                                <div className="grid-item p-4">
                                    <img src={`https://www.kabudragon.com/chart/s=${stock.stock_code}`} className="h-full w-full object-scale-down" />
                                </div>
                                <Memos memos={stock.memos} />

                            </div >
                        </>
                    ))}

                </div>
            </div >
        </>
    )
}

const initFetch = async () => {
    const result = await fetch('http://server:80/api/dashboard/reviews');
    return result.json();
}

export default Dashboard
