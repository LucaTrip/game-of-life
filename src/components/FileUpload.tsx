import React, { useRef, useContext } from 'react';

import { GomContext } from '../context/GomContext';
import { Types } from '../utils/reducers';

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

      // if (!Number.isNaN(rowsNumb) && Number.isNaN(colsNumb))

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
  console.log("EIIII", state)

  const handleFileUpload = (e: any) => {
    const { files } = e.target;

    if (files && files.length) {
      const filename = files[0].name;

      let parts = filename.split(".");
      const fileType = parts[parts.length - 1];

      if (fileType === 'txt') {
        console.log("dsdsasd", files[0]);
        readFile(files[0], dispatch);
      } else {
        alert("The file type must be '.txt'");
      }
    }
  };

  const onButtonClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  return (
    <div style={state.userGridSize ? { display: 'none' } : { display: 'block' }}>
      <input
        style={{ display: "none" }}
        // accept=".txt"
        ref={inputFile}
        onChange={handleFileUpload}
        type="file"
      />
      <button type="button" className="button" onClick={onButtonClick}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;