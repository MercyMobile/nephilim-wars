import React, { useState, useEffect, useRef } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-35);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const intervalRef = useRef(null);

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

  // --- ORBIT LOGIC ---
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isOrbiting) {
      intervalRef.current = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 30);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOrbiting]);

  // --- 3D SUB-COMPONENT (THE NEW COURTYARD LOGIC) ---
  const Tabernacle3D = () => {
    // NEW SCALE: 4.5px = 1 cubit (Zoomed out to fit the courtyard)
    const S = 4.5; 
    
    // DIMENSIONS (in scale units)
    const courtL = 100 * S;  // 100 cubits long
    const courtW = 50 * S;   // 50 cubits wide
    const fenceH = 5 * S;    // 5 cubits high
    
    const tentL = 30 * S;    // 30 cubits
    const tentW = 10 * S;    // 10 cubits
    const tentH = 10 * S;    // 10 cubits
    
    // Position the tent towards the West (Back) of the courtyard
    const tentCenterX = -courtL/2 + 25 * S; 

    return (
      <div className="relative w-full h-[500px] bg-stone-900 rounded-xl border-4 border-double border-amber-700 overflow-hidden flex flex-col items-center justify-center perspective-[1200px] shadow-2xl">
        {/* Sky / Horizon */}
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-sky-900 to-stone-900 opacity-50"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
        
        {/* WORLD CONTAINER - Rotates the whole scene */}
        <div 
          className="relative preserve-3d transition-transform duration-100 ease-linear"
          style={{ 
            width: `${courtL}px`, 
            height: `${courtW}px`, 
            transform: `rotateX(-35deg) rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* ======================= */}
          {/* THE COURTYARD      */}
          {/* ======================= */}
          
          {/* GROUND (SAND) */}
          <div className="absolute inset-0 bg-amber-100/20 border-2 border-stone-500/30"
               style={{ 
                 transform: `rotateX(90deg) translateZ(${fenceH/2}px)`,
                 boxShadow: '0 0 100px rgba(0,0,0,0.5)',
                 background: `repeating-linear-gradient(45deg, #d6d3d1 0px, #d6d3d1 2px, #e7e5e4 2px, #e7e5e4 8px)`
               }}>
          </div>

          {/* FENCE: NORTH WALL (White Linen) */}
          <div className="absolute bg-stone-200/90 border-b border-stone-400"
               style={{ width: `${courtL}px`, height: `${fenceH}px`, transform: `translateY(-${fenceH/2}px) translateZ(-${courtW/2}px)`,
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.1) 20px)' }}></div>

          {/* FENCE: SOUTH WALL */}
          <div className="absolute bg-stone-200/90 border-b border-stone-400"
               style={{ width: `${courtL}px`, height: `${fenceH}px`, transform: `translateY(-${fenceH/2}px) translateZ(${courtW/2}px) rotateY(180deg)`,
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.1) 20px)' }}></div>

          {/* FENCE: WEST WALL (Back) */}
          <div className="absolute bg-stone-200/90 border-b border-stone-400"
               style={{ width: `${courtW}px`, height: `${fenceH}px`, transform: `translateY(-${fenceH/2}px) translateX(-${courtL/2}px) rotateY(90deg)`,
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.1) 20px)' }}></div>

          {/* FENCE: EAST WALL (Front with Gate) */}
          <div className="absolute flex items-end justify-center"
               style={{ width: `${courtW}px`, height: `${fenceH}px`, transform: `translateY(-${fenceH/2}px) translateX(${courtL/2}px) rotateY(-90deg)` }}>
               {/* Left side linen */}
               <div className="h-full bg-stone-200/90 w-1/3 border-b border-stone-400"></div>
               {/* THE GATE (Colorful) */}
               <div className="h-full w-1/3 bg-gradient-to-r from-blue-900 via-purple-800 to-red-900 opacity-80 flex items-center justify-center border-x-2 border-amber-600">
                  <span className="text-[8px] text-amber-200 font-cinzel tracking-widest">GATE</span>
               </div>
               {/* Right side linen */}
               <div className="h-full bg-stone-200/90 w-1/3 border-b border-stone-400"></div>
          </div>


          {/* ======================= */}
          {/* COURTYARD ITEMS    */}
          {/* ======================= */}

          {/* ALTAR OF BURNT OFFERING (Bronze Box near Gate) */}
          <div className="absolute bg-amber-800 border border-amber-950"
               style={{ 
                 width: `${5 * S}px`, height: `${5 * S}px`, 
                 transform: `translateX(${courtL/3}px) rotateX(90deg) translateZ(0px)`, 
                 boxShadow: '0 0 10px rgba(0,0,0,0.5)'
               }}>
               {/* Fire Effect */}
               <div className="absolute -top-4 left-1 text-[10px] animate-pulse">🔥</div>
          </div>

          {/* THE LAVER (Bronze Basin) */}
          <div className="absolute bg-amber-700 rounded-full border border-amber-900"
               style={{ 
                 width: `${3 * S}px`, height: `${3 * S}px`,
                 transform: `translateX(${courtL/6}px) rotateX(90deg) translateZ(0px)`, 
                 boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)'
               }}>
               <div className="w-full h-full bg-blue-400/30 rounded-full scale-75"></div>
          </div>


          {/* ======================= */}
          {/* THE TABERNACLE     */}
          {/* ======================= */}
          <div className="preserve-3d absolute" style={{ transform: `translateX(${tentCenterX}px)` }}>
            
            {/* TENT FLOOR */}
            <div className="absolute bg-slate-300 border border-slate-400"
                style={{ width: `${tentL}px`, height: `${tentW}px`, transform: `rotateX(90deg) translateZ(0px)` }}></div>

            {/* NORTH WALL (Gold) */}
            <div className="absolute bg-gradient-to-b from-yellow-400 to-yellow-700"
                style={{ width: `${tentL}px`, height: `${tentH}px`, transform: `translateY(-${tentH/2}px) translateZ(-${tentW/2}px)` }}></div>

            {/* SOUTH WALL (Gold) */}
            <div className="absolute bg-gradient-to-b from-yellow-400 to-yellow-700"
                style={{ width: `${tentL}px`, height: `${tentH}px`, transform: `translateY(-${tentH/2}px) translateZ(${tentW/2}px)` }}></div>

            {/* WEST WALL (Gold - Rear) */}
            <div className="absolute bg-gradient-to-b from-yellow-400 to-yellow-700"
                style={{ width: `${tentW}px`, height: `${tentH}px`, transform: `translateY(-${tentH/2}px) translateX(-${tentL/2}px) rotateY(90deg)` }}></div>

            {/* ENTRANCE VEIL (East) */}
            <div className="absolute bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 flex items-center justify-center"
                style={{ width: `${tentW}px`, height: `${tentH}px`, transform: `translateY(-${tentH/2}px) translateX(${tentL/2}px) rotateY(-90deg)` }}>
                <span className="text-[8px]">⚔️</span>
            </div>

            {/* ROOF (Red Skins) */}
            <div className="absolute bg-red-900"
                style={{ width: `${tentL + 4}px`, height: `${tentW + 4}px`, transform: `translateY(-${tentH}px) rotateX(90deg)` }}></div>
          </div>

        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-6 right-6 flex gap-2 items-center bg-stone-900/90 p-2 rounded-full border border-amber-900/50 shadow-xl z-50 pointer-events-auto">
          <button onClick={() => setRotation(r => r - 45)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-900 text-amber-500 transition-colors cursor-pointer">↺</button>
          <button onClick={() => setIsOrbiting(!isOrbiting)} className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest transition-all cursor-pointer ${isOrbiting ? 'bg-red-900 text-red-200 animate-pulse' : 'bg-amber-900 text-amber-200 hover:bg-amber-800'}`}>
            {isOrbiting ? 'HALT' : 'ORBIT'}
          </button>
          <button onClick={() => setRotation(r => r + 45)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-900 text-amber-500 transition-colors cursor-pointer">↻</button>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-stone-900">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-unifraktur text-6xl text-stone-900 tracking-tight">The Mishkan</h1>
        <p className="font-cinzel text-xs tracking-[0.4em] text-amber-700 mt-2 uppercase italic">Shadow of the Heavenly</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* NAVIGATION TABS */}
        <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 border-b lg:border-b-0 border-stone-300 pb-4 lg:pb-0">
          {['sanctuary', 'elements', 'garments', 'archaeology'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`whitespace-nowrap lg:w-full text-left p-4 border-b-2 lg:border-b lg:border-l-2 transition-all font-cinzel text-xs tracking-widest ${
                activeView === tab 
                  ? 'border-amber-600 bg-amber-900/10 text-amber-900 font-black lg:translate-x-2' 
                  : 'border-transparent lg:border-stone-300 text-stone-500 hover:text-amber-800 font-bold'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-3 min-h-[600px]">
          
          {/* --- 3D VIEW --- */}
          {activeView === 'sanctuary' && <Tabernacle3D />}

          {/* --- ELEMENTS TAB --- */}
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
                           like a spine. It's often seen as a symbol of the Spirit holding the believers together from the inside.
                        </p>
                    </div>
                </div>
            </div>
          )}

          {/* --- GARMENTS TAB --- */}
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

          {/* --- ARCHAEOLOGY TAB --- */}
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
                            Exactly consistent with the courtyard walls described in Exodus. It's like a footprint in stone.
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