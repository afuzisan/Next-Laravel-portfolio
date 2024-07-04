'use client'

import { React, useState, useEffect } from 'react'
import MemoList from './memoList';
import MyEditor from '@/components/MyEditor.client'
import { EditorProvider, useEditorContext, useIndexSave } from './EditorContext.client';
import laravelAxios from '@/lib/laravelAxios';


const Memos = ({ memos, stock, name, refreshKey }) => {
    const [activeId, setActiveId] = useState(memos.length > 0 ? memos[0].id : null);

    return (
        <EditorProvider>
            <MemoContent memos={memos} activeId={activeId} setActiveId={setActiveId} stock={stock} name={name} refreshKey={refreshKey} />
        </EditorProvider>
    )
}
function getTextFromEditorState(editorState) {
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlocksAsArray();

    // ブロックからテキストを抽出して結合
    const text = blocks.map(block => block.getText()).join('\n');
    return JSON.stringify(text);
}

const MemoContent = ({ memos, activeId, setActiveId, stock, name, refreshKey }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleClick = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleSubmit = async () => {
        try {
            await laravelAxios.post('http://localhost:8080/api/dashboard/memoTitleCreate', {
                "stockNumber": stock,
                "memo_title": inputValue
            });
            closeModal();
            refreshKey(); 
        } catch (error) {
            console.error('Error submitting memo:', error);
        }
    }

    return (
        <>
            <div className="grid grid-cols-[1fr_3fr]">
                <div className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
                    <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                        <button onClick={handleClick} className="text-black p-2">追加</button>
                        <button className="text-black p-2">編集</button>
                    </div>
                    {memos.map((memo) => (
                        memo.memo_title ? (
                            <div key={memo.id} className='py-2 duration-300 ease-in-out hover:bg-gray-100 p-2 cursor-pointer'>
                                <MemoList title={memo.memo_title} id={memo.id} setActiveId={setActiveId} activeId={activeId} />
                            </div>
                        ) : null
                    ))}
                </div>
                {/* 他のコンテンツをここに追加 */}

                {memos.length > 0 && memos[0] ? <MyEditor initMemo={memos[0].memo} initId={memos[0].id} /> : null}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{name}({stock})にメモを追加します。</h2>
                            <span
                                className="close cursor-pointer text-gray-500 hover:text-gray-700 text-xl absolute top-2 right-2 p-1 border border-gray-500 rounded-md hover:bg-gray-200"
                                onClick={closeModal}
                                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                &times;
                            </span>
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
                    </div>
                </div>
            )}
        </>
    );
}

export default Memos
