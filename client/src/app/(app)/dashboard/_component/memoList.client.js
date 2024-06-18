'use client'
import React from 'react';
import { useEditorContext } from './EditorContext.client';

const MemoList = ({ memo_title }) => {
    const { setEditorText } = useEditorContext();
    const handleButtonClick = (memo_title) => {
        setEditorText({ memo_title });
    };
    return (
        <ul>
            <li>
                <button onClick={() => handleButtonClick(memo_title)}>{memo_title}</button>
            </li>
        </ul>
    );
};

export default MemoList;
