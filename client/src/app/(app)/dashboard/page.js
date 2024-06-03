import {siteName} from "@/app/metadata_common.js"
import LinkComponent from '@/app/(app)/dashboard/_component/link.js'; 

export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = () => {

/**
 * アイテムの詳細を表示する
 * @param {Object} item - アイテムオブジェクト
 * @param {string} item.date - 日付
 * @param {string} item.item - アイテム名
 * @param {string} item.chart - チャート
 */

//TODO: この配列は後で、DBから取得したデータに置き換える。
    const items = [
        { date: '日付1', stockName: '銘柄名1', stockCode: '証券コード1', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ1', memoLink: 'メモリンク1',},
        { date: '日付2', stockName: '銘柄名2', stockCode: '証券コード2', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ2', memoLink: 'メモリンク1',},
        { date: '日付3', stockName: '銘柄名3', stockCode: '証券コード3', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ3', memoLink: 'メモリンク1',},
        { date: '日付4', stockName: '銘柄名4', stockCode: '証券コード4', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ4', memoLink: 'メモリンク1',},
        { date: '日付5', stockName: '銘柄名5', stockCode: '証券コード5', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ5', memoLink: 'メモリンク1',},
        { date: '日付6', stockName: '銘柄名6', stockCode: '証券コード6', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ6', memoLink: 'メモリンク1',},
        { date: '日付7', stockName: '銘柄名7', stockCode: '証券コード7', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ7', memoLink: 'メモリンク1',},
        { date: '日付8', stockName: '銘柄名8', stockCode: '証券コード8', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ8', memoLink: 'メモリンク1',},
        { date: '日付9', stockName: '銘柄名9', stockCode: '証券コード9', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ9', memoLink: 'メモリンク1',},
        { date: '日付10', stockName: '銘柄名10', stockCode: '証券コード10', links: [{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部リンク_1'},{ url:'https://www.youtube.com/watch?v=2kOBH4A6m6U',name:'外部name_1'}], chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ10', memoLink: 'メモリンク1',},
    ]

    const roop = (item) => {
        return (
            <>
                <div class="grid-item">{item.date}</div>
                <div class="grid-item">{item.stockName}</div>
                <div class="grid-item">{item.stockCode}</div>
                <div class="grid-item"><LinkComponent links={item.links} /></div>
                <div class="grid-item"><img src={item.chart}/></div>
                <textarea class="grid-item">{item.memo}</textarea>
                <div class="grid-item">{item.memoLink}</div>
                <input class="grid-item bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" type="button" value="編集" />
                <input class="grid-item bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" type="button" value="削除" />
            </>
        )
    }


    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-[100px_2fr_2fr_3fr_4fr_3fr_1fr_1fr_1fr] p-6 bg-white border-b border-gray-200">
                    {items.slice(0, 8).map(item => roop(item))}
                </div>
            </div>
        </>
    )
}

export default Dashboard
