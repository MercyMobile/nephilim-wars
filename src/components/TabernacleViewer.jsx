import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-35);
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

  // --- EFFICIENT ORBIT LOGIC ---
  // Only restarts when 'isOrbiting' changes, not on every rotation update.
  useEffect(() => {
    let interval;
    if (isOrbiting) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isOrbiting]);

  const Tabernacle3D = () => {
    // --- GEOMETRY CONSTANTS ---
    // The "World" scale: 10px approx 1 cubit
    const L = 300; // Length (Left-to-Right)
    const H = 100; // Height (Top-to-Bottom)
    const D = 100; // Depth (Front-to-Back)

    // Common style for all 3D faces to prevent clipping/hiding
    // 'backfaceVisibility: visible' ensures we see the inside of the far walls
    const faceStyle = {
      position: 'absolute',
      backfaceVisibility: 'visible', 
      transformStyle: 'preserve-3d',
      boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' // Inner shadow for "box" feel
    };

    return (
      <div className="relative w-full h-[500px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex items-center justify-center perspective-1000 shadow-2xl">
        {/* Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] to-[#292524] opacity-90"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-amber-900/20 to-transparent blur-xl"></div>
        
        {/* --- SCENE ROTATOR --- */}
        {/* We rotate this 0px container, and everything inside moves with it */}
        <div 
          className="relative preserve-3d transition-transform duration-100 ease-linear"
          style={{ 
            width: '0px', 
            height: '0px',
            transform: `rotateX(-20deg) rotateY(${rotation}deg)` 
          }}
        >
          {/* ==========================
              THE BOX FACES
             ========================== */}

          {/* 1. FLOOR (Silver Sockets) */}
          <div style={{
            ...faceStyle,
            width: `${L}px`,
            height: `${D}px`,
            background: '#d6d3d1', // Stone color
            // Rotate X -90 to face DOWN. Translate Z to move it to the bottom.
            transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${H/2}px)`
          }}>
             {/* Sockets Grid */}
             <div className="w-full h-full opacity-60 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_29px,#44403c_30px)]"></div>
          </div>

          {/* 2. ROOF (Red Skins) */}
          <div style={{
            ...faceStyle,
            width: `${L}px`,
            height: `${D}px`,
            background: '#7f1d1d', // Red color
            // Rotate X 90 to face UP. Translate Z to move it to the top.
            transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${H/2}px)`,
            border: '1px solid #450a0a'
          }}>
             <div className="w-full h-full bg-black/20 mix-blend-multiply"></div>
          </div>

          {/* 3. NORTH WALL (Front Long Side) */}
          <div style={{
            ...faceStyle,
            width: `${L}px`,
            height: `${H}px`,
            background: 'linear-gradient(to bottom, #facc15, #a16207)',
            // Push forward by half the Depth
            transform: `translate(-50%, -50%) translateZ(${D/2}px)`,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 15px)'
          }}></div>

          {/* 4. SOUTH WALL (Back Long Side) */}
          <div style={{
            ...faceStyle,
            width: `${L}px`,
            height: `${H}px`,
            background: 'linear-gradient(to bottom, #facc15, #a16207)',
            // Rotate 180 to face back, push out by half Depth
            transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${D/2}px)`,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 15px)'
          }}></div>

          {/* 5. WEST WALL (Rear Short Side) */}
          <div style={{
            ...faceStyle,
            width: `${D}px`,
            height: `${H}px`,
            background: 'linear-gradient(to bottom, #facc15, #a16207)',
            // Rotate -90 to face Left, push out by half Length
            transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${L/2}px)`,
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 15px)'
          }}></div>

          {/* 6. EAST WALL (The Veil - Entrance) */}
          <div style={{
            ...faceStyle,
            width: `${D}px`,
            height: `${H}px`,
            background: '#312e81', // Indigo
            // Rotate 90 to face Right, push out by half Length
            transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${L/2}px)`,
            border: '2px solid rgba(250, 204, 21, 0.4)'
          }}>
             <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 opacity-100"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl filter drop-shadow-lg opacity-80">⚔️</span>
             </div>
          </div>
        </div>

        {/* --- UI OVERLAYS --- */}
        
        {/* Divine Geometry Box */}
        <div className="absolute top-6 left-6 font-cinzel text-amber-500 p-4 border border-amber-900/40 bg-black/80 backdrop-blur-sm rounded-lg max-w-[200px] z-10 shadow-lg pointer-events-none">
          <p className="text-[10px] tracking-widest uppercase mb-2 underline decoration-amber-700 font-bold">Divine Geometry</p>
          <p className="text-[11px] font-sans text-stone-300 leading-normal">
            <span className="text-amber-400 font-bold">φ (Phi) = 1.618</span><br/>
            The Ark's ratio (2.5 ÷ 1.5) is 1.666. God used the Golden Ratio before the Greeks ever named it.
          </p>
        </div>

        {/* Controls */}
        <div className="absolute bottom-10 flex items-center gap-6 bg-parchment-100 p-2 pl-4 pr-4 rounded-full border-2 border-amber-600 shadow-2xl z-20">
          <button onClick={() => setRotation(r => r - 45)} className="text-stone-900 hover:text-amber-700 font-cinzel text-[10px] font-bold cursor-pointer transition-colors">ROTATE L</button>
          <button onClick={() => setIsOrbiting(!isOrbiting)} className={`font-serif italic text-xl px-2 transition-all cursor-pointer ${isOrbiting ? 'text-red-700 animate-pulse' : 'text-stone-900'}`}>
            {isOrbiting ? 'Stop' : 'Orbit'}
          </button>
          <button onClick={() => setRotation(r => r + 45)} className="text-stone-900 hover:text-amber-700 font-cinzel text-[10px] font-bold cursor-pointer transition-colors">ROTATE R</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-stone-900">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-unifraktur text-6xl text-stone-900 tracking-tight">The Mishkan</h1>
        <p className="font-cinzel text-xs tracking-[0.4em] text-amber-700 mt-2 uppercase italic">Shadow of the Heavenly</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Tabs - High Contrast */}
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 border-stone-300 pb-4 lg:pb-0">
          {['sanctuary', 'elements', 'garments', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`whitespace-nowrap lg:w-full text-left p-4 border-b-2 lg:border-b lg:border-l-2 transition-all font-cinzel text-xs tracking-widest ${
                activeView === tab 
                  ? 'border-amber-500 bg-stone-900 text-gold-400 font-black lg:translate-x-2 shadow-md' 
                  : 'border-transparent lg:border-stone-300 text-stone-600 hover:text-amber-900 hover:bg-stone-300 font-bold'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="lg:col-span-3 min-h-[600px]">
          {activeView === 'sanctuary' && <Tabernacle3D />}

          {activeView === 'elements' && (
            <div className="animate-fadeIn space-y-6">
                <div className="bg-parchment-100 p-6 rounded border-l-4 border-amber-600 shadow-sm">
                    <h2 className="font-cinzel text-xl text-amber-900 mb-2">The Gold Walls</h2>
                    <p className="text-sm leading-relaxed font-sans text-stone-800">
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

          {activeView === 'garments' && (
            <div className="animate-fadeIn">
              <h2 className="font-cinzel text-amber-800 text-xl mb-6 uppercase tracking-[0.2em] text-center">Priestly Armor</h2>
              
              <div className="max-w-sm mx-auto grid grid-cols-4 gap-2 bg-stone-900 p-4 rounded-lg border-2 border-amber-600 shadow-xl mb-8">
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
                  <div key={i} className="bg-white/50 p-4 rounded border-l-2 border-amber-500 hover:bg-white transition-colors shadow-sm">
                    <h3 className="font-cinzel text-amber-900 text-xs font-bold uppercase mb-1">{g.part}</h3>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-6">
                <div className="border-l-4 border-amber-600 pl-4 py-2">
                    <h2 className="text-2xl font-cinzel text-amber-800 uppercase tracking-widest">CSI: Shiloh</h2>
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