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

          // find out how many living neighbours a given cell has
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;

            if (newI >= 0 && newI < state.numbRows && newK >= 0 && newK < state.numbCols) {
              neighbors += state.userGridSize![newI][newK];
            }
          });

          /**
           * Once we have found how many living neighbours a cell has, we move on to assign a new status: 
           *   - if a cell has less than 2 or more than 3 living neighbours then its status will become 0, i.e. dead
           *   - If a cell is dead and has 3 living neighbours then its status will become 1, i.e. alive
           */
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