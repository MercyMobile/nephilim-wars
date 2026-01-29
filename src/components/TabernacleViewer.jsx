import React, { useState, useRef, useEffect, useCallback } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);
  const fullscreenContainerRef = useRef(null);

  // Handle fullscreen state changes from browser
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIs3DFullscreen(isFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Toggle native fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = fullscreenContainerRef.current;
    if (!container) return;

    try {
      if (!is3DFullscreen) {
        // Enter fullscreen
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [is3DFullscreen]);

  // --- EDUCATIONAL CONTENT ---
  const breastplateStones = [
    { name: "Sardius", tribe: "Reuben", gradient: "radial-gradient(ellipse at 30% 20%, #ff6b6b 0%, #dc2626 40%, #7f1d1d 100%)", glow: "rgba(220, 38, 38, 0.6)", meaning: "The Firstborn" },
    { name: "Topaz", tribe: "Simeon", gradient: "radial-gradient(ellipse at 30% 20%, #fef08a 0%, #eab308 40%, #a16207 100%)", glow: "rgba(234, 179, 8, 0.6)", meaning: "Hearing" },
    { name: "Carbuncle", tribe: "Levi", gradient: "radial-gradient(ellipse at 30% 20%, #f87171 0%, #991b1b 40%, #450a0a 100%)", glow: "rgba(153, 27, 27, 0.5)", meaning: "Joined" },
    { name: "Emerald", tribe: "Judah", gradient: "radial-gradient(ellipse at 30% 20%, #6ee7b7 0%, #059669 40%, #064e3b 100%)", glow: "rgba(5, 150, 105, 0.6)", meaning: "Praise" },
    { name: "Sapphire", tribe: "Issachar", gradient: "radial-gradient(ellipse at 30% 20%, #93c5fd 0%, #2563eb 40%, #1e3a8a 100%)", glow: "rgba(37, 99, 235, 0.6)", meaning: "Reward" },
    { name: "Diamond", tribe: "Zebulun", gradient: "radial-gradient(ellipse at 30% 20%, #ffffff 0%, #e2e8f0 30%, #94a3b8 70%, #64748b 100%)", glow: "rgba(255, 255, 255, 0.8)", textDark: true, meaning: "Dwelling" },
    { name: "Jacinth", tribe: "Dan", gradient: "radial-gradient(ellipse at 30% 20%, #fdba74 0%, #ea580c 40%, #7c2d12 100%)", glow: "rgba(234, 88, 12, 0.6)", meaning: "Judge" },
    { name: "Agate", tribe: "Naphtali", gradient: "radial-gradient(ellipse at 30% 20%, #d6d3d1 0%, #78716c 40%, #44403c 100%)", glow: "rgba(120, 113, 108, 0.5)", meaning: "Wrestling" },
    { name: "Amethyst", tribe: "Gad", gradient: "radial-gradient(ellipse at 30% 20%, #c4b5fd 0%, #7c3aed 40%, #4c1d95 100%)", glow: "rgba(124, 58, 237, 0.6)", meaning: "Troop" },
    { name: "Beryl", tribe: "Asher", gradient: "radial-gradient(ellipse at 30% 20%, #5eead4 0%, #0d9488 40%, #134e4a 100%)", glow: "rgba(13, 148, 136, 0.6)", meaning: "Happy" },
    { name: "Onyx", tribe: "Joseph", gradient: "radial-gradient(ellipse at 30% 20%, #525252 0%, #171717 40%, #000000 100%)", glow: "rgba(82, 82, 82, 0.4)", meaning: "Adding" },
    { name: "Jasper", tribe: "Benjamin", gradient: "radial-gradient(ellipse at 30% 20%, #fca5a5 0%, #b91c1c 40%, #450a0a 100%)", glow: "rgba(185, 28, 28, 0.5)", meaning: "Son of Right Hand" }
  ];

  const garmentData = [
    { part: "The Ephod", detail: "A woven vest of gold, blue, purple, and scarlet. On its shoulders sat two onyx stones engraved with the names of the tribes. The High Priest literally carried the weight of the nation on his shoulders before God." },
    { part: "The Hoshen (Breastplate)", detail: "A 'device of decision'. A folded pouch containing the Urim and Thummim (Lights and Perfections). It was divine technology used to receive binary answers (Yes/No) from YHWH in times of crisis." },
    { part: "The Robe of the Ephod", detail: "Pure blue, symbolizing heaven. The hem was lined with alternating golden bells and pomegranates. The bells announced his movement; if the sound stopped, the people knew he had died in the Presence." },
    { part: "The Golden Plate (Tzitz)", detail: "A band of pure gold tied to the forehead, engraved with 'HOLINESS TO YHWH'. It atoned for errors in the holy offerings, allowing accepted worship despite human imperfection." }
  ];

  return (
    <div className="min-h-screen bg-parchment-200 p-4 md:p-8 font-garamond text-stone-900 selection:bg-gold-500/30">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="font-cinzel text-5xl text-amber-800 tracking-widest uppercase">The Mishkan</h1>
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
                <div
                    ref={fullscreenContainerRef}
                    className={`relative ${is3DFullscreen ? 'bg-black' : ''}`}
                >
                    <iframe
                        src="/humble-tabernacle/gptab.html"
                        title="The Tabernacle of Moses - Interactive 3D Model"
                        className={`${is3DFullscreen ? 'w-screen h-screen' : 'w-full h-[600px] rounded-xl border-2 border-amber-700/50'}`}
                        style={{ border: 'none' }}
                        allow="fullscreen"
                    />
                    <button
                        onClick={toggleFullscreen}
                        className={`absolute ${is3DFullscreen ? 'top-4 right-4' : 'top-2 right-2'} bg-stone-900/80 hover:bg-stone-800 text-gold-400 px-3 py-1.5 rounded-lg border border-amber-600/50 font-cinzel text-xs tracking-wide transition-all hover:scale-105 z-10`}
                    >
                        {is3DFullscreen ? '✕ EXIT' : '⛶ FULLSCREEN'}
                    </button>
                </div>
                {!is3DFullscreen && (
                    <div className="mt-6 p-4 border-l-4 border-amber-600 bg-parchment-100 text-sm text-stone-700 leading-relaxed">
                        <p><strong>Interactive 3D Model:</strong> Click on sacred objects to learn about their biblical significance. The Courtyard measures 100×50 cubits with white linen walls (purity) on bronze pillars (judgment). Inside stands the Mishkan (30×10 cubits) - gold (divinity) resting on silver (redemption).</p>
                    </div>
                )}
            </div>
          )}

          {/* ELEMENTS TAB */}
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

          {/* GARMENTS TAB */}
          {activeView === 'garments' && (
            <div className="animate-fadeIn">
              <h2 className="font-cinzel text-amber-800 text-xl mb-6 uppercase tracking-[0.2em] text-center">Vestments of Glory</h2>
              
              {/* Breastplate Grid */}
              <div className="max-w-sm mx-auto grid grid-cols-3 gap-3 bg-stone-900 p-5 rounded-lg border-2 border-amber-600 shadow-xl mb-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">The Hoshen</div>
                {breastplateStones.map((stone, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg group relative overflow-hidden flex flex-col items-center justify-center cursor-help transition-transform hover:scale-105"
                    style={{
                      background: stone.gradient,
                      boxShadow: `
                        inset 0 -8px 12px rgba(0,0,0,0.4),
                        inset 0 4px 8px rgba(255,255,255,0.25),
                        0 0 15px ${stone.glow},
                        0 4px 6px rgba(0,0,0,0.5)
                      `,
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}
                  >
                     {/* Highlight shine effect */}
                     <div
                       className="absolute top-1 left-1 w-3 h-3 rounded-full opacity-70"
                       style={{
                         background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)'
                       }}
                     />
                     {/* Secondary highlight */}
                     <div
                       className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full opacity-50"
                       style={{
                         background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
                       }}
                     />
                     <span className={`text-[7px] font-bold uppercase z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${stone.textDark ? 'text-stone-800' : 'text-white/95'}`}>{stone.tribe}</span>
                     <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center backdrop-blur-sm">
                        <span className="text-[8px] text-gold-300 leading-tight font-semibold">{stone.meaning}</span>
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

          {/* ARCHAEOLOGY TAB */}
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
