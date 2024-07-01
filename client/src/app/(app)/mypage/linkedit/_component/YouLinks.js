import React, { useState } from 'react'
import  DeleteButton  from "@@/(app)/mypage/linkedit/_component/DeleteButton"
import Link from "next/link"

const YouLinks = ({ data, onRefetch }) => {
    const [inputValue, setInputValue] = useState(7203);

    const linkReplace = (data) => {
        return data.replace('[code]', inputValue);
    }

    return (
        <>
            <div className="flex items-center">
                <h3 className="text-lg font-semibold ml-4">あなたのリンク</h3>
                <input 
                    type="number" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    className='mt-1 block shadow-sm border-gray-300 rounded-md text-right ml-auto w-20' 
                />
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
                                    <DeleteButton id={item.id} onRefetch={onRefetch}/>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}




export default YouLinks