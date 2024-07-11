import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    alert('あああがクリックされました');
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <span 
          {...attributes} 
          {...listeners} 
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={handleClick} // クリックイベントを追加
          style={{ cursor: 'default' }} // ポインターを普通の矢印に変更
        >
          あああ
        </span>
        {children}
      </div>
    </>
  );
};