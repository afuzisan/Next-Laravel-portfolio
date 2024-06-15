'use client'
import React from 'react';
import { useEditorContext } from './EditorContext.client';

const MemoList = ({ stock_id, memos }) => {
    const { setEditorText } = useEditorContext();
    const handleButtonClick = (categoryName) => {
        setEditorText({stock_id: stock_id, categoryName: categoryName});
    };
    const uniqueCategoryNames = new Set(memos.filter(item => item.stock_id === stock_id).map(item => item.memo_category.category_name));
    return (
        <ul>
            <li>
                {Array.from(uniqueCategoryNames).map(categoryName => (
                    <button onClick={() => handleButtonClick(categoryName)}>{categoryName}</button>
                ))}
            </li>
        </ul>
    );
};

export default MemoList;
