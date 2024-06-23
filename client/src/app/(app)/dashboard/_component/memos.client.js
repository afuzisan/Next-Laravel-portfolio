'use client'

import { React, useState, useEffect } from 'react'
import MemoList from './memoList';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext, useIndexSave } from './EditorContext.client';


const Memos = ({ memos, csrfToken }) => {

    return (
        <EditorProvider>
            <MemoContent memos={memos} csrfToken={csrfToken} />
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

const MemoContent = ({ memos, csrfToken }) => {


    const [editor, setEditor] = useEditorContext();

    const updatedMemos = memos.map((memo) => {

        const text = getTextFromEditorState(editor); // 現在のeditorからテキストを取得

        return { ...memo, memo: text }; // テキストでメモを更新

    });


    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                {updatedMemos.map((memo) => (
                    <div key={memo.id}>
                        <MemoList title={memo.memo_title} id={memo.id} />
                    </div>
                ))}
            </div>
            {updatedMemos.length > 0 && updatedMemos[0] ? <MyEditor initMemo={memos[0].memo} csrfToken={csrfToken} /> : null}


        </>
    );
}

export default Memos
