import React, { useState, useEffect } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-35);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const intervalRef = React.useRef(null);

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

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start new interval if orbiting
    if (isOrbiting) {
      intervalRef.current = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 30);
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOrbiting]);

  const Tabernacle3D = () => {
    // SCALE: 10px = 1 cubit
    const L = 300; // Length: 30 cubits
    const W = 100; // Width: 10 cubits
    const H = 100; // Height: 10 cubits
    const tentL = 500; // Tent extends 50 cubits
    const tentW = 140; // Tent extends 14 cubits wide
    const holyOfHoliesLength = 100; // 10 cubits (perfect cube)

    return (
      <div className="relative w-full h-[500px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex flex-col items-center justify-center perspective-[1200px] shadow-2xl">
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#c2b280] to-[#e6d8b6] opacity-10 blur-md"></div>
        
        {/* CENTERED BOX APPROACH - All faces positioned relative to center */}
        <div 
          className="relative preserve-3d transition-transform duration-100 ease-linear"
          style={{ 
            width: `${L}px`, 
            height: `${H}px`,
            transform: `rotateX(-20deg) rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* FLOOR (Silver Sockets) - Bottom of the box */}
          <div className="absolute bg-stone-300 border border-stone-400"
               style={{ 
                 width: `${L}px`, 
                 height: `${W}px`,
                 left: 0,
                 top: `${H/2 - W/2}px`,
                 transform: `rotateX(90deg) translateZ(${-H/2}px)`,
                 transformOrigin: '50% 50%',
                 boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
               }}>
               <div className="w-full h-full opacity-40 bg-[repeating-linear-gradient(90deg,transparent 0px,transparent 29px,#000 30px)]"></div>
          </div>

          {/* TENT COVERING (Ram Skins) - TOP of the box */}
          <div className="absolute bg-gradient-to-br from-red-900 via-red-950 to-red-900 opacity-95"
               style={{ 
                 width: `${tentL}px`, 
                 height: `${tentW}px`,
                 left: `${(L - tentL) / 2}px`,
                 top: `${H/2 - tentW/2}px`,
                 transform: `rotateX(90deg) translateZ(${H/2 + 5}px)`,
                 transformOrigin: '50% 50%'
               }}>
               <div className="w-full h-full bg-black/30 mix-blend-multiply"></div>
               <div className="w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3) 0px,transparent 1px,transparent 40px)]"></div>
          </div>

          {/* FRONT WALL (NORTH) - Gold Boards - OPAQUE */}
          <div className="absolute bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 opacity-100"
               style={{ 
                 width: `${L}px`, 
                 height: `${H}px`,
                 left: 0,
                 top: 0,
                 transform: `translateZ(${W/2}px)`,
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 15px)'
               }}>
          </div>

          {/* BACK WALL (SOUTH) - Gold Boards - OPAQUE */}
          <div className="absolute bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 opacity-100"
               style={{ 
                 width: `${L}px`, 
                 height: `${H}px`,
                 left: 0,
                 top: 0,
                 transform: `translateZ(${-W/2}px) rotateY(180deg)`,
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 15px)'
               }}>
          </div>

          {/* RIGHT WALL (WEST - Rear End) - Gold Boards - OPAQUE */}
          <div className="absolute bg-gradient-to-b from-yellow-500 via-yellow-600 to-yellow-800 opacity-100"
               style={{ 
                 width: `${W}px`, 
                 height: `${H}px`,
                 left: `${L/2 - W/2}px`,
                 top: 0,
                 transform: `translateX(${L/2}px) rotateY(90deg)`,
                 transformOrigin: '50% 50%',
                 backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 15px)'
               }}>
          </div>

          {/* LEFT WALL (EAST - Entrance Veil) - OPAQUE */}
          <div className="absolute flex items-center justify-center overflow-hidden border-2 border-gold-400/50 opacity-100"
               style={{ 
                 width: `${W}px`, 
                 height: `${H}px`,
                 left: `${L/2 - W/2}px`,
                 top: 0,
                 transform: `translateX(${-L/2}px) rotateY(-90deg)`,
                 transformOrigin: '50% 50%',
                 background: 'linear-gradient(135deg, #1e3a8a 0%, #5b21b6 33%, #db2777 66%, #991b1b 75%, #1e3a8a 100%)'
               }}>
               <div className="absolute text-gold-200 opacity-80 text-4xl drop-shadow-lg">⚔️</div>
               <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.1) 10px,rgba(255,255,255,0.1) 11px)]"></div>
          </div>

          {/* INTERIOR VEIL (Dividing Holy Place from Holy of Holies) - OPAQUE */}
          <div className="absolute flex items-center justify-center overflow-hidden border border-purple-400/50 opacity-100"
               style={{ 
                 width: `${W}px`, 
                 height: `${H}px`,
                 left: `${L/2 - W/2}px`,
                 top: 0,
                 transform: `translateX(${L/2 - holyOfHoliesLength}px) rotateY(-90deg)`,
                 transformOrigin: '50% 50%',
                 background: 'linear-gradient(135deg, #4c1d95 0%, #7e22ce 25%, #db2777 50%, #991b1b 75%, #1e3a8a 100%)'
               }}>
               <div className="grid grid-cols-2 gap-6 text-3xl opacity-70 text-gold-300">
                 <span>🔥</span>
                 <span>🔥</span>
                 <span>⚔️</span>
                 <span>⚔️</span>
               </div>
               <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent 5px,rgba(255,255,255,0.2) 5px,rgba(255,255,255,0.2) 6px)]"></div>
          </div>

          {/* HOLY OF HOLIES FLOOR MARKER */}
          <div className="absolute bg-yellow-600/30 border-2 border-yellow-500/50"
               style={{ 
                 width: `${holyOfHoliesLength}px`, 
                 height: `${W}px`,
                 left: `${L - holyOfHoliesLength}px`,
                 top: `${H/2 - W/2}px`,
                 transform: `rotateX(90deg) translateZ(${-H/2}px)`,
                 transformOrigin: '50% 50%'
               }}>
          </div>
        </div>

        {/* INFO BOX - High Contrast */}
        <div className="absolute top-6 left-6 font-cinzel text-gold-400 p-4 border border-gold-600 bg-stone-900/90 rounded-lg max-w-[200px] z-20 shadow-xl">
          <p className="text-[10px] tracking-widest uppercase mb-2 underline decoration-gold-700 font-bold">Divine Geometry</p>
          <p className="text-[11px] font-sans text-stone-300 leading-normal">
            <span className="text-white font-bold">φ (Phi) = 1.618</span><br/>
            The Ark's ratio (2.5 ÷ 1.5) is 1.666. God used the Golden Ratio before the Greeks ever named it.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-6 right-6 flex gap-4 items-center bg-parchment-200/90 p-3 rounded-lg border border-stone-400 shadow-xl z-20">
          <button onClick={() => setRotation(r => r - 45)} className="text-stone-900 hover:text-gold-70