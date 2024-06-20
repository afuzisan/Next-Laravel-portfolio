import { siteName } from "@/app/metadata_common.js"
import InputChange from "@@/mypage/_component/inputChange.client"

export const metadata = {
    title: `${siteName} - My Page - 投資系サイトへのリンク編集`,
}

const Dashboard = () => {
    return (
        <>
            <div>
                aaaaaaaaa
                <InputChange info = {{ placeholder: '入力欄', initialValue: '', type: 'text' }} />
            </div>
        </>
    )
}

export default Dashboard
