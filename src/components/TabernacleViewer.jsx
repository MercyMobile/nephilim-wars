import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-45);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // The 12 Stones of the Breastplate (Exodus 28)
  const breastplateStones = [
    { name: "Sardius", tribe: "Reuben", color: "bg-red-700" },
    { name: "Topaz", tribe: "Simeon", color: "bg-yellow-400" },
    { name: "Carbuncle", tribe: "Levi", color: "bg-red-900" },
    { name: "Emerald", tribe: "Judah", color: "bg-green-600" },
    { name: "Sapphire", tribe: "Issachar", color: "bg-blue-700" },
    { name: "Diamond", tribe: "Zebulun", color: "bg-slate-100 text-black" },
    { name: "Jacinth", tribe: "Dan", color: "bg-orange-500" },
    { name: "Agate", tribe: "Naphtali", color: "bg-stone-400" },
    { name: "Amethyst", tribe: "Gad", color: "bg-purple-600" },
    { name: "Beryl", tribe: "Asher", color: "bg-teal-500" },
    { name: "Onyx", tribe: "Joseph", color: "bg-black" },
    { name: "Jasper", tribe: "Benjamin", color: "bg-red-800" }
  ];

  const garmentData = [
    { part: "The Ephod", detail: "A vest of gold and blue, bearing two Onyx stones on the shoulders engraved with the names of the sons of Israel." },
    { part: "The Hoshen", detail: "The Breastplate of Judgment, doubled into a square (a perfect span), holding the Urim and Thummim." },
    { part: "The Blue Robe", detail: "Worn under the Ephod, with golden bells and pomegranates on the hem so the Priest's sound is heard in the Holy Place." }
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
    <div className="relative w-full h-[550px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex flex-col items-center justify-center perspective-1000 shadow-2xl">
      <div 
        className="relative w-[300px] md:w-[450px] h-64 transition-transform duration-1000 ease-out preserve-3d"
        style={{ transform: `rotateX(72deg) rotateZ(${rotation}deg) translateY(-30px)` }}
      >
        <div className="absolute inset-x-[-100%] inset-y-[-100%] bg-parchment-200/5 rounded-full border border-gold-600/10 backdrop-blur-sm shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-black rounded-full" style={{ left: `${15 + i * 6}%`, top: '48%' }} />
          ))}
        </div>

        {/* The Sanctuary Structure */}
        <div className="absolute inset-0 border-[3px] border-gold-500 bg-gold-900/60 preserve-3d shadow-[0_0_50px_rgba(212,175,55,0.3)]">
          {/* Internal Veil */}
          <div className="absolute left-[33.3%] inset-y-0 w-2 bg-gradient-to-b from-sacred-blue via-crimson to-sacred-blue" style={{ transform: 'translateZ(1px)' }}></div>
          {/* Holy of Holies Glow */}
          <div className="absolute left-0 inset-y-0 w-1/3 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/10 blur-3xl animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Golden Ratio Overlay */}
      <div className="absolute top-6 left-6 font-cinzel text-gold-500/80 p-3 border border-gold-900/40 bg-black/40 backdrop-blur-sm rounded">
        <p className="text-[10px] tracking-widest uppercase mb-1 underline decoration-gold-700">Divine Geometry</p>
        <p className="text-[11px] font-garamond italic text-parchment-200 leading-tight">
          "The Ark: 2.5 cubits length x 1.5 cubits width"<br/>
          φ Ratio: 1.666 (Approx. Golden Ratio 1.618)
        </p>
      </div>

      {/* Control HUD */}
      <div className="absolute bottom-10 flex items-center gap-6 bg-parchment-100 p-3 rounded-full border-2 border-gold-600 shadow-2xl">
        <button onClick={() => setRotation(r => r - 30)} className="text-parchment-900 hover:text-gold-700 font-cinzel text-[10px] font-bold px-3">LEFT</button>
        <button onClick={() => setIsOrbiting(!isOrbiting)} className={`font-unifraktur text-2xl px-4 transition-all ${isOrbiting ? 'text-crimson scale-125' : 'text-parchment-900'}`}>{isOrbiting ? 'S' : 'O'}</button>
        <button onClick={() => setRotation(r => r + 30)} className="text-parchment-900 hover:text-gold-700 font-cinzel text-[10px] font-bold px-3">RIGHT</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-parchment-900 selection:bg-gold-500/30">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-unifraktur text-6xl text-parchment-900 tracking-tight">The Mishkan</h1>
        <p className="font-cinzel text-xs tracking-[0.4em] text-gold-700 mt-2 uppercase italic">Pattern of the Heavenly Sanctuary</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 border-parchment-300 pb-4 lg:pb-0">
          {['sanctuary', 'garments', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`whitespace-nowrap lg:w-full text-left p-4 border-b-2 lg:border-b lg:border-l-2 transition-all font-cinzel text-xs tracking-widest ${
                activeView === tab ? 'border-gold-600 bg-gold-500/10 text-gold-800 lg:translate-x-2' : 'border-transparent lg:border-parchment-300 text-parchment-400'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 min-h-[600px]">
          {activeView === 'sanctuary' && <Tabernacle3D />}

          {activeView === 'garments' && (
            <div className="animate-fadeIn">
              <h2 className="font-cinzel text-gold-700 text-xl mb-6 uppercase tracking-[0.2em] text-center">The Hoshen of Judgment</h2>
              
              {/* Breastplate Visual */}
              <div className="max-w-sm mx-auto grid grid-cols-3 gap-3 bg-gold-900/10 p-4 rounded-lg border-2 border-gold-600 shadow-xl mb-10">
                {breastplateStones.map((stone, i) => (
                  <div key={i} className={`${stone.color} h-16 rounded shadow-[inset_0_0_15px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center border border-white/10 group cursor-default`}>
                    <span className="text-[8px] font-cinzel text-white/90 tracking-tighter uppercase opacity-0 group-hover:opacity-100 transition-opacity">{stone.tribe}</span>
                    <span className="text-[7px] text-white/50 font-garamond group-hover:hidden">{stone.name}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {garmentData.map((g, i) => (
                  <div key={i} className="bg-parchment-100/50 p-5 rounded border border-gold-500/10 shadow-sm">
                    <h3 className="font-cinzel text-gold-700 text-sm mb-2 underline decoration-gold-500/30">{g.part}</h3>
                    <p className="text-sm text-parchment-900 leading-relaxed italic opacity-80">{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-8 bg-parchment-900 p-10 rounded-xl text-parchment-100 border-l-[12px] border-gold-600 shadow-2xl">
               <h2 className="font-cinzel text-gold-400 text-3xl uppercase tracking-widest border-b border-gold-900 pb-4">Tel Shiloh Excavations</h2>
               <div className="space-y-6 text-parchment-300 leading-loose">
                 <p className="text-lg italic">The physical record at Shiloh mirrors the liturgical requirements of the Torah with startling precision.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div className="bg-black/40 p-6 rounded border border-gold-900/50 hover:bg-black/60 transition-colors">
                      <h4 className="text-gold-500 font-cinzel text-xs mb-3 tracking-widest uppercase">The Sacrificial Record</h4>
                      <p className="text-xs text-parchment-400">Analysis of bone remains shows a high concentration of the "Right Shoulder"—the priestly portion mandated in Leviticus.</p>
                    </div>
                    <div className="bg-black/40 p-6 rounded border border-gold-900/50 hover:bg-black/60 transition-colors">
                      <h4 className="text-gold-500 font-cinzel text-xs mb-3 tracking-widest uppercase">The Rock Footprint</h4>
                      <p className="text-xs text-parchment-400">Excavations revealed rock-cut post holes at the 100-cubit courtyard perimeter on the northern plateau.</p>
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