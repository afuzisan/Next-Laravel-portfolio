'use client'

import React from 'react'
import MemoList from './memoList.client';
import ThemedInlineToolbarEditor from '../../../../components/CustomLinkPluginEditor.client';
import MyEditor from '@/components/MyEditor.client'


const Memos = (result) => {
    // console.log(result.result.memos[0].memo)
    return (
        <>
            <div className="grid-item p-4 overflow-y-auto h-80 break-words">
                {result.result.memos.map(item => (
                    <>
                        <MemoList memos={item} />
                    </>
                ))}
            </div>
            <MyEditor />
        </>
    )
}

export default Memos