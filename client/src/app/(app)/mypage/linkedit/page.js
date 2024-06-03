import { siteName } from "@/app/metadata_common.js"
import InputChange from "@@/mypage/_component/inputChange.client"
import Sidebar from '@@/mypage/sidebar.js'

export const metadata = {
    title: `${siteName} - My Page - 投資系サイトへのリンク編集`,
}

const Dashboard = () => {
    return (
        <>
            <div className="py-6 grid--2 grid grid-flow-col grid-cols-[300px_1fr] gap-4 h-full">
                <Sidebar />
                <div className="bg-white">
                    <div className="text-center">
                        （例）https://kabutan.jp/stock/?code=[code] と書くと[code]の部分が補完されて証券コードに置き換わります。
                    </div>
                    <div className=" flex justify-center h-full">
                        <InputChange info={{ placeholder: 'URL', initialValue: 'URL', type: 'text' }} />
                        <InputChange info={{ placeholder: 'サイト名', initialValue: 'サイト名', type: 'text' }} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
