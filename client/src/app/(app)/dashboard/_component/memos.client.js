'use client'

import React, { useState } from 'react'
import MemoList from './memoList.client';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext } from './EditorContext.client';

const Memos = (memos) => {
    return (
        <EditorProvider>
            <MemoContent memos={memos} />
        </EditorProvider>
    )
}

const MemoContent = ({ memos }) => {
    const { editorText } = useEditorContext(); // EditorContextからeditorTextを取得
    console.log(editorText); // 確認のためコンソールに出力

    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                <MemoList stock_id={memos.stock.memos[0].stock_id} memos={memos.memos} />
            </div>
            <MyEditor />
        </>
    );
}

export default Memos
