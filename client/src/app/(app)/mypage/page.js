import { siteName } from "@/app/metadata_common.js"
import InputChange from "./stocks/_initFetch/_InputChange/inputChange.client.js/index.js"
import Sidebar from '@@/(app)/mypage/sidebar.js'

export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = () => {
    return (
        <>
            <div className="py-6 grid--2 py-6 grid grid-flow-col grid-cols-[300px_1fr] gap-4 justify-center">
                <Sidebar/>
                <div className="grid justify-center bg-white p-6">
                    <div>
                        投資系サイトへのリンク編集([keyword])
                        <div>
                            <InputChange info={{ placeholder: 'aaaa', initialValue: 'male', type: 'text' }} />
                        </div>
                    </div>
                    <div>１ページに表示する銘柄数の編集</div>
                    <div>パスワードリセットへのボタンリンク</div>
                    <div>アカウント削除</div>
                    <div>チャート表示切り替え編集</div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
