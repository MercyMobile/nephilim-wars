import React from 'react';

const CreatorScreen = () => {
  return (
    <div className="fixed inset-0 z-40 bg-stone-900 w-full h-full">
      <iframe 
        src="/creator.html"  // Remove the token parameter
        title="Character Creator"
        className="w-full h-full border-none block"
        style={{ width: '100vw', height: '100vh' }} 
      />
    </div>
  );
};

export default CreatorScreen;