import { siteName } from "@/app/metadata_common.js"
import InputChange from "@@/(app)/mypage/_component/inputChange.client"
import laravelAxios from "@/lib/laravelAxios"

export const metadata = {
    title: `${siteName} - My Page - 投資系サイトへのリンク編集`,
}

export async function getData() {
    let data = 100
    // try {
    //     const response = await laravelAxios.get('/api/endpoint')
    //     data = response.data
    // } catch (error) {
    //     console.error(error)
    // }
    return data
}

const Dashboard = async () => {
    const initialData = await getData()
    console.log('initialData:', initialData);   
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center justify-center p-6 bg-white w-[400px]">
                <div className="mb-4 text-center text-gray-700">
                    1ページに表示する銘柄数
                </div>
                <div className="flex flex-col items-center">
                    <InputChange info={{ placeholder: '表示銘柄数', initialValue: initialData, type: 'number' }} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard