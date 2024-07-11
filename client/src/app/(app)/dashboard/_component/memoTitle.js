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
        setItems(memos); // MemoTitleRefreshKeyが変わったときにitemsを更新
    }, [MemoTitleRefreshKey, memos]);

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        try {
            if (active && over && active.id !== over.id) {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                const reorderedItems = arrayMove(items, oldIndex, newIndex);
                setItems(reorderedItems);
                console.log(reorderedItems)
                laravelAxios.post(`http://localhost:8080/memo/exchange`, {
                    newId: reorderedItems[newIndex].id,
                    oldId: reorderedItems[oldIndex].id,
                })
            }
        } catch (error) {
            console.error('Error saving order:', error);
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(item => item.id)} // itemsのidを渡す
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