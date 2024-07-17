import { siteName } from "@/app/metadata_common.js"
import InputChange from "@/app/(app)/mypage/stocks/_initFetch/_InputChange/inputChange.client"
import laravelAxios from "@/lib/laravelAxios"
import InitFetch from "@/app/(app)/mypage/stocks/_initFetch/InitFetch.client"

export const metadata = {
    title: `1ページに表示する銘柄数 | ${siteName}`,
}

export default async function Dashboard() {

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="p-6 border rounded shadow-md bg-white w-[400px]">
                <div className="mb-4 text-center text-gray-700">
                    1ページに表示する銘柄数
                </div>
                <InitFetch />
            </div>
        </div>
    )
}