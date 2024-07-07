'use client'

import { React, useState, useEffect } from 'react'
import MemoList from './memoList';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext, useIndexSave } from './EditorContext.client';
import laravelAxios from '@/lib/laravelAxios';
import MemoTitle from '@/app/(app)/dashboard/_component/memoTitle'
import Danger from '@/components/Danger';


const Memos = ({ memos, stock, name, setMemoRefreshKey }) => {
    const [activeId, setActiveId] = useState(memos.length > 0 ? memos[0].id : null);

    return (
        <EditorProvider>
            <MemoContent memos={memos} activeId={activeId} setActiveId={setActiveId} stock={stock} name={name} setMemoRefreshKey={setMemoRefreshKey} />
        </EditorProvider>
    )
}
// function getTextFromEditorState(editorState) {
//     const contentState = editorState.getCurrentContent();
//     const blocks = contentState.getBlocksAsArray();

//     // ブロックからテキストを抽出して結合
//     const text = blocks.map(block => block.getText()).join('\n');
//     return JSON.stringify(text);
// }

const MemoContent = ({ memos, activeId, setActiveId, stock, name, setMemoRefreshKey }) => {
    const [MemoTitleRefreshKey, setMemoTitleRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleSubmit = async () => {
        try {
            if (!inputValue) {
                setErrorMessage("文字を入力してください。");
                return;
            }
            await laravelAxios.post('http://localhost:8080/api/dashboard/memoTitleCreate', {
                "stockNumber": stock,
                "memo_title": inputValue
            });
            closeModal();
            setMemoRefreshKey(prevKey => prevKey + 1);
            console.log(MemoTitleRefreshKey);
        } catch (error) {
            console.error('Error submitting memo:', error);
        }
    }

    return (
        <>
            <div className="grid grid-cols-[1fr_3fr]">
                <MemoTitle memos={memos} handleClick={handleClick} activeId={activeId} setActiveId={setActiveId} />

                {memos.length > 0 && memos[1] ? <MyEditor initMemo={memos[1].memo} initId={memos[1].id} stock={stock} setMemoRefreshKey={setMemoRefreshKey} name={name} /> : null}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-xl font-semibold">{name}({stock})にメモを追加します。</div>


                            <div
                                className="close cursor-pointer text-gray-500 hover:text-gray-700 text-xl absolute top-2 right-2 p-1 border border-gray-500 rounded-md hover:bg-gray-200"
                                onClick={closeModal}
                                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                &times;
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="border p-1 flex-grow rounded-md"
                                placeholder="(例)第三四半期決算の忘備録"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">送信</button>
                        </div>
                        {errorMessage && <Danger errorMessage={errorMessage} setErrorMessage={setErrorMessage} className="mt-2 w-full text-white bg-red-400 bg-opacity-75 border border-red-500 p-2 cursor-pointer text-center flex items-center" />}
                    </div>
                </div>
            )}
        </>
    );
}

export default Memos


