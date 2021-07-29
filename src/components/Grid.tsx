import React, { useContext } from 'react';

/**
 * immer.js is a very usefull library that allow us to work with immutable state 
 */
import produce from "immer";

import { GomContext } from '../context/GomContext';
import GridOutput from './GridOutput';


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

  let newUserGrid: number[][] = [];
  if (state.userGridSize) {
    /**
     * produce is the main function of immer.js and simply takes an initial state and a callback that defines
     * how the state should be mutated. In this case, 'gridCopy' is a copy of 'state.userGridSize' 
     * to which it makes all the intended update. Finally, it produces a new, immutable state with all the changes applied.
     */
    newUserGrid = produce(state.userGridSize, gridCopy => {
      for (let i = 0; i < state.numbRows; i++) {
        for (let k = 0; k < state.numbCols; k++) {
          let neighbors = 0;

          /**
           * When calculating the next generation you should follow these rules:
           *   - Any live cell with fewer than two live neighbours dies.
           *   - Any live cell with two or three live neighbours lives on to the next generation.
           *   - Any live cell with more than three live neighbours dies.
           *   - Any dead cell with exactly three live neighbours becomes a live cell.
           */

          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;
            if (newI >= 0 && newI < state.numbRows && newK >= 0 && newK < state.numbCols) {
              neighbors += state.userGridSize![newI][newK];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            gridCopy![i][k] = 0;
          } else if (state.userGridSize![i][k] === 0 && neighbors === 3) {
            gridCopy![i][k] = 1;
          }
        }
      }
    });
  }

  return (
    <>
      {state.userGridSize ? (
        <>
          <h3 className="grid-title">Current Generation loaded:</h3>
          <GridOutput userGrid={state.userGridSize} numbCols={state.numbCols} />

          {newUserGrid.length ? (
            <>
              <h3 className="grid-title">Next Generation generated:</h3>
              <GridOutput userGrid={newUserGrid} numbCols={state.numbCols} />
            </>
          ) : undefined}
        </>
      ) : undefined}
    </>
  );
};

export default Grid;