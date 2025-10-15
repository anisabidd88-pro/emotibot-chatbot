import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TextToText from './pages/TextToText';
import TextToImage from './pages/TextToImage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<TextToText />} />
        <Route path="/text-to-text" element={<TextToText />} />
        <Route path="/text-to-image" element={<TextToImage />} />
      </Routes>
    </div>
  );
}

export default App;