import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-30);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // --- DATA PRESETS ---
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

  // --- ORBIT CONTROLS ---
  useEffect(() => {
    let interval;
    if (isOrbiting) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isOrbiting]);

  // --- 3D SUB-COMPONENT ---
  const Tabernacle3D = () => (
    <div className="relative w-full h-[500px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex flex-col items-center justify-center perspective-1000 shadow-2xl">
      {/* Ground Plane (Sand) */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#c2b280] to-[#e6d8b6] opacity-10 blur-md"></div>
      
      <div 
        className="relative w-[200px] h-[120px] transition-transform duration-1000 ease-out preserve-3d"
        style={{ transform: `rotateX(-10deg) rotateY(${rotation}deg)` }}
      >
        {/* -- THE STRUCTURE (Constructing the Box) -- */}
        
        {/* Floor (Silver Sockets) */}
        <div className="absolute inset-0 bg-stone-300 opacity-80" 
             style={{ transform: 'rotateX(90deg) translateZ(-60px)', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}></div>

        {/* Ceiling (Ram Skins/Badger Skins - Red/Brown) */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900 to-red-900" 
             style={{ transform: 'rotateX(90deg) translateZ(60px)' }}></div>

        {/* North Wall (Gold Boards) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700"
             style={{ 
               transform: 'rotateY(0deg) translateZ(-50px)', 
               backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.3) 20px)' 
             }}>
        </div>

        {/* South Wall (Gold Boards) */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700"
             style={{ 
               transform: 'rotateY(180deg) translateZ(-50px)',
               backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.3) 20px)' 
             }}>
        </div>

        {/* West Wall (Back - Gold Boards) */}
        <div className="absolute inset-y-0 left-0 w-[100px] h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 origin-left"
             style={{ 
               transform: 'rotateY(90deg) translateZ(-100px) translateX(-50px)',
               backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.3) 20px)' 
             }}>
        </div>

        {/* East Wall (THE VEIL / ENTRANCE) */}
        <div className="absolute inset-y-0 right-0 w-[100px] h-full origin-right flex items-center justify-center overflow-hidden"
             style={{ transform: 'rotateY(-90deg) translateZ(-100px) translateX(50px)' }}>
            <div className="w-full h-full bg-sacred-blue opacity-90 relative">
               {/* Veil Texture */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 opacity-80"></div>
               {/* Embroidery effect */}
               <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-400 to-transparent scale-50"></div>
            </div>
        </div>

        {/* Pillar Overlay (Visual Depth) */}
        <div className="absolute -left-2 -top-2 -bottom-2 w-4 bg-gradient-to-r from-amber-700 to-amber-900 rounded-full" style={{ transform: 'translateZ(55px)' }}></div>
        <div className="absolute -right-2 -top-2 -bottom-2 w-4 bg-gradient-to-r from-amber-700 to-amber-900 rounded-full" style={{ transform: 'translateZ(55px)' }}></div>

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
      <div className="absolute bottom-10 flex items-center gap-6 bg-parchment-100 p-3 rounded-full border-2 border-gold-600 shadow-2xl z-10">
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
          {['sanctuary', 'elements', 'garments', 'archaeology'].map(tab => (
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
          
          {/* VIEW: SANCTUARY (3D) */}
          {activeView === 'sanctuary' && <Tabernacle3D />}

          {/* VIEW: ELEMENTS (Structural Details) */}
          {activeView === 'elements' && (
            <div className="animate-fadeIn space-y-6">
                <div className="bg-parchment-100 p-6 rounded border-l-4 border-gold-600 shadow-sm">
                    <h2 className="font-cinzel text-xl text-gold-800 mb-2">The Boards (Ha'Kerashim)</h2>
                    <p className="text-sm leading-relaxed">
                        Made of Acacia wood standing upright. Ten cubits (15ft) high and 1.5 cubits wide. 
                        Each board was overlaid with gold and possessed two "tenons" (hands) for stability.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-800 text-parchment-200 p-4 rounded border border-stone-600">
                        <h3 className="font-cinzel text-stone-400 text-xs tracking-widest mb-2">THE SOCKETS</h3>
                        <p className="text-xs">Each board rested on two sockets of solid silver (Adanim), created from the redemption money (half-shekel) of the census.</p>
                    </div>
                    <div className="bg-amber-900/90 text-parchment-200 p-4 rounded border border-amber-700">
                        <h3 className="font-cinzel text-gold-400 text-xs tracking-widest mb-2">THE BARS</h3>
                        <p className="text-xs">Five bars of acacia wood overlaid with gold held the structure together. The center bar (The Shamash) ran through the midst of the boards from end to end.</p>
                    </div>
                </div>
            </div>
          )}

          {/* VIEW: GARMENTS */}
          {activeView === 'garments' && (
            <div className="animate-fadeIn">
              <h2 className="font-cinzel text-gold-700 text-xl mb-6 uppercase tracking-[0.2em] text-center">The Hoshen of Judgment</h2>
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

          {/* VIEW: ARCHAEOLOGY (Restored Text) */}
          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-6">
                <div className="border-l-4 border-amber-600 pl-4 py-1">
                <h2 className="text-2xl font-cinzel text-amber-700 uppercase tracking-widest">The Shiloh Horizon</h2>
                <p className="text-stone-500 text-xs italic">"For the place where I caused My Name to dwell at the first..."</p>
                </div>

                {/* Featured Artifact: The Ceramic Pomegranate */}
                <div className="bg-stone-800/90 p-6 rounded-lg border border-amber-900/20 relative overflow-hidden text-parchment-200 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                    <h3 className="text-amber-200 font-cinzel mb-2">The Pomegranate of the Sanctuary</h3>
                    <p className="text-sm text-stone-300 leading-relaxed">
                        Discovered at Tel Shiloh, this artifact dates to the late Bronze/Early Iron Age. In the Torah, pomegranates were symbols of fruitfulness and were woven into the High Priest’s garments. Finding this in a cultic context at Shiloh bridges the gap between the nomadic Tabernacle and the eventual Temple.
                    </p>
                    </div>
                    <div className="w-20 h-20 bg-amber-900/10 border border-amber-500/30 rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    🍎
                    </div>
                </div>
                </div>

                {/* The Footprint Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-parchment-100">
                <div className="p-4 bg-black/60 border border-stone-800 rounded">
                    <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">Architectural Ghosting</h4>
                    <p className="text-xs text-stone-400">
                    The northern plateau is the only leveled area at Shiloh large enough for the 100-cubit courtyard. The presence of rock-cut post holes suggests a "semi-permanent" setup where the Tabernacle stood for over 300 years.
                    </p>
                </div>
                <div className="p-4 bg-black/60 border border-stone-800 rounded">
                    <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">The Faunal Record</h4>
                    <p className="text-xs text-stone-400">
                    Excavations in 2017–2023 uncovered thousands of sacrificial remains. The disproportionate amount of right-side bones confirms that the dietary laws of the Priesthood were strictly observed at this site.
                    </p>
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