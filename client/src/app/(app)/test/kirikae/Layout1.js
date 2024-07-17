import React, { useState } from 'react';

const Layout1 = () => {
  const [rowHeight, setRowHeight] = useState(100);

  const handleMouseMove = (e) => {
    setRowHeight(e.clientY);
  };

  return (
    <div
      style={{ display: 'grid', gridTemplateRows: `repeat(3, ${rowHeight}px)`, gap: '10px' }}
      onMouseMove={handleMouseMove}
    >
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </div>
  );
};

export default Layout1;