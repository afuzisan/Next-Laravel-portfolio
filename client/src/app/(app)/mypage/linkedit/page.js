import { siteName } from "@/app/metadata_common.js"
import InputChange from "@@/(app)/mypage/_component/inputChange.client"
import TestData from '@/app/(app)/mypage/linkedit/testData'

export const metadata = {
    title: `${siteName} - My Page - 投資系サイトへのリンク編集`,
}

const Dashboard = () => {
    const className = 'w-5/12 h-8 p-2 m-1.5'
    return (
        <>
            <div className="text-center">
                （例）https://kabutan.jp/stock/?code=[code] と書くと[code]の部分が補完されて証券コードに置き換わります。
            </div>
            <div className=" flex justify-center flex-col py-6">
                {TestData.map((data) => {
                    return (
                        <span className="flex justify-center">
                            <InputChange info={{ placeholder: data.placeholderURL, initialValue: data.initialValueURL, type: data.type, cName: className }} />
                            <InputChange info={{ placeholder: data.placeholderName, initialValue: data.initialValueName, type: data.type, cName: className }} />
                        </span>
                    );
                })}
            </div>
        </>
    )
}

export default Dashboard

