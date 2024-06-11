import { siteName } from "@/app/metadata_common.js"
import LinkComponent from '@/app/(app)/dashboard/_component/link';
import MemoList from '@/app/(app)/dashboard/_component/memoList';
import ThemedInlineToolbarEditor from '../../../components/CustomLinkPluginEditor.client';
import MyEditor from '../../../components/MyEditor.client';
import Data from './_component/data.client'


export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = async() => {
    const result = await initFetch()

    

    //TODO: この配列は後で、DBから取得したデータに置き換える。
    const items = [
        { date: '日付1', stockName: '銘柄名1', stockCode: '証券コード1', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' },{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ1' },
        { date: '日付2', stockName: '銘柄名2', stockCode: '証券コード2', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ2' },
        { date: '日付3', stockName: '銘柄名3', stockCode: '証券コード3', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ3' },
        { date: '日付4', stockName: '銘柄名4', stockCode: '証券コード4', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ4' },
        { date: '日付5', stockName: '銘柄名5', stockCode: '証券コード5', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ5' },
        { date: '日付6', stockName: '銘柄名6', stockCode: '証券コード6', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ6' },
        { date: '日付7', stockName: '銘柄名7', stockCode: '証券コード7', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ7' },
        { date: '日付8', stockName: '銘柄名8', stockCode: '証券コード8', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ8' },
        { date: '日付9', stockName: '銘柄名9', stockCode: '証券コード9', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ9' },
        { date: '日付10', stockName: '銘柄名10', stockCode: '証券コード10', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部name_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ10' },
        { date: '日付1', stockName: '銘柄名1', stockCode: '証券コード1', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ1' },
        { date: '日付2', stockName: '銘柄名2', stockCode: '証券コード2', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ2' },
        { date: '日付3', stockName: '銘柄名3', stockCode: '証券コード3', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ3' },
        { date: '日付4', stockName: '銘柄名4', stockCode: '証券コード4', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ4' },
        { date: '日付5', stockName: '銘柄名5', stockCode: '証券コード5', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ5' },
        { date: '日付6', stockName: '銘柄名6', stockCode: '証券コード6', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ6' },
        { date: '日付7', stockName: '銘柄名7', stockCode: '証券コード7', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ7' },
        { date: '日付8', stockName: '銘柄名8', stockCode: '証券コード8', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ8' },
        { date: '日付9', stockName: '銘柄名9', stockCode: '証券コード9', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ9' },
        { date: '日付10', stockName: '銘柄名10', stockCode: '証券コード10', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部name_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ10' },
        { date: '日付1', stockName: '銘柄名1', stockCode: '証券コード1', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ1' },
        { date: '日付2', stockName: '銘柄名2', stockCode: '証券コード2', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ2' },
        { date: '日付3', stockName: '銘柄名3', stockCode: '証券コード3', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ3' },
        { date: '日付4', stockName: '銘柄名4', stockCode: '証券コード4', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ4' },
        { date: '日付5', stockName: '銘柄名5', stockCode: '証券コード5', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ5' },
        { date: '日付6', stockName: '銘柄名6', stockCode: '証券コード6', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ6' },
        { date: '日付7', stockName: '銘柄名7', stockCode: '証券コード7', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ7' },
        { date: '日付8', stockName: '銘柄名8', stockCode: '証券コード8', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ8' },
        { date: '日付9', stockName: '銘柄名9', stockCode: '証券コード9', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ9' },
        { date: '日付10', stockName: '銘柄名10', stockCode: '証券コード10', links: [{ url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部リンク_1' }, { url: 'https://www.youtube.com/watch?v=2kOBH4A6m6U', name: '外部name_1' }], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ10' },
    ]

    return (
        <>
            <div className="py-6">
                <Data result={result}/>
                <div className="grid grid-cols-1 p-6 bg-white border-b border-gray-200">
                    
                    {items.slice(0, 8).map(item => (
                        <>
                            <div className="grid grid-cols-6 border">
                                <div className="col-span-5 ">
                                    <span className="grid-item px-6">{item.date}</span>
                                    <span className="grid-item px-6">{item.stockName}</span>
                                    <span className="grid-item px-6">{item.stockCode}</span>
                                </div>
                                <div className="col-span-1 "> {/* 空のグリッドセル */}</div>
                            </div>
                            <div className="grid grid-cols-[1fr_3fr_1fr_3fr] h-full">
                                <div className="grid-item p-4 overflow-y-auto h-80 break-words"><LinkComponent links={item.links} /></div>
                                <div className="grid-item p-4"><img src={item.chart} className="h-full w-full object-scale-down" /></div>
                                <div className="grid-item p-4 overflow-y-auto h-80 break-words"><MemoList /></div>
                                <MyEditor />
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </>
    )
}

const initFetch = async () => {
    const result = await fetch('http://server:80/api/dashboard/reviews');
    return result.json();
}

export default Dashboard
