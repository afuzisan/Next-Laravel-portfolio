'use client'

import { React, useState, useEffect } from 'react'
import MemoList from './memoList';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext, useIndexSave } from './EditorContext.client';


const Memos = ({ memos }) => {

    return (
        <EditorProvider>
            <MemoContent memos={memos} />
        </EditorProvider>
    )
}
function getTextFromEditorState(editorState) {
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlocksAsArray();

    // ブロックからテキストを抽出して結合
    const text = blocks.map(block => block.getText()).join('\n');
    return JSON.stringify(text);
}

const MemoContent = ({ memos }) => {
const handleClick = () =>{
    console.log('test')
}
    return (
        <>
            <div className="grid grid-cols-[1fr_3fr]">
                <div className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
                    <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                        <button onClick={handleClick} className="text-black p-2">メモを追加</button>
                        <button className="text-black p-2">編集</button>
                    </div>
                    {memos.map((memo) => (
                        memo.memo_title ? (
                            <div key={memo.id} className='py-2 duration-300 ease-in-out hover:bg-gray-100 p-2 rounded-lg'>
                                <MemoList title={memo.memo_title} id={memo.id} />
                            </div>
                        ) : null
                    ))}
                </div>
                {/* 他のコンテンツをここに追加 */}

                {memos.length > 0 && memos[0] ? <MyEditor initMemo={memos[0].memo} initId={memos[0].id} /> : null}
            </div>


        </>
    );
}

export default Memos
