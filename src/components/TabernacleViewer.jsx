import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-30);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // --- DATA PRESETS (UPDATED CONTENT) ---
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
    { part: "The Ephod", detail: "Basically a bulletproof vest of gold thread and blue wool. It held two massive Onyx stones on the shoulders—literally carrying the weight of the tribes." },
    { part: "The Hoshen (Breastplate)", detail: "The centerpiece. A 'tech' pouch containing the Urim and Thummim (Lights and Perfections) used for binary decision making with God." },
    { part: "The Sound", detail: "Golden bells on the hem. If the bells stopped ringing while he was inside, the people outside knew something had gone terribly wrong." }
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
  const Tabernacle3D = () => {
    // FIXED DIMENSIONS (Scale: 10px = 1 cubit)
    // The Structure is 30 cubits (300px) LONG x 10 cubits (100px) WIDE
    const L = 300; // Length (X axis)
    const W = 100; // Width (Z axis)
    const H = 100; // Height (Y axis)

    return (
      <div className="relative w-full h-[500px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex flex-col items-center justify-center perspective-1000 shadow-2xl">
        {/* Ground Plane (Sand) */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#c2b280] to-[#e6d8b6] opacity-10 blur-md"></div>
        
        {/* ROTATION CONTAINER */}
        <div 
          className="relative preserve-3d transition-transform duration-100 ease-linear"
          style={{ 
            width: `${L}px`, 
            height: `${H}px`,
            transform: `rotateX(-20deg) rotateY(${rotation}deg)` 
          }}
        >
          {/* 1. FLOOR (Silver Sockets) 
              Rotated X 90deg to lie flat. 
              Translate Z moves it "down" (relative to center). 
          */}
          <div className="absolute inset-0 bg-stone-300 opacity-90 border border-stone-400"
               style={{ 
                 width: `${L}px`, 
                 height: `${W}px`,
                 transform: `rotateX(90deg) translateZ(${H/2}px)`,
                 boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
               }}>
               {/* Socket Grid */}
               <div className="w-full h-full opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_29px,#000_30px)]"></div>
          </div>

          {/* 2. ROOF (Ram Skins - Red) 
              Rotated X -90deg to lie flat on top.
          */}
          <div className="absolute inset-0 bg-red-900 border border-red-950"
               style={{ 
                 width: `${L}px`, 
                 height: `${W}px`,
                 transform: `rotateX(-90deg) translateZ(${H/2}px)`
               }}>
          </div>

          {/* 3. NORTH WALL (Long Side)
              Face is 300x100. Pushed "Back" in Z depth by half the WIDTH (50px).
              We rotate Y 180 so the "front" of the div faces inward (or outward depending on preference).
              Let's keep it simple: TranslateZ(-50px) pushes it away from camera.
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-700"
               style={{ 
                 width: `${L}px`, 
                 height: `${H}px`,
                 transform: `translateZ(-${W/2}px)`,
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 15px)'
               }}>
          </div>

          {/* 4. SOUTH WALL (Long Side)
              Face is 300x100. Pushed "Forward" in Z depth by half the WIDTH (50px).
          */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-700"
               style={{ 
                 width: `${L}px`, 
                 height: `${H}px`,
                 transform: `translateZ(${W/2}px)`,
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 15px)'
               }}>
          </div>

          {/* 5. WEST WALL (The Rear End)
              Face is 100x100 (Width x Height).
              Needs to be rotated Y 90deg to face sideways.
              Then pushed to the Left (negative X) by half the LENGTH (150px).
          */}
          <div className="absolute top-0 left-0 bg-gradient-to-b from-yellow-600 via-yellow-500 to-yellow-700"
               style={{ 
                 width: `${W}px`, 
                 height: `${H}px`,
                 transformOrigin: 'center',
                 transform: `rotateY(-90deg) translateZ(${L/2}px)`,
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 15px)'
               }}>
          </div>

          {/* 6. EAST WALL (The Veil / Entrance)
              Face is 100x100.
              Rotated Y 90deg.
              Pushed to the Right (positive X) by half the LENGTH (150px).
          */}
          <div className="absolute top-0 left-0 flex items-center justify-center overflow-hidden bg-indigo-900 border-2 border-gold-400/30"
               style={{ 
                 width: `${W}px`, 
                 height: `${H}px`,
                 transformOrigin: 'center',
                 transform: `rotateY(90deg) translateZ(${L/2}px)`,
                 boxShadow: '0 0 40px rgba(66, 0, 255, 0.4)'
               }}>
               {/* Veil Gradient */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 opacity-100"></div>
               {/* Cherubim Icon */}
               <div className="absolute text-gold-200 opacity-50 text-4xl">
                 ⚔️
               </div>
          </div>
          
          {/* Internal Light (Shekinah) */}
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-100 blur-[60px] rounded-full opacity-40 animate-pulse pointer-events-none"
               style={{ transform: `translate(-50%, -50%) translateX(-${L/3}px)` }}></div>

        </div>

        {/* DIVINE GEOMETRY BOX (Updated Text) */}
        <div className="absolute top-6 left-6 font-cinzel text-gold-500/80 p-4 border border-gold-900/40 bg-black/60 backdrop-blur-sm rounded-lg max-w-[200px]">
          <p className="text-[10px] tracking-widest uppercase mb-2 underline decoration-gold-700 font-bold">Divine Geometry</p>
          <p className="text-[11px] font-sans text-parchment-200 leading-normal">
            <span className="text-gold-400">φ (Phi) = 1.618</span><br/>
            The Ark's ratio (2.5 ÷ 1.5) is 1.666. God used the Golden Ratio before the Greeks ever named it. It's the same math found in your DNA and spiraling galaxies.
          </p>
        </div>

        {/* Control HUD */}
        <div className="absolute bottom-10 flex items-center gap-6 bg-parchment-100 p-2 pl-4 pr-4 rounded-full border-2 border-gold-600 shadow-2xl z-20">
          <button onClick={() => setRotation(r => r - 45)} className="text-parchment-900 hover:text-gold-700 font-cinzel text-[10px] font-bold">ROTATE L</button>
          <button onClick={() => setIsOrbiting(!isOrbiting)} className={`font-serif italic text-xl px-2 transition-all ${isOrbiting ? 'text-crimson animate-pulse' : 'text-parchment-900'}`}>
            {isOrbiting ? 'Stop' : 'Orbit'}
          </button>
          <button onClick={() => setRotation(r => r + 45)} className="text-parchment-900 hover:text-gold-700 font-cinzel text-[10px] font-bold">ROTATE R</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-parchment-900 selection:bg-gold-500/30">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-unifraktur text-6xl text-parchment-900 tracking-tight">The Mishkan</h1>
        <p className="font-cinzel text-xs tracking-[0.4em] text-gold-700 mt-2 uppercase italic">Shadow of the Heavenly</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 border-parchment-300 pb-4 lg:pb-0">
          {['sanctuary', 'elements', 'garments', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`whitespace-nowrap lg:w-full text-left p-4 border-b-2 lg:border-b lg:border-l-2 transition-all font-cinzel text-xs tracking-widest ${
                activeView === tab ? 'border-gold-600 bg-gold-500/10 text-gold-800 lg:translate-x-2 font-bold' : 'border-transparent lg:border-parchment-300 text-parchment-400'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 min-h-[600px]">
          
          {/* VIEW: SANCTUARY (3D) */}
          {activeView === 'sanctuary' && <Tabernacle3D />}

          {/* VIEW: ELEMENTS (Updated Text) */}
          {activeView === 'elements' && (
            <div className="animate-fadeIn space-y-6">
                <div className="bg-parchment-100 p-6 rounded border-l-4 border-gold-600 shadow-sm">
                    <h2 className="font-cinzel text-xl text-gold-800 mb-2">The Gold Walls</h2>
                    <p className="text-sm leading-relaxed font-sans text-parchment-800">
                        Imagine 48 massive boards, each 15 feet high, overlaid with pure gold. This wasn't a flimsy tent; it was a fortress. 
                        They fit together with "tenons" (hands) so tightly that when the sun hit them, it looked like a solid block of fire.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-800 text-parchment-200 p-4 rounded border border-stone-600">
                        <h3 className="font-cinzel text-stone-400 text-xs tracking-widest mb-2">THE ANCHORS (Silver Sockets)</h3>
                        <p className="text-xs leading-relaxed opacity-80">
                           Each gold board weighed a ton, literally. They sat in bases made of silver. Where did the silver come from? 
                           It was the "Redemption Money"—a tax paid by every person saved from Egypt. The whole house stood on the price of their freedom.
                        </p>
                    </div>
                    <div className="bg-amber-900/90 text-parchment-200 p-4 rounded border border-amber-700">
                        <h3 className="font-cinzel text-gold-400 text-xs tracking-widest mb-2">THE SPINE (The Bars)</h3>
                        <p className="text-xs leading-relaxed opacity-80">
                           Five gold-plated bars locked the walls together. One special bar (the "Middle Bar") ran invisibly through the center of the boards 
                           like a spine. It’s often seen as a symbol of the Spirit holding the believers together from the inside.
                        </p>
                    </div>
                </div>
            </div>
          )}

          {/* VIEW: GARMENTS (Updated Text) */}
          {activeView === 'garments' && (
            <div className="animate-fadeIn">
              <h2 className="font-cinzel text-gold-700 text-xl mb-6 uppercase tracking-[0.2em] text-center">Priestly Armor</h2>
              
              <div className="max-w-sm mx-auto grid grid-cols-4 gap-2 bg-gold-900/10 p-4 rounded-lg border-2 border-gold-600 shadow-xl mb-8">
                {breastplateStones.map((stone, i) => (
                  <div key={i} className={`${stone.color} aspect-square rounded shadow-inner border border-white/20 group relative overflow-hidden`}>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                        <span className="text-[6px] font-bold text-white uppercase">{stone.tribe}</span>
                     </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {garmentData.map((g, i) => (
                  <div key={i} className="bg-parchment-100/50 p-4 rounded border-l-2 border-gold-500 hover:bg-parchment-100 transition-colors">
                    <h3 className="font-cinzel text-gold-800 text-xs font-bold uppercase mb-1">{g.part}</h3>
                    <p className="text-xs text-parchment-800 leading-relaxed font-sans">{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: ARCHAEOLOGY (Updated Text) */}
          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-6">
                <div className="border-l-4 border-amber-600 pl-4 py-2">
                    <h2 className="text-2xl font-cinzel text-amber-700 uppercase tracking-widest">CSI: Shiloh</h2>
                    <p className="text-stone-500 text-xs italic">Digging up the Bible's ghost town.</p>
                </div>

                <div className="bg-stone-900 p-6 rounded-lg border border-stone-700 relative overflow-hidden text-parchment-200 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <h3 className="text-amber-400 font-cinzel mb-2 text-sm uppercase tracking-widest">Exhibit A: The Ceramic Pomegranate</h3>
                            <p className="text-xs text-stone-400 leading-relaxed font-sans">
                                We found this in the dirt at Shiloh. Why does it matter? Because the Torah says the High Priest had 
                                pomegranates on his hem. Finding a ceramic one in the exact spot the Bible says the Tabernacle stood? That's not a coincidence.
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-amber-900/20 border border-amber-500/30 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
                        🍎
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-parchment-100">
                    <div className="p-4 bg-black/70 border border-stone-800 rounded hover:border-amber-700 transition-colors">
                        <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">The Missing Walls</h4>
                        <p className="text-[11px] text-stone-400 font-sans">
                            Archaeologists found a rectangular perimeter cut into the bedrock on the northern plateau. The dimensions? 
                            Exactly consistent with the courtyard walls described in Exodus. It’s like a footprint in stone.
                        </p>
                    </div>
                    <div className="p-4 bg-black/70 border border-stone-800 rounded hover:border-amber-700 transition-colors">
                        <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">Bone Analysis</h4>
                        <p className="text-[11px] text-stone-400 font-sans">
                            The trash heaps at Shiloh are full of animal bones. But not just any bones—mostly from the 
                            "right side" of the animal. Leviticus 7 says the right thigh belongs to the priest. The data proves they were following the Law.
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