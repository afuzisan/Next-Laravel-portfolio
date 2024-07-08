import React, { useEffect, useState } from 'react'
import MemoList from '@@/(app)/dashboard/_component/memoList'

const MemoTitle = ({ memos, handleClick, setActiveId, activeId }) => {
    const [bg, setBg] = useState('bg-gray-100');

    return (
        <div className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
            <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                <button onClick={handleClick} className="text-black p-2">追加</button>
                <button className="text-black p-2">編集</button>
            </div>
            {memos.map((memo, index) => (
                memo.memo_title ? (
                    <div key={memo.id} className={`${index === 1 ? bg : ''}`}>
                        <MemoList title={memo.memo_title} id={memo.id} setActiveId={setActiveId} activeId={activeId} index={index} setBg={setBg}/>
                    </div>
                ) : null
            ))}
        </div>
    )
}

export default MemoTitle