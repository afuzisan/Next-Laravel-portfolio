'use client'

import React, { useState } from 'react'
import MemoList from './memoList.client';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext } from './EditorContext.client';

const Memos = ({ memos }) => {
    const initialData = {
        id: memos && memos.length > 0 && memos[0] ? memos[0].id : "Undefined or empty memos array",
        memo: memos && memos.length > 0 && memos[0] ? memos[0].memo : "Undefined or empty memos array"
    }
    return (
        <EditorProvider initialData={initialData}>
            <MemoContent memos={memos} />
        </EditorProvider>
    )
}

const MemoContent = ({ memos }) => {

    const { editorText, setEditorText } = useEditorContext();
    console.log(editorText);
    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                {memos.map(memo => (
                    <MemoList memo_title={memo.memo_title} />

                ))}
            </div>
            {memos.length > 0 && memos[0] ? <MyEditor id={editorText.id} memo={editorText.memo} /> : null}
        </>
    );
}

export default Memos
