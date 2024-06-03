import { siteName } from "@/app/metadata_common.js"
import InputChange from "./_component/inputChange.client.js"

export const metadata = {
    title: `${siteName} - Dashboard`,
}

const Dashboard = () => {
    return (
        <>
            <div className="py-6 grid--2 py-6 grid grid-flow-col grid-cols-[300px_1fr] gap-4">
                <div className="grid p-6 justify-center bg-white justify-center" >
                    <div>投資系サイトへのリンク編集</div>
                    <div>１ページに表示する銘柄数の編集</div>
                    <div>パスワードリセットへのボタンリンク</div>
                    <div>アカウント削除</div>
                    <div>チャート表示切り替え編集</div>
                </div>
                <div className="grid justify-center bg-white p-6">
                    <div>
                        投資系サイトへのリンク編集([keyword])
                        <InputChange info={{ placeholder: 'aaaa', initialValue: 'male', type: 'text' }} />
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
