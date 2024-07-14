'use client'

import { React, useState, useEffect, useContext } from 'react'
import MemoList from './memoList';
import MyEditor from '@/components/MyEditor.client'
import { EditableContext } from './MemoFetch.client';
import { EditorProvider, useEditorContext, useIndexSave } from './EditorContext.client';
import laravelAxios from '@/lib/laravelAxios';
import MemoTitle from '@/app/(app)/dashboard/_component/memoTitle'
import Danger from '@/components/Danger';


const Memos = ({ memos, stock, name, setMemoRefreshKey }) => {

    const sortedItems = [...memos].sort((a, b) => a.order - b.order);
    const [activeOrder, setActiveOrder] = useState(memos.length > 0 ? sortedItems[1]?.order : null);
    const [MemoTitleRefreshKey, setMemoTitleRefreshKey] = useState(0); // Moved here

    return (
        <EditorProvider>
            <MemoContent
                memos={memos}
                activeOrder={activeOrder}
                setActiveOrder={setActiveOrder}
                stock={stock}
                name={name}
                setMemoRefreshKey={setMemoRefreshKey}
                MemoTitleRefreshKey={MemoTitleRefreshKey} // Pass down
                setMemoTitleRefreshKey={setMemoTitleRefreshKey} // Pass down
            />
        </EditorProvider>
    )
}


const MemoContent = ({ memos, activeOrder, setActiveOrder, stock, name, setMemoRefreshKey, MemoTitleRefreshKey, setMemoTitleRefreshKey }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editorKey, setEditorKey] = useState(0);


    // activeOrderと一致するmemosの配列番号を取得
    const activeMemoIndex = memos.findIndex((memo) => {

        return memo.order === activeOrder;
    });
    const initMemoIndex = activeMemoIndex === -1 ? 1 : activeMemoIndex;



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

            // ２バイト数字を１バイト数字に変換
            const convertedInputValue = inputValue.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
            await laravelAxios.post('http://localhost:8080/api/dashboard/memoTitleCreate', {
                "stockNumber": stock,
                "memo_title": convertedInputValue,
                "memo": '{"blocks":[{"key":"cchb4","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
            });
            closeModal();
            setMemoRefreshKey(prevKey => prevKey + 1); // ここでステートを更新
        } catch (error) {
            console.error('Error submitting memo:', error);
        }
    }


    return (
        <>
            <div className="grid grid-cols-[1fr_3fr] h-80 border-r">
                <MemoTitle
                    memos={memos}
                    handleClick={handleClick}
                    activeOrder={activeOrder}
                    setActiveOrder={setActiveOrder}
                    setMemoRefreshKey={setMemoRefreshKey}
                    MemoTitleRefreshKey={MemoTitleRefreshKey} 
                    setEditorKey={setEditorKey}
                />

                {memos.length >= 0 && memos[1] ? 
                    <MyEditor editorKey={editorKey} setEditorKey={setEditorKey} initMemo={memos[initMemoIndex].memo} initId={memos[initMemoIndex].id} stock={stock} setMemoRefreshKey={setMemoRefreshKey} name={name} memosLength={memos.length} /> : 
                    <MyEditor editorKey={editorKey} setEditorKey={setEditorKey} initMemo={memos[0].memo} initId={memos[0].id} stock={stock} setMemoRefreshKey={setMemoRefreshKey} name={name} memosLength={memos.length} />
                }
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
                                placeholder="(例)第三四半期決算"
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