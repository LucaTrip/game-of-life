import React from "react";
import './App.css';

import FileUpload from './components/FileUpload';
import Grid from './components/Grid';

import { GomProvider } from './context/GomContext';

const App = () => {
  return (
    <GomProvider>
      <div className="main-continer">
        <h1 className="main-title">Game of Life</h1>
        <FileUpload />
        <Grid />
      </div>
    </GomProvider>
  );
};

export default App;