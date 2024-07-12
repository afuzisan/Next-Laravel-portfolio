import React, { useEffect, useState } from 'react'
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


const MemoTitle = ({ memos, handleClick, setActiveId, activeId, setMemoRefreshKey, MemoTitleRefreshKey }) => {
    const [items, setItems] = useState(memos); // items の初期化
    const [minId, setMinId] = useState(null);

    useEffect(() => {
        const sortedItems = [...items].sort((a, b) => a.id - b.id);
        setMinId(sortedItems[1]?.id);
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
    }, [MemoTitleRefreshKey, memos]);

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        console.log(active, over)
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

                setItems(updatedItems);
                console.log(updatedItems);

                // 変更されたペアを生成
                const pairs = [];
                for (let i = 0; i < updatedItems.length; i++) {
                    if (items[i].order !== updatedItems[i].order) {
                        pairs.push({ newId: updatedItems[i].id, oldId: items[i].id });
                    }
                }
                console.log(pairs)
                await laravelAxios.post(`http://localhost:8080/api/dashboard/memo/exchange`, {
                    pairs: pairs,
                });
            }
        } catch (error) {
            console.error('Error saving order:', error);
        } finally {
            // setMemoRefreshKey(prevKey => prevKey + 1);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.order)} 
                strategy={verticalListSortingStrategy}
            >
                <div key={setMemoRefreshKey} className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
                    <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                        <button onClick={handleClick} className="text-black p-2">追加</button>
                        <button className="text-black p-2">編集</button>
                    </div>
                    {items.map((memo, index) => (
                        memo.memo_title ? (
                            <div key={memo.id}>
                                <MemoList
                                    title={memo.memo_title}
                                    id={memo.id}
                                    setActiveId={setActiveId}
                                    activeId={activeId}
                                    index={index}
                                    minId={minId}
                                    order={memo.order}
                                />
                            </div>
                        ) : null
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default MemoTitle