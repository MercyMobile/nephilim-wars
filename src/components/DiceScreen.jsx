import React from 'react';

const DiceScreen = () => {
  return (
    <div className="fixed inset-0 z-40 bg-black w-full h-full">
      <iframe 
        src="/dice.html"
        title="3D Dice Roller"
        className="w-full h-full border-none block"
        style={{ width: '100vw', height: '100vh' }}
        allow="scripts"
      />
    </div>
  );
};

export default DiceScreen;