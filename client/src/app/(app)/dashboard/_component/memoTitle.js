import React, { useEffect, useState, useMemo, useCallback } from 'react'
import MemoList from '@@/(app)/dashboard/_component/memoList'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import laravelAxios from '@/lib/laravelAxios';
import Modal from 'react-modal';


const MemoTitle = ({ memos, handleClick, setActiveOrder, activeOrder, setMemoRefreshKey, MemoTitleRefreshKey, setEditorKey, stock, name }) => {
    const [items, setItems] = useState(memos);
    const [minOrder, setMinOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedMemos, setEditedMemos] = useState([]); // 初期値を空配列に変更



    const handleEdit = async () => {
        try {
            const response = await laravelAxios.post(`http://localhost:8080/api/dashboard/memoEdit`, {
                stock: stock,
            });
            setEditedMemos(response.data.memo);
        } catch (error) {
            console.error('Error fetching memos:', error);
        }
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleInputChange = async (id, value) => {
        try {
            setEditedMemos(prevMemos =>
                prevMemos.map(memo =>
                    memo.id === id ? { ...memo, memo_title: value } : memo
                )
            );
            console.log(editedMemos)
        } catch (error) {
            console.error('Error fetching memos:', error);
        }

    }

    const saveChanges = async () => {
        try {
            await laravelAxios.post('http://localhost:8080/api/dashboard/memoTitle/update', {
                memos: editedMemos,
            });
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setMemoRefreshKey(prevKey => prevKey + 1);
            closeModal();
        }
    }

    useEffect(() => {
        const sortedItems = [...items].sort((a, b) => a.order - b.order);
        setMinOrder(sortedItems[1]?.order);
    }, [items]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        // itemsをorder順にソート
        const sortedItems = [...memos].sort((a, b) => a.order - b.order);
        setItems(sortedItems);
    }, [memos]);

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;

        try {
            if (active && over && active.id !== over.id) {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                // 複数アイテムの移動ロジック
                const movedItems = [...items];
                const [movedItem] = movedItems.splice(oldIndex, 1);
                movedItems.splice(newIndex, 0, movedItem);

                // orderを更新
                const updatedItems = movedItems.map((item, index) => ({
                    ...item,
                    order: index + 1 // 1から始まる新しいorderを設定
                }));

                // orderの番号が低い順に並び替え
                updatedItems.sort((a, b) => a.order - b.order);
                setMemoRefreshKey(prevKey => prevKey + 1);
                setItems(updatedItems);
                // 変更されたペアを生成
                const pairs = [];
                for (let i = 0; i < updatedItems.length; i++) {
                    const originalItem = items.find(item => item.id === updatedItems[i].id);
                    if (originalItem && originalItem.order !== updatedItems[i].order) {
                        pairs.push({
                            newId: updatedItems[i].id,
                            oldId: originalItem.id,
                            newOrder: updatedItems[i].order,
                            oldOrder: originalItem.order
                        });
                    }
                }
                await laravelAxios.post(`http://localhost:8080/api/dashboard/memo/exchange`, {
                    pairs: pairs,
                });
            }
        } catch (error) {
            console.error('Error saving order:', error);
        } finally {
        }
    }, [items, setMemoRefreshKey]);

    const memoList = useMemo(() => (
        items.map((memo, index) => (
            memo.memo_title ? (
                <div key={memo.id}>
                    <MemoList
                        title={memo.memo_title}
                        id={memo.id}
                        setActiveOrder={setActiveOrder}
                        activeOrder={activeOrder}
                        index={index}
                        minOrder={minOrder}
                        order={memo.order}
                        setMemoRefreshKey={setMemoRefreshKey}
                    />
                </div>
            ) : null
        ))
    ), [items, setActiveOrder, activeOrder, minOrder, setMemoRefreshKey]);

    return (
        <DndContext
            sensors={sensors}
            pointerWithin={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.id)} // idを使用
                strategy={verticalListSortingStrategy}
            >
                <div key={setMemoRefreshKey} className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
                    <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                        <button onClick={handleClick} className="text-black p-2">追加</button>
                        <button onClick={handleEdit} className="text-black p-2">編集</button>
                    </div>
                    {memoList}
                </div>
            </SortableContext>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="編集モダール"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        padding: '0px 20px 20px 10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        borderRadius: '8px',
                        border: 'none',
                        minWidth:'300px'
                    }
                }}
            >
                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, borderBottom: '1px solid #ccc', paddingBottom: '10px', height: '50px', paddingTop:'10px',paddingBottom:'10px', paddingLeft:'10px',}}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>{name}({stock})</h2>
                        <button onClick={saveChanges} style={{ border: 'none', cursor: 'pointer', fontSize: '0.9em', padding: '5px 10px', backgroundColor: '#007BFF', color: 'white' }}>保存</button>
                    </div>
                </div>
                <ul style={{ padding: 0, listStyleType: 'none' }}>
                    {editedMemos
                        .slice(1)
                        .sort((a, b) => a.order - b.order)
                        .map((memo, index) => (
                            <li
                                key={memo.id}
                                style={{
                                    marginBottom: '10px',
                                    marginTop: index === 0 ? '20px' : '0'
                                }}
                            >
                                <input
                                    type="text"
                                    value={memo.memo_title}
                                    onChange={(e) => handleInputChange(memo.id, e.target.value)}
                                    style={{ width: '100%', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}
                                />
                            </li>
                        ))}
                </ul>
            </Modal>
        </DndContext>
    )
}

export default MemoTitle