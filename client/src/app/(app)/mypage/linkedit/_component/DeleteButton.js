import React from 'react'
import { Button } from "@@/(app)/mypage/linkedit/_component/Button"
import laravelAxios from '@/lib/laravelAxios'



const DeleteButton = ({ id, onRefetch }) => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const handleDelete = async () => {
        try {
            await laravelAxios.post(`${apiUrl}/api/mypage/externallinks/delete`, {
                'id': id
            })
            onRefetch()
                        
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground ml-auto flex-shrink-0 hover:bg-gray-200">
            <TrashIcon className="w-5 h-5" />
            <span className="sr-only">Delete</span>
        </Button>
    )
}

// TrashIcon関数を使用
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

export default DeleteButton
