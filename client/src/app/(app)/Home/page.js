import {siteName} from "@/app/metadata_common.js"

export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = () => {

/**
 * アイテムの詳細を表示する
 * @param {Object} item -アイテムオブジェクト
 * @param {string} item.date -日付
 * @param {string} item.item -アイテム名
 * @param {string} item.chart -チャート
 */

//TODO: この配列は後で、DBから取得したデータに置き換える。
    const items = [
        { date: '日付1', stockName: '銘柄名1', stockCode: '証券コード1', link: 'リンク1', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ1',},
        { date: '日付2', stockName: '銘柄名2', stockCode: '証券コード2', link: 'リンク2', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ2',},
        { date: '日付3', stockName: '銘柄名3', stockCode: '証券コード3', link: 'リンク3', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ3',},
        { date: '日付4', stockName: '銘柄名4', stockCode: '証券コード4', link: 'リンク4', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ4',},
        { date: '日付5', stockName: '銘柄名5', stockCode: '証券コード5', link: 'リンク5', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ5',},
        { date: '日付6', stockName: '銘柄名6', stockCode: '証券コード6', link: 'リンク6', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ6',},
        { date: '日付7', stockName: '銘柄名7', stockCode: '証券コード7', link: 'リンク7', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ7',},
        { date: '日付8', stockName: '銘柄名8', stockCode: '証券コード8', link: 'リンク8', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ8',},
        { date: '日付9', stockName: '銘柄名9', stockCode: '証券コード9', link: 'リンク9', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ9',},
        { date: '日付10', stockName: '銘柄名10', stockCode: '証券コード10', link: 'リンク10', chart: 'https://www.kabudragon.com/chart/s=4564', memo: 'メモ10',},
    ]

    const roop = (item) => {
        return (
            <>
                <div class="grid-item">{item.date}</div>
                <div class="grid-item">{item.stockName}</div>
                <div class="grid-item">{item.stockCode}</div>
                <div class="grid-item">{item.link}</div>
                <div class="grid-item"><img src={item.chart}/></div>
                <textarea class="grid-item">{item.memo}</textarea>
                <input class="grid-item bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" type="button" value="編集" />
                <input class="grid-item bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" type="button" value="削除" />
            </>
        )
    }

    return (
        <>
            <div className="py-6">
                <div className="grid grid-cols-[100px_2fr_2fr_3fr_4fr_3fr_1fr_1fr] p-6 bg-white border-b border-gray-200">
                    <div class="grid-item">日付</div>
                    <div class="grid-item">銘柄名</div>
                    <div class="grid-item">証券コード</div>
                    <div class="grid-item">リンク</div>
                    <div class="grid-item">チャート</div>
                    <div class="grid-item">メモ</div>
                    <div class="grid-item">編集</div>
                    <div class="grid-item">削除</div>
                    {items.slice(0, 8).map(item => roop(item))}
                </div>
            </div>
        </>
    )
}

export default Dashboard
