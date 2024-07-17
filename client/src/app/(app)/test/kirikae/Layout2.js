import React, { useState } from 'react';

const Layout2 = () => {
  const [colWidth, setColWidth] = useState(100);

  const handleMouseMove = (e) => {
    setColWidth(e.clientX);
  };

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${colWidth}px)`, gap: '10px' }}
      onMouseMove={handleMouseMove}
    >
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </div>
  );
};

export default Layout2;