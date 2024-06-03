import {siteName} from "@/app/metadata_common.js"

export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = () => {

    return (
        <>
            <div className="py-6">
            メモ
            証券コード
            日付
            新しい順古い順で入れ替え
            メモ検索
            作成リンク一覧
            </div>
        </>
    )
}

export default Dashboard
