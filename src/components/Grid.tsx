import React, { useContext, useEffect, useState } from 'react';
import { GomContext } from '../context/GomContext';

import produce from "immer";

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateNewGrid = (g: any, numbRows: number, numbCols: number) => produce(g, (gridCopy: number[][]) => {
  for (let i = 0; i < numbRows; i++) {
    for (let k = 0; k < numbCols; k++) {
      let neighbors = 0;
      operations.forEach(([x, y]) => {
        const newI = i + x;
        const newK = k + y;
        if (newI >= 0 && newI < numbRows && newK >= 0 && newK < numbCols) {
          neighbors += g[newI][newK];
        }
      });

      if (neighbors < 2 || neighbors > 3) {
        gridCopy[i][k] = 0;
      } else if (g[i][k] === 0 && neighbors === 3) {
        gridCopy[i][k] = 1;
      }
    }
  }
});

const Grid = () => {
  const { state } = useContext(GomContext);
  const [newUserGrid, setNewUserGrid] = useState(state.userGridSize);

  console.log("GRID", state, newUserGrid);

  useEffect(() => {
    setNewUserGrid(() => {
      console.log("dsadsada", state.userGridSize);
      return produce(state.userGridSize, (gridCopy: any) => {
        for (let i = 0; i < state.numbRows; i++) {
          for (let k = 0; k < state.numbCols; k++) {
            let neighbors = 0;

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < state.numbRows && newK >= 0 && newK < state.numbCols) {
                neighbors += state.userGridSize![newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (state.userGridSize![i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
  }, [state.userGridSize]);

  return (
    <>
      {state.userGridSize ? (
        <>
          <h4>User initial state:</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${state.numbCols}, 20px)`
            }}
          >
            {state.userGridSize.map((rows, rowIndex) =>
              rows.map((col, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: state.userGridSize![rowIndex][colIndex] ? "purple" : "black",
                    border: "1px solid white"
                  }}
                />
              ))
            )}
          </div>

          {newUserGrid ? (
            <>
              <h4>Output from initial state:</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${state.numbCols}, 20px)`
                }}
              >
                {newUserGrid.map((rows, rowIndex) =>
                  rows.map((col, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: newUserGrid[rowIndex][colIndex] ? "purple" : "black",
                        border: "1px solid white"
                      }}
                    />
                  ))
                )}
              </div>
            </>
          ) : undefined}
        </>
      ) : undefined}
    </>
  );
};

export default Grid;