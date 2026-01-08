import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(0);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // Auto-orbit effect for the 3D view
  useEffect(() => {
    let interval;
    if (isOrbiting) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isOrbiting]);

  const Tabernacle3D = () => (
    <div className="relative w-full h-[500px] bg-[#050505] rounded-xl border border-amber-900/20 overflow-hidden flex flex-col items-center justify-center perspective-[1000px]">
      {/* 3D Scene Container */}
      <div 
        className="relative w-96 h-48 transition-transform duration-700 ease-out preserve-3d"
        style={{ transform: `rotateX(60deg) rotateZ(${rotation}deg)` }}
      >
        {/* The Bedrock (Shiloh Plateau) */}
        <div className="absolute inset-x-[-50%] inset-y-[-50%] bg-[radial-gradient(circle_at_center,_#1c1917_0%,_#000_70%)] border border-stone-800/50 rounded-full">
           {/* Archaeological Post Holes (The Ghosting) */}
           {[...Array(10)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-2 h-2 bg-black rounded-full border border-amber-900/30"
               style={{ 
                 left: `${10 + i * 8}%`, 
                 top: '45%',
                 boxShadow: '0 0 10px rgba(0,0,0,0.8) inset' 
               }}
             />
           ))}
        </div>

        {/* The Sanctuary Structure */}
        <div className="absolute inset-0 border-2 border-amber-600/30 bg-amber-950/20 preserve-3d shadow-[0_0_30px_rgba(217,119,6,0.1)]">
          {/* Internal Veil (Parochet) */}
          <div 
            className="absolute left-[33%] inset-y-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-red-600 opacity-60"
            style={{ transform: 'translateZ(20px)' }}
          ></div>
          
          {/* Holy of Holies Cube */}
          <div className="absolute left-0 inset-y-0 w-1/3 bg-amber-500/10 border-r border-amber-500/20"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 flex gap-4">
        <button 
          onClick={() => setRotation(prev => prev - 15)}
          className="px-4 py-2 bg-stone-900 border border-amber-900/50 text-amber-500 text-xs font-cinzel hover:bg-amber-900/20 transition-colors"
        >
          Rotate Left
        </button>
        <button 
          onClick={() => setIsOrbiting(!isOrbiting)}
          className={`px-4 py-2 border text-xs font-cinzel transition-all ${isOrbiting ? 'bg-amber-600 text-white border-amber-400' : 'bg-stone-900 text-amber-500 border-amber-900/50'}`}
        >
          {isOrbiting ? 'Stop Orbit' : 'Auto Orbit'}
        </button>
        <button 
          onClick={() => setRotation(prev => prev + 15)}
          className="px-4 py-2 bg-stone-900 border border-amber-900/50 text-amber-500 text-xs font-cinzel hover:bg-amber-900/20 transition-colors"
        >
          Rotate Right
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-12 bg-black min-h-screen text-stone-300 font-serif">
      <header className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-cinzel tracking-[0.5em] text-amber-500">MISHKAN</h1>
        <div className="h-[1px] w-24 bg-amber-600 mx-auto mt-4 opacity-50"></div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="flex flex-col gap-2">
          {['sanctuary', 'elements', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`p-4 text-left font-cinzel text-sm border-l-2 transition-all ${activeView === tab ? 'border-amber-500 bg-stone-900 text-amber-400' : 'border-stone-800 text-stone-500 hover:border-stone-600'}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 min-h-[600px]">
          {activeView === 'sanctuary' && <Tabernacle3D />}

          {activeView === 'elements' && (
            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "The Ark", ref: "Exodus 25:10", icon: "👑", desc: "Acacia and Gold. The seat of the Presence." },
                { name: "The Menorah", ref: "Exodus 25:31", icon: "🔥", desc: "Seven branches, beaten gold, light of the world." },
                { name: "The Table", ref: "Exodus 25:23", icon: "🍞", desc: "Bread of the presence, twelve tribes represented." },
                { name: "The Altar", ref: "Exodus 30:1", icon: "☁️", desc: "Sweet incense, the rising prayers of the people." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-stone-900/50 border border-amber-900/20 rounded group hover:border-amber-500/50">
                  <div className="flex justify-between mb-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[10px] text-amber-600 font-bold">{item.ref}</span>
                  </div>
                  <h3 className="text-lg font-cinzel text-amber-200">{item.name}</h3>
                  <p className="text-xs text-stone-500 italic mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-6">
              <div className="border-l-4 border-amber-600 pl-4 py-1">
                <h2 className="text-2xl font-cinzel text-amber-500 uppercase tracking-widest">The Shiloh Horizon</h2>
                <p className="text-stone-400 text-xs italic">"For the place where I caused My Name to dwell at the first..."</p>
              </div>
              <div className="bg-stone-900/50 p-6 rounded-lg border border-amber-900/20">
                <h3 className="text-amber-200 font-cinzel mb-2">The Pomegranate of the Sanctuary</h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  Discovered at Tel Shiloh, this artifact dates to the late Bronze/Early Iron Age. Consistent with the hem of the High Priest's robe.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 border border-stone-800 rounded">
                  <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">Architectural Ghosting</h4>
                  <p className="text-xs text-stone-400">The rock-cut post holes at Shiloh suggest a semi-permanent camp for the sacred tent.</p>
                </div>
                <div className="p-4 bg-black/40 border border-stone-800 rounded">
                  <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">The Faunal Record</h4>
                  <p className="text-xs text-stone-400">High concentrations of right-side sacrificial bones confirm Levitical dietary adherence.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabernacleViewer;