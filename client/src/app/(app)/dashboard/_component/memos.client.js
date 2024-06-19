'use client'

import React, { useState } from 'react'
import MemoList from './memoList.client';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext } from './EditorContext.client';

const Memos = ({memos}) => {

    return (
        <EditorProvider>
            <MemoContent memos={memos} />
        </EditorProvider>
    )
}

const MemoContent = ({ memos, index }) => {
    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                {memos.map((memo) => (
                    <MemoList title={memo.memo_title} memo={memo.memo}/>
                ))}
            </div>
            {memos.length > 0 && memos[0] ? <MyEditor initMemo={memos[0].memo} /> : null}
        </>
    );
}

export default Memos
