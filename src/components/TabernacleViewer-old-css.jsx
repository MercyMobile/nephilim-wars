import React, { useState, useEffect } from 'react';
import Tabernacle3D from './Tabernacle3D';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [rotation, setRotation] = useState(-35);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // --- 1. EDUCATIONAL CONTENT (Restored) ---
  const breastplateStones = [
    { name: "Sardius", tribe: "Reuben", color: "bg-red-700", meaning: "The Firstborn" },
    { name: "Topaz", tribe: "Simeon", color: "bg-yellow-400", meaning: "Hearing" },
    { name: "Carbuncle", tribe: "Levi", color: "bg-red-900", meaning: "Joined" },
    { name: "Emerald", tribe: "Judah", color: "bg-green-600", meaning: "Praise" },
    { name: "Sapphire", tribe: "Issachar", color: "bg-blue-700", meaning: "Reward" },
    { name: "Diamond", tribe: "Zebulun", color: "bg-slate-100 text-black", meaning: "Dwelling" },
    { name: "Jacinth", tribe: "Dan", color: "bg-orange-500", meaning: "Judge" },
    { name: "Agate", tribe: "Naphtali", color: "bg-stone-400", meaning: "Wrestling" },
    { name: "Amethyst", tribe: "Gad", color: "bg-purple-600", meaning: "Troop" },
    { name: "Beryl", tribe: "Asher", color: "bg-teal-500", meaning: "Happy" },
    { name: "Onyx", tribe: "Joseph", color: "bg-black", meaning: "Adding" },
    { name: "Jasper", tribe: "Benjamin", color: "bg-red-800", meaning: "Son of Right Hand" }
  ];

  const garmentData = [
    { part: "The Ephod", detail: "A woven vest of gold, blue, purple, and scarlet. On its shoulders sat two onyx stones engraved with the names of the tribes. The High Priest literally carried the weight of the nation on his shoulders before God." },
    { part: "The Hoshen (Breastplate)", detail: "A 'device of decision'. A folded pouch containing the Urim and Thummim (Lights and Perfections). It was divine technology used to receive binary answers (Yes/No) from YHWH in times of crisis." },
    { part: "The Robe of the Ephod", detail: "Pure blue, symbolizing heaven. The hem was lined with alternating golden bells and pomegranates. The bells announced his movement; if the sound stopped, the people knew he had died in the Presence." },
    { part: "The Golden Plate (Tzitz)", detail: "A band of pure gold tied to the forehead, engraved with 'HOLINESS TO YHWH'. It atoned for errors in the holy offerings, allowing accepted worship despite human imperfection." }
  ];

  // --- 2. ORBIT ENGINE ---
  useEffect(() => {
    let interval;
    if (isOrbiting) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isOrbiting]);

// --- 3. 3D COMPONENT ---
  const Tabernacle3D = () => {
    // NEW SCALE: 5px = 1 cubit (Scaled down to fit Courtyard)
    // Courtyard: 100 x 50 cubits -> 500px x 250px
    const CW = 500; // Courtyard Width (Long side)
    const CD = 250; // Courtyard Depth (Short side)
    const CH = 25;  // Courtyard Fence Height (5 cubits)

    // Tabernacle: 30 x 10 cubits -> 150px x 50px
    const TW = 150; // Tabernacle Width
    const TD = 50;  // Tabernacle Depth
    const TH = 50;  // Tabernacle Height (10 cubits)

    // Common styles
    const faceStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    };
    

    return (
      <div className="relative w-full h-[500px] bg-parchment-900 rounded-xl border-2 border-gold-700/30 overflow-hidden flex items-center justify-center perspective-1000 shadow-2xl">
        {/* Environment */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] to-[#292524] opacity-90"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-amber-900/20 to-transparent blur-xl"></div>
        
        {/* ROTATION CONTAINER */}
        <div 
          className="relative preserve-3d transition-transform duration-100 ease-linear"
          style={{ 
            width: '0px', height: '0px',
            transform: `rotateX(-30deg) rotateY(${rotation}deg)` 
          }}
        >
          {/* === A. THE COURTYARD (Outer Fence) === */}
          
          {/* Floor (Sand) */}
          <div style={{
            ...faceStyle, width: `${CW}px`, height: `${CD}px`,
            background: '#d6d3d1', // Sand color base
            transform: `translate(-50%, -50%) rotateX(90deg) translateZ(0px)`, // Floor at 0
            boxShadow: '0 0 100px rgba(0,0,0,0.5)'
          }}>
            <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/sand.png')]"></div>
          </div>

          {/* Fence North (Long) */}
          <div style={{
            ...faceStyle, width: `${CW}px`, height: `${CH}px`,
            background: '#e5e5e5', // White Linen
            transform: `translate(-50%, -50%) translateY(-${CH/2}px) translateZ(-${CD/2}px)`,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 24px, #78350f 25px)' // Bronze Pillars every 5 cubits
          }}></div>

          {/* Fence South (Long) */}
          <div style={{
            ...faceStyle, width: `${CW}px`, height: `${CH}px`,
            background: '#e5e5e5',
            transform: `translate(-50%, -50%) translateY(-${CH/2}px) rotateY(180deg) translateZ(-${CD/2}px)`,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 24px, #78350f 25px)'
          }}></div>

          {/* Fence West (Rear Short) */}
          <div style={{
            ...faceStyle, width: `${CD}px`, height: `${CH}px`,
            background: '#e5e5e5',
            transform: `translate(-50%, -50%) translateY(-${CH/2}px) rotateY(-90deg) translateZ(-${CW/2}px)`,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 24px, #78350f 25px)'
          }}></div>

          {/* Fence East (Gate) */}
          <div style={{
            ...faceStyle, width: `${CD}px`, height: `${CH}px`,
            background: 'transparent',
            transform: `translate(-50%, -50%) translateY(-${CH/2}px) rotateY(90deg) translateZ(-${CW/2}px)`,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {/* The Gate Screen (Blue/Purple/Red) */}
            <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-blue-800 via-purple-800 to-red-800 opacity-80 border-2 border-amber-700"></div>
          </div>

          {/* === B. THE BRONZE ALTAR === */}
          <div className="absolute preserve-3d" style={{ transform: `translateZ(${CW/4}px) translateY(-15px)` }}>
              <div className="w-10 h-10 bg-amber-900 border border-amber-950 opacity-90 transform translate-x-[-50%] translate-y-[-50%] rotateX(0deg)"></div>
          </div>

          {/* === C. THE TABERNACLE (Inner Sanctuary) === */}
          {/* Positioned in the West half (Negative X in this setup, or offset Z depending on rotation) */}
          <div className="preserve-3d absolute" style={{ transform: `translateX(-100px) translateY(-${TH/2}px)` }}>
            
            {/* North Wall (Gold) */}
            <div style={{
               ...faceStyle, width: `${TW}px`, height: `${TH}px`,
               backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 10px), linear-gradient(to bottom, #facc15, #a16207)`,
               transform: `translate(-50%, -50%) translateZ(-${TD/2}px)`
            }}></div>

            {/* South Wall (Gold) */}
            <div style={{
               ...faceStyle, width: `${TW}px`, height: `${TH}px`,
               backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 10px), linear-gradient(to bottom, #facc15, #a16207)`,
               transform: `translate(-50%, -50%) rotateY(180deg) translateZ(-${TD/2}px)`
            }}></div>

            {/* West Wall (Gold) */}
            <div style={{
               ...faceStyle, width: `${TD}px`, height: `${TH}px`,
               backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 10px), linear-gradient(to bottom, #facc15, #a16207)`,
               transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(-${TW/2}px)`
            }}></div>

            {/* Roof (Red Ram Skins) */}
            <div style={{
               ...faceStyle, width: `${TW}px`, height: `${TD}px`,
               background: '#7f1d1d',
               transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${TH/2}px)` // Top
            }}></div>

             {/* Entrance (Veil) */}
             <div style={{
               ...faceStyle, width: `${TD}px`, height: `${TH}px`,
               background: '#312e81',
               transform: `translate(-50%, -50%) rotateY(90deg) translateZ(-${TW/2}px)`,
               boxShadow: '0 0 15px rgba(250, 204, 21, 0.2)'
            }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 opacity-90"></div>
            </div>

          </div>

        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-6 flex items-center gap-6 bg-parchment-100 p-2 pl-4 pr-4 rounded-full border-2 border-amber-600 shadow-2xl z-20">
          <button onClick={() => setRotation(r => r - 45)} className="text-stone-900 hover:text-amber-700 font-cinzel text-[10px] font-bold">ROTATE L</button>
          <button onClick={() => setIsOrbiting(!isOrbiting)} className={`font-serif italic text-xl px-2 transition-all cursor-pointer ${isOrbiting ? 'text-red-700 animate-pulse' : 'text-stone-900'}`}>
            {isOrbiting ? 'Stop' : 'Orbit'}
          </button>
          <button onClick={() => setRotation(r => r + 45)} className="text-stone-900 hover:text-amber-700 font-cinzel text-[10px] font-bold">ROTATE R</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-stone-900 selection:bg-gold-500/30">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-unifraktur text-6xl text-stone-900 tracking-tight">The Mishkan</h1>
        <p className="font-cinzel text-xs tracking-[0.4em] text-amber-700 mt-2 uppercase italic">Pattern of the Heavenly</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* SIDEBAR NAVIGATION */}
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

        <div className="lg:col-span-3 min-h-[600px]">
          
          {/* 3D VIEWER */}
          {activeView === 'sanctuary' && (
            <div className="animate-fadeIn">
                <Tabernacle3D />
                <div className="mt-6 p-4 border-l-4 border-amber-600 bg-parchment-100 text-sm text-stone-700 leading-relaxed">
                    <p><strong>The Scale:</strong> You are viewing the Courtyard (100x50 cubits). Inside stands the Mishkan proper (30x10 cubits). The outer fence is white linen to symbolize purity, held up by bronze pillars (judgment). The inner house is gold (divinity) sitting on silver (redemption).</p>
                </div>
            </div>
          )}

          {/* ELEMENTS TAB (Restored) */}
          {activeView === 'elements' && (
            <div className="animate-fadeIn space-y-6">
                <div className="bg-parchment-100 p-6 rounded border-l-4 border-amber-600 shadow-sm">
                    <h2 className="font-cinzel text-xl text-amber-900 mb-2">The Boards (Ha'Kerashim)</h2>
                    <p className="text-sm leading-relaxed font-sans text-stone-800">
                        The walls were not canvas, but massive acacia boards overlaid with gold. Each board was 10 cubits high (15 ft) and 1.5 cubits wide. 
                        They stood upright like men, "shoulder to shoulder," forming a solid golden house.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-800 text-parchment-200 p-4 rounded border border-stone-600">
                        <h3 className="font-cinzel text-stone-400 text-xs tracking-widest mb-2">SILVER SOCKETS (Adanim)</h3>
                        <p className="text-xs leading-relaxed opacity-90">
                           Every gold board had two "feet" (tenons) that sank into heavy silver bases. This silver came from the "ransom money" of the census. 
                           Spiritually, this means the entire house of God rests on the price of redemption.
                        </p>
                    </div>
                    <div className="bg-amber-900/90 text-parchment-200 p-4 rounded border border-amber-700">
                        <h3 className="font-cinzel text-gold-400 text-xs tracking-widest mb-2">THE MIDDLE BAR</h3>
                        <p className="text-xs leading-relaxed opacity-90">
                           Five bars held the walls together. Four were visible on the outside rings, but the "Middle Bar" ran through the center of the wood itself, end to end. 
                           It is the invisible strength holding the Body together.
                        </p>
                    </div>
                </div>
            </div>
          )}

          {/* GARMENTS TAB (Restored) */}
          {activeView === 'garments' && (
            <div className="animate-fadeIn">
              <h2 className="font-cinzel text-amber-800 text-xl mb-6 uppercase tracking-[0.2em] text-center">Vestments of Glory</h2>
              
              {/* Breastplate Grid */}
              <div className="max-w-sm mx-auto grid grid-cols-3 gap-2 bg-stone-900 p-4 rounded-lg border-2 border-amber-600 shadow-xl mb-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">The Hoshen</div>
                {breastplateStones.map((stone, i) => (
                  <div key={i} className={`${stone.color} aspect-square rounded shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-white/20 group relative overflow-hidden flex flex-col items-center justify-center cursor-help`}>
                     <span className="text-[7px] font-bold text-white/90 uppercase z-10">{stone.tribe}</span>
                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                        <span className="text-[8px] text-gold-300 leading-tight">{stone.meaning}</span>
                     </div>
                  </div>
                ))}
              </div>

              {/* Details List */}
              <div className="space-y-4">
                {garmentData.map((g, i) => (
                  <div key={i} className="bg-white/60 p-4 rounded border-l-4 border-amber-500 hover:bg-white transition-colors shadow-sm">
                    <h3 className="font-cinzel text-amber-900 text-sm font-bold uppercase mb-1">{g.part}</h3>
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARCHAEOLOGY TAB (Restored) */}
          {activeView === 'archaeology' && (
            <div className="animate-fadeIn space-y-6">
                <div className="border-l-4 border-amber-600 pl-4 py-2 bg-amber-50">
                    <h2 className="text-2xl font-cinzel text-amber-800 uppercase tracking-widest">CSI: Shiloh</h2>
                    <p className="text-stone-500 text-xs italic">"Go now to My place which was in Shiloh..." (Jeremiah 7:12)</p>
                </div>

                <div className="bg-stone-900 p-6 rounded-lg border border-stone-700 relative overflow-hidden text-parchment-200 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <h3 className="text-amber-400 font-cinzel mb-2 text-sm uppercase tracking-widest">Exhibit A: The Ceramic Pomegranate</h3>
                            <p className="text-xs text-stone-400 leading-relaxed font-sans">
                                Excavated at Tel Shiloh (2000s). This late Bronze Age artifact matches the biblical description of the High Priest's hem. 
                                Its discovery in a sacred precinct context bridges the gap between the text and the dirt.
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-amber-900/20 border border-amber-500/30 rounded-full flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.2)] animate-pulse">
                        🍎
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-parchment-100">
                    <div className="p-4 bg-black/70 border border-stone-800 rounded hover:border-amber-700 transition-colors">
                        <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">The Northern Platform</h4>
                        <p className="text-[11px] text-stone-400 font-sans">
                            Geological surveys reveal a bedrock plateau leveled by human hands on the north side of the Tel.
                            The dimensions match the 100x50 cubit courtyard perfectly. Rock-cut post holes suggest a semi-permanent tent structure stood there for centuries.
                        </p>
                    </div>
                    <div className="p-4 bg-black/70 border border-stone-800 rounded hover:border-amber-700 transition-colors">
                        <h4 className="text-amber-600 text-[10px] font-bold uppercase mb-2">The Bone Heaps</h4>
                        <p className="text-[11px] text-stone-400 font-sans">
                            Unlike Canaanite sites, the bone deposits at Shiloh are almost exclusively kosher animals (sheep, goat, cow).
                            More importantly, there is a statistical anomaly: a massive surplus of <strong>right-side</strong> bones. 
                            Leviticus 7:32 commands the "right thigh" be given to the priests. The archaeology proves the law was being kept.
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