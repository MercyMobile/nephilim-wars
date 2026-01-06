// src/App.jsx
import React from 'react';
import './App.css';

// Placeholder component for TabernacleViewer
const TabernacleViewer = () => {
  return (
    <div className="tabernacle-viewer">
      <h1>Humble Tabernacle Viewer</h1>
      <p>This is a placeholder for the TabernacleViewer component.</p>
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <TabernacleViewer />
    </div>
  );
}

export default App;