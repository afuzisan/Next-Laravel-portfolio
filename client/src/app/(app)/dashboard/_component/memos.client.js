'use client'

import React, { memo, useState } from 'react'
import MemoList from './memoList.client';
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
    return text;
}
const MemoContent = ({ memos }) => {
    const [indexSaveState, setIndexSave] = useIndexSave()
    const [editor, setEditor] = useEditorContext();
    console.log(memos);
    console.log(indexSaveState)
    // map関数を使用して、各memoに対してエディタのテキストを設定
    const updatedMemos = memos.map((memo, index) => {
        const text = getTextFromEditorState(editor);
        return { ...memo, index: index, memo: text };
    });
    
    console.log(updatedMemos);

    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                {updatedMemos.map((memo) => (
                    <MemoList title={memo.memo_title} memo={memo.memo} index={memo.index} />
                ))}
            </div>
            {updatedMemos.length > 0 && updatedMemos[0] ? <MyEditor initMemo={memos[indexSaveState].memo} index={updatedMemos[indexSaveState].index} /> : null}
        </>
    );
}

export default Memos
