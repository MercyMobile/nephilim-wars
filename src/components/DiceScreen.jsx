import React from 'react';

const DiceScreen = () => {
  return (
    <div className="fixed inset-0 z-40 bg-black w-full h-full">
      <iframe 
        src="/dice.html"
        sandbox="allow-scripts allow-same-origin allow-forms"
        title="3D Dice Roller"
        className="w-full h-full border-none block"
        style={{ width: '100vw', height: '100vh' }} 
      />
    </div>
  );
};

export default DiceScreen;
