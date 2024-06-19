'use client'
import { React, useEffect } from 'react';
import { useEditorContext,useIndexSave } from './EditorContext.client';
import { EditorState, ContentState, convertToRaw } from 'draft-js';

// editorState は EditorState オブジェクトです
// function getTextFromEditorState(editorState) {
//     const contentState = editorState.getCurrentContent();
//     const blocks = contentState.getBlocksAsArray();

//     // ブロックからテキストを抽出して結合
//     const text = blocks.map(block => block.getText()).join('\n');
//     return text;
// }

const MemoList = ({ title, memo, index }) => {

    const [editor, setEditor] = useEditorContext()
    const [indexSaveState, setIndexSave] = useIndexSave()
    
    const handleButtonClick = () => {
        const rawText = memo
        const contentState = ContentState.createFromText(rawText);
        const editorState = EditorState.createWithContent(contentState);
        setIndexSave(index)
        setEditor(editorState);
    };

    return (
        <ul>
            <li>
                <button onClick={handleButtonClick}>{title}</button>
            </li>
        </ul>
    );
};

export default MemoList;
