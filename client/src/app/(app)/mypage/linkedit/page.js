"use client"

import Select from "@@/(app)/mypage/linkedit/_component/select"
import LinkForm from "@@/(app)/mypage/linkedit/_component/LinkForm"
import YouLinks from "@@/(app)/mypage/linkedit/_component/YouLinks"



export default function Component() {
    return (
        <div className="flex flex-col items-center justify-start bg-background">
            <div className="w-full">
                <div className="grid gap-4 grid-cols-1  xl:grid-cols-[2fr_400px] xl:grid-cols-3">
                    <LinkForm />
                    <div className="border rounded-lg p-4 space-y-4 col-span-1 mr-3.5">
                        <Select />
                        <YouLinks />
                    </div>
                </div>
            </div>
        </div>
    )
}

