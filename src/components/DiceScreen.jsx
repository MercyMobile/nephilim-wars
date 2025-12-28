import React from 'react';

const DiceScreen = () => {
  return (
    // 'fixed inset-0' forces this div to cover the ENTIRE viewport, 
    // ignoring any padding or centering from the parent App.
    // 'z-40' ensures it sits on top of the background but below the global 'Back' button (z-50).
    <div className="fixed inset-0 z-40 bg-black w-full h-full">
      <iframe 
        src="/dice.html" 
        title="3D Dice Roller"
        className="w-full h-full border-none block"
        style={{ width: '100vw', height: '100vh' }} 
      />
    </div>
  );
};

export default DiceScreen;