import React from 'react'
import { Label } from "@@/(app)/mypage/linkedit/_component/Label"
import { Input } from "@@/(app)/mypage/linkedit/_component/Input"
import { Button } from "@@/(app)/mypage/linkedit/_component/Button"
const LinkForm = () => {
    return (
        <form className="space-y-4 col-span-1 mr-3.5">
            <div className="grid gap-4">
                <div>
                    <Label htmlFor="url" className="">
                        <span className="flex justify-between items-end">
                            <span className="">URL</span>

                            <span>
                                <span className="font-bold text-red-600">[code]</span>
                                <span>は証券コードに置換されます。</span>
                            </span>
                        </span>
                    </Label>

                    <Input id="url" type="url" placeholder="(例) https://kabutan.jp/stock/finance?code=[code]" className="w-full placeholder-gray-200" />
                </div>
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="(例) 株探" className="w-full placeholder-gray-200" />
                </div>
            </div>
            <Button type="submit" className="w-full">
                リンクを追加
            </Button>
        </form>
    )
}

export default LinkForm