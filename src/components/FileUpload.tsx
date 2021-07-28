import React, { useRef, useContext } from 'react';

import { GomContext } from '../context/GomContext';
import { Types } from '../utils/reducers';

/**
 * This function read the file selected by the user, process it and then dispatch the data 
 * to the global context
 */
const readFile = (fileToRead: File, dispatch: Function) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    let fileResult = '';

    if (e && e.target) {
      fileResult = e.target.result as string;
    }

    if (fileResult.length) {
      const resultTextArray = fileResult.split('\n');
      const rowsColsArray = resultTextArray[1].split(" ");

      let currentGeneration = resultTextArray[0],
        rowsNumb = parseInt(rowsColsArray[0]),
        colsNumb = parseInt(rowsColsArray[1]),
        populationState = [];

      for (let i = 2; i < resultTextArray.length; i++) {
        let currentItem = resultTextArray[i];
        if (currentItem.length) {
          populationState.push(currentItem);
        }
      }

      let newPopulationState: any = [];
      for (let population of populationState) {
        newPopulationState.push(population.split(''));
      }

      for (let i = 0; i < newPopulationState.length; i++) {
        for (let k = 0; k < newPopulationState[i].length; k++) {
          if (newPopulationState[i][k] === '.') {
            newPopulationState[i][k] = 0;
          } else {
            newPopulationState[i][k] = 1;
          }
        }
      }

      dispatch({ type: Types.generateUserInputGrid, payload: { currentGeneration, rowsNumb, colsNumb, newPopulationState } });
    } else {
      alert("The uploaded file is empty");
    }
  };

  reader.onerror = (e) => {
    alert("Failed to read file!\n\n" + reader.error);
    reader.abort();
  };

  reader.readAsText(fileToRead);
}

const FileUpload = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useContext(GomContext);

  /**
   * Handle the file selected by the user and if the file has the correct fileType (.txt)
   * go on, otherwise raise an error
   */
  const handleFileUpload = (e: any) => {
    const { files } = e.target;

    if (files && files.length) {
      const filename = files[0].name;

      let parts = filename.split(".");
      const fileType = parts[parts.length - 1];

      if (fileType === 'txt') {
        readFile(files[0], dispatch);
      } else {
        alert("The file type must be '.txt'");
      }
    }
  };

  const onSelectInput = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  const onClearDataSet = () => {
    dispatch({ type: Types.clearAll });
  }

  return (
    <>
      <div style={{ display: state.userGridSize ? 'none' : 'block' }}>
        <input
          style={{ display: "none" }}
          ref={inputFile}
          onChange={handleFileUpload}
          type="file"
        />
        <button type="button" className="pixelated-button" onClick={onSelectInput}>
          Upload
        </button>
      </div>

      <div style={{ display: state.userGridSize ? 'block' : 'none', marginBottom: 20 }}>
        <button type="button" className="pixelated-button" onClick={onClearDataSet}>
          Clear
        </button>
      </div>
    </>
  );
};

export default FileUpload;