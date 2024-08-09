'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { SortableItem } from './SortableItem'; 

const ItemList = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Item 1', order: 1 },
    { id: '2', name: 'Item 2', order: 2 },
    { id: '3', name: 'Item 3', order: 3 },
  ]);

  // コンポーネントがマウントされたときにアイテムリストをAPIから取得
  // useEffect(() => {
  //   const fetchItems = async () => {
  //     const response = await axios.get('/api/items');
  //     const sortedItems = response.data.sort((a, b) => a.order - b.order);
  //     setItems(sortedItems);
  //   };
  //   fetchItems();
  // }, []);

  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグアンドドロップ操作が完了したときに呼ばれるメソッド
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      setItems(reorderedItems);


      try {
        // 新しい順序のアイテムリストをサーバーに送信
        await axios.post('/api/items/reorder', { items: reorderedItems });
      } catch (error) {
        process.env.NODE_ENV === 'development' ? console.error('Error fetching data:', error) : '';
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
        items={items}
        strategy={verticalListSortingStrategy}
      >
        
        {items.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {item.name}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default ItemList;