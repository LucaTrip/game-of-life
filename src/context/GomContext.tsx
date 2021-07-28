import React, { createContext, Dispatch, useReducer } from 'react';
import { ActionMap, Types } from '../utils/reducers';

interface InitialStateType {
  userGridSize: null | number[][];
  numbRows: number;
  numbCols: number;
  currentGeneration: string;
};

type GomPayload = {
  [Types.generateUserInputGrid]: {
    currentGeneration: string,
    rowsNumb: number,
    colsNumb: number,
    newPopulationState: number[][]
  };
};

const initialState = {
  userGridSize: null,
  numbRows: 0,
  numbCols: 0,
  currentGeneration: ''
};

type GomActions = ActionMap<GomPayload>[keyof ActionMap<GomPayload>];

const GomContext = createContext<{ state: InitialStateType, dispatch: Dispatch<GomActions> }>({ state: initialState, dispatch: () => null });

const gomReducer = (state: InitialStateType, action: GomActions) => {
  switch (action.type) {
    case Types.generateUserInputGrid:
      let numbRows = action.payload!.rowsNumb;
      let numbCols = action.payload!.colsNumb;
      let userGridSize = action.payload!.newPopulationState;
      let currentGeneration = action.payload!.currentGeneration;

      return { ...state, numbCols, numbRows, userGridSize, currentGeneration };
    default:
      return state;
  }
};

const GomProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(gomReducer, initialState);

  return (
    <GomContext.Provider value={{ state, dispatch }}>
      {children}
    </GomContext.Provider>
  );
};

export { GomProvider, GomContext };