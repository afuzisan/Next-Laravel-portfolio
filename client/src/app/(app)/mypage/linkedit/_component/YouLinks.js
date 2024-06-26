import React from 'react'
import { Button } from "@@/(app)/mypage/linkedit/_component/Button"
import Link from "next/link"

const YouLinks = ({ data }) => {

    const linkReplace = (data) => {
        return data.replace('[code]', 9997)
    }

    return (
        <>
            <div className="flex items-center">
                <h3 className="text-lg font-semibold ml-4">あなたのリンク</h3>
                <input type="number" value="7203" className='mt-1 block shadow-sm border-gray-300 rounded-md text-right ml-auto w-20' />

            </div>
            <div className="space-y-2">
                <div className="items-center justify-between">
                    <div className="items-center gap-4">
                        <div className="flex  flex-col">
                            {data.map((item, index) => (
                                <div key={index} className="flex gap-2 p-2">
                                    <div className="flex flex-col space-y-1 flex-1">
                                        <Link href={linkReplace(item.url)} title={linkReplace(item.url)} target="_blank" className="hover:bg-gray-100 break-all transition duration-300 p-2 rounded-lg">
                                            <div className="flex items-center">
                                                <img src={`http://www.google.com/s2/favicons?domain=${item.url}`} alt={item.site_name} className="w-4 h-4 mr-2" />
                                                <div>{item.site_name}</div>
                                            </div>
                                            <div>{item.url}</div>
                                        </Link>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground ml-auto flex-shrink-0">
                                        <TrashIcon className="w-5 h-5" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
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