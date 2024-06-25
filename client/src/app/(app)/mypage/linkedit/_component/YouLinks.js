import React from 'react'
import { Button } from "@@/(app)/mypage/linkedit/_component/Button"
import Link from "next/link"

const YouLinks = () => {
    return (
        <>
            <h3 className="text-lg font-semibold">あなたのリンク</h3>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <div><Link href="/mypage/" className="hover:font-bold text-sky-700">Example Website</Link></div>
                            <div><Link href="/mypage/" className="hover:font-bold text-sky-700">https://example.com</Link></div>
                            <div className="text-muted-foreground">https://[code].com</div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <TrashIcon className="w-5 h-5" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <div><Link href="/mypage/" className="hover:font-bold text-sky-700">Example Website</Link></div>
                            <div><Link href="/mypage/" className="hover:font-bold text-sky-700">https://example.com</Link></div>
                            <div className="text-muted-foreground">https://[code].com</div>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <TrashIcon className="w-5 h-5" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>

        </>
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

export default YouLinks