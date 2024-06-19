'use client'
import { React } from 'react';
import { useEditorContext } from './EditorContext.client';
import { EditorState, ContentState } from 'draft-js';

const MemoList = ({title,memo}) => {
    const [editor, setEditor] = useEditorContext()
    const handleButtonClick = () => {
        const rawText = memo;
        const contentState = ContentState.createFromText(rawText);
        const editorState = EditorState.createWithContent(contentState);
        setEditor(editorState);
    };
    return (
        <ul>
            <li>
                <button onClick={() => handleButtonClick()}>{title}</button>
            </li>
        </ul>
    );
};

export default MemoList;
