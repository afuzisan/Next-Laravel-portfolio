import { Label } from "@@/(app)/mypage/linkedit/_component/Label"
import { Input } from "@@/(app)/mypage/linkedit/_component/Input"
import { Button } from "@@/(app)/mypage/linkedit/_component/Button"
import Link from "next/link"


export default function Component() {
    return (
        <div className="flex flex-col items-center justify-start bg-background">
            <div className="max-w-md w-full space-y-4">
                {/* <h2 className="text-2xl font-bold text-foreground">Add New Links</h2> */}
                <form className="space-y-4">
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="url" className="">
                                <span className="flex justify-between">
                                    <span>URL</span>
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
                <div className="border rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-semibold">あなたのリンク</h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <div><Link href="/mypage/" className="font-medium hover:font-bold text-sky-700">Example Website</Link></div>
                                    <div><Link href="/mypage/" className="font-medium hover:font-bold text-sky-700">https://example.com</Link></div>
                                    <div className="text-sm text-muted-foreground">https://[code].com</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <TrashIcon className="w-5 h-5" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <div><Link href="/mypage/" className="font-medium hover:font-bold text-sky-700">Example Website</Link></div>
                                    <div><Link href="/mypage/" className="font-medium hover:font-bold text-sky-700">https://example.com</Link></div>
                                    <div className="text-sm text-muted-foreground">https://[code].com</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground">
                                <TrashIcon className="w-5 h-5" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LinkIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    )
}


function TrashIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}