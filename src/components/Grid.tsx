import React, { useContext, useEffect, useState } from 'react';
import { GomContext } from '../context/GomContext';

import produce from "immer";

/**
 * This array is a fundamental part because it defines the eight operations that need to be done.
 * Given a row that does not change, we move around it to study its neighbours, 
 * and consequently work out whether to put the 'alive' or 'dead' status on the neighbouring cell.
 */
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

const Grid = () => {
  const { state } = useContext(GomContext); // this is a react hook that permit me to use the 'GomContext'
  /**
   * This is a react hook that permit me to assign a 'newUserGrid' variable a certain value.
   * The setter function 'setNewUserGrid' allow us to set a new value for the variable 'newUserGrid'
   */
  const [newUserGrid, setNewUserGrid] = useState(state.userGridSize);

  useEffect(() => {
    setNewUserGrid(() => {
      return produce(state.userGridSize, gridCopy => {
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

            /**
             * When calculating the next generation you should follow these rules:
             *   - Any live cell with fewer than two live neighbours dies.
             *   - Any live cell with two or three live neighbours lives on to the next generation.
             *   - Any live cell with more than three live neighbours dies.
             *   - Any dead cell with exactly three live neighbours becomes a live cell.
             */

            if (neighbors < 2 || neighbors > 3) {
              gridCopy![i][k] = 0;
            } else if (state.userGridSize![i][k] === 0 && neighbors === 3) {
              gridCopy![i][k] = 1;
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
          <h3 className="grid-title">Current Generation loaded:</h3>
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
                    backgroundColor: state.userGridSize![rowIndex][colIndex] ? "red" : "black",
                    border: "1px solid white"
                  }}
                />
              ))
            )}
          </div>

          {newUserGrid ? (
            <>
              <h3 className="grid-title">Next Generation generated:</h3>
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
                        backgroundColor: newUserGrid[rowIndex][colIndex] ? "red" : "black",
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