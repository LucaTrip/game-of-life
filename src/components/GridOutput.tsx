/**
 * this component is only responsible for displaying an input matrix
 */
import React from 'react';

import { GridOutputProp } from '../models/models';

const GridOutput: React.FC<GridOutputProp> = ({ userGrid, numbCols }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numbCols}, 20px)`
      }}
    >
      {userGrid.map((rows, rowIndex) =>
        rows.map((col, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: 20,
              height: 20,
              backgroundColor: userGrid[rowIndex][colIndex] ? "red" : "black",
              border: "1px solid white"
            }}
          />
        ))
      )}
    </div>
  );
}

export default GridOutput;