'use client'

import {React,useState,useEffect} from 'react'
import MemoList from './memoList';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext, useIndexSave } from './EditorContext.client';
import Text from './text.client'


const Memos = ({ memos,csrfToken }) => {

    return (
        <EditorProvider>
            <MemoContent memos={memos} csrfToken={csrfToken}/>
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

const MemoContent = ({ memos,csrfToken }) => {

    const [indexSaveState, setIndexSave] = useIndexSave()
    const [editor, setEditor] = useEditorContext();
    
    const updatedMemos = memos.map((memo, index) => {
        if (index === indexSaveState) {
            const text = getTextFromEditorState(editor); // 現在のeditorからテキストを取得

            return { ...memo, index: index, memo: text }; // テキストでメモを更新
        }

        return { ...memo, index: index }; // 更新しない場合は元のメモをそのまま返す
    });

    console.log(csrfToken)
    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                {updatedMemos.map((memo) => (
                    <MemoList title={memo.memo_title} id={memo.id}/>
                ))}
            </div>
            {updatedMemos.length > 0 && updatedMemos[0] ? <MyEditor initMemo={memos[indexSaveState].memo} index={updatedMemos[indexSaveState].index} csrfToken={csrfToken}/> : null}
            <Text url="http://localhost:8080/api/dashboard/reviews"/>

        </>
    );
}

export default Memos
