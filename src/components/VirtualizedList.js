import React from 'react';
import { FixedSizeList as List } from 'react-window';

// Sample data
const data = Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`);

// Row component to render each item
const Row = ({ index, style }) => (
  <div style={style}>
    {data[index]}
  </div>
);

// Main component
const VirtualizedList = () => {
  return (
    <List
      height={400} // Height of the list
      itemCount={data.length} // Total number of items
      itemSize={35} // Height of each item
      width={300} // Width of the list
    >
      {Row}
    </List>
  );
};

export default VirtualizedList;