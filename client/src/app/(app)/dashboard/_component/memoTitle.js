import React, { useEffect } from 'react'
import MemoList from '@@/(app)/dashboard/_component/memoList'

const MemoTitle = ({ memos, handleClick, setActiveId, activeId}) => {

    return (
        <div className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
            <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                <button onClick={handleClick} className="text-black p-2">追加</button>
                <button className="text-black p-2">編集</button>
            </div>
            {memos.map((memo) => (
                memo.memo_title ? (
                    <li key={memo.id} className={`duration-300 ease-in-out hover:bg-gray-100 h-8 w-full cursor-pointer flex items-center p-2 ${activeId === memo.id ? 'bg-gray-100' : ''}`} onClick={() => setActiveId(memo.id)}>
                        <MemoList title={memo.memo_title} id={memo.id} setActiveId={setActiveId} activeId={activeId} />
                    </li>
                ) : null
            ))}
        </div>
    )
}

export default MemoTitle