import React from 'react';

const CreatorScreen = () => {
  const token = import.meta.env.VITE_HF_TOKEN;
  
  return (
    <div className="fixed inset-0 z-40 bg-stone-900 w-full h-full">
      <iframe 
        src={`/creator.html?token=${token}`}
        title="Character Creator"
        className="w-full h-full border-none block"
        style={{ width: '100vw', height: '100vh' }} 
      />
    </div>
  );
};

export default CreatorScreen;