import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-45);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // Safety Data Arrays
  const elementsData = [
    { name: "The Ark", ref: "Exodus 25:10", icon: "👑", desc: "Acacia and Gold. The seat of the Presence." },
    { name: "The Menorah", ref: "Exodus 25:31", icon: "🔥", desc: "Seven branches, beaten gold, light of the world." },
    { name: "The Table", ref: "Exodus 25:23", icon: "🍞", desc: "Bread of the presence, twelve tribes represented." },
    { name: "The Altar", ref: "Exodus 30:1", icon: "☁️", desc: "Sweet incense, the rising prayers of the people." }
  ];

  useEffect(() => {
    let interval;
    if (isOrbiting) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isOrbiting]);

  const Tabernacle3D = () => (
    <div className="relative w-full h-[550px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex flex-col items-center justify-center perspective-1000 shadow-inner">
      <div 
        className="relative w-[300px] md:w-[400px] h-64 transition-transform duration-1000 ease-out preserve-3d"
        style={{ transform: `rotateX(65deg) rotateZ(${rotation}deg)` }}
      >
        {/* Ground Plane */}
        <div className="absolute inset-x-[-100%] inset-y-[-100%] bg-parchment-200/5 rounded-full border border-gold-600/10 backdrop-blur-sm">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-black rounded-full" style={{ left: `${15 + i * 6}%`, top: '48%' }} />
          ))}
        </div>

        {/* Structure */}
        <div className="absolute inset-0 border-2 border-gold-500 bg-gold-900/40 preserve-3d">
          <div 
            className="absolute left-[33.3%] inset-y-0 w-1.5 bg-gradient-to-b from-sacred-blue via-crimson to-sacred-blue"
            style={{ transform: 'translateZ(1px)' }}
          ></div>
          <div className="absolute left-0 inset-y-0 w-1/3 bg-white/5 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 blur-2xl animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      {/* HUD */}
      <div className="absolute bottom-8 flex items-center gap-6 bg-parchment-100/90 p-3 md:p-4 rounded-full border border-gold-500 shadow-2xl backdrop-blur-md">
        <button onClick={() => setRotation(r => r - 20)} className="text-parchment-900 hover:text-gold-600 font-cinzel text-[10px] md:text-xs px-2">⇠ ROTATE</button>
        <button 
          onClick={() => setIsOrbiting(!isOrbiting)} 
          className={`font-unifraktur text-xl px-4 transition-colors ${isOrbiting ? 'text-crimson' : 'text-parchment-900'}`}
        >
          {isOrbiting ? 'S' : 'O'}
        </button>
        <button onClick={() => setRotation(r => r + 20)} className="text-parchment-900 hover:text-gold-600 font-cinzel text-[10px] md:text-xs px-2">ROTATE ⇢</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-parchment-900">
      <header className="max-w-6xl mx-auto text-center mb-10 md:mb-16">
        <h1 className="font-unifraktur text-4xl md:text-6xl text-parchment-900">The Mishkan</h1>
        <p className="font-cinzel text-[10px] tracking-[0.3em] text-gold-700 mt-2 uppercase italic">A Pattern Shown Upon the Mountain</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 md:gap-4 border-b lg:border-b-0 border-parchment-300 pb-4 lg:pb-0">
          {['sanctuary', 'elements', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`whitespace-nowrap lg:w-full text-left p-2 md:p-4 border-b-2 lg:border-b lg:border-l-2 transition-all font-cinzel text-[10px] md:text-sm ${
                activeView === tab ? 'border-gold-500 text-gold-700 lg:translate-x-2' : 'border-transparent lg:border-parchment-300 text-parchment-400'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3">
          {activeView === 'sanctuary' && <Tabernacle3D />}
          
          {activeView === 'elements' && (
            <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               {elementsData.map((item, i) => (
                <div key={i} className="p-4 md:p-6 bg-parchment-100 border border-gold-500/20 rounded shadow-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-bold text-gold-600">{item.ref}</span>
                  </div>
                  <h3 className="font-cinzel text-gold-700 border-b border-gold-500/10 pb-1 mb-2">{item.name}</h3>
                  <p className="text-xs md:text-sm text-parchment-800 leading-relaxed italic">{item.desc}</p>
                </div>
               ))}
            </div>
          )}

          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-6 bg-parchment-900 p-6 md:p-8 rounded-lg text-parchment-100 border-l-4 md:border-l-8 border-gold-600">
               <h2 className="font-cinzel text-gold-400 text-xl md:text-2xl uppercase tracking-widest">Evidence at Tel Shiloh</h2>
               <div className="space-y-4 mt-4">
                 <p className="text-parchment-300 italic text-sm md:text-base leading-relaxed">
                   The excavations at Ancient Shiloh reveal a platform consistent with the Tabernacle's dimensions.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="border border-gold-500/30 p-4 rounded bg-black/20">
                      <h4 className="text-gold-500 font-cinzel text-xs mb-2">The Faunal Record</h4>
                      <p className="text-[10px] text-parchment-400">Right-side sacrificial bones confirm Levitical adherence.</p>
                    </div>
                    <div className="border border-gold-500/30 p-4 rounded bg-black/20">
                      <h4 className="text-gold-500 font-cinzel text-xs mb-2">The Plateau</h4>
                      <p className="text-[10px] text-parchment-400">Northern summit leveling matches the 100-cubit courtyard footprint.</p>
                    </div>
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