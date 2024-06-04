import { siteName } from "@/app/metadata_common.js"
import InputChange from "@@/mypage/_component/inputChange.client"

export const metadata = {
    title: `${siteName} - My Page - 投資系サイトへのリンク編集`,
}

const Dashboard = () => {
    return (
        <div className="text-center h-full content-center">
            <div className="flex flex-row items-center justify-center gap-1">
                <div className="">
                    1ページに表示する銘柄数
                </div>
                <div className="">
                    <InputChange info={{ placeholder: '入力欄', initialValue: '', type: 'number' }} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
