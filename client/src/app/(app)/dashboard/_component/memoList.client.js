'use client'
import React, { useState } from 'react';
import Link from 'next/link'; // Next.jsのLinkをインポート

const MemoList = ({ memos }) => {
    console.log(memos)
    const memoChange = () =>{

    }
    const [categoryName,categoryNameState] = useState(memos.memo)
    return (
        <ul>

                <li>
                    <button onClick={categoryNameState}>{categoryName} </button>
                </li>
         
        </ul>
    );
};

export default MemoList;
