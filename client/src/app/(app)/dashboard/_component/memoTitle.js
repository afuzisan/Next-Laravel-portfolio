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


const MemoTitle = ({ memos, handleClick, setActiveId, activeId }) => {
    const [bg, setBg] = useState('bg-gray-100');
    const [items, setItems] = useState(memos); // items の初期化
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    
    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.id === active.id);
            const newIndex = items.findIndex(item => item.id === over.id);

            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            setItems(reorderedItems);
            console.log(reorderedItems, oldIndex, newIndex);

            try {
            } catch (error) {
                console.error('Error saving order:', error);
            }
        }
    };

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
                <div className="break-words overflow-y-auto h-80 border-l border-r w-full break-all">
                    <div className="border-b-2 pr-1 pl-1 sticky top-0 bg-white flex justify-center">
                        <button onClick={handleClick} className="text-black p-2">追加</button>
                        <button className="text-black p-2">編集</button>
                    </div>
                    {items.map((memo, index) => ( // itemsをmapする
                        memo.memo_title ? (
                            <div key={memo.id} className={`${index === 1 ? bg : ''}`}>
                                <MemoList 
                                    title={memo.memo_title} 
                                    id={memo.id} 
                                    setActiveId={setActiveId} 
                                    activeId={activeId} 
                                    index={index} 
                                    setBg={setBg} 
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