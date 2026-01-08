import React, { useState } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('sanctuary');
  const [hoveredElement, setHoveredElement] = useState(null);

  // Data reflecting the sacred architecture
  const sacredSpecs = {
    materials: [
      { item: "Gold", meaning: "Divine Nature / Royalty", usage: "Ark, Menorah, Table" },
      { item: "Silver", meaning: "Redemption", usage: "Sockets for the boards" },
      { item: "Bronze", meaning: "Judgment / Strength", usage: "Altar, Basin" },
      { item: "Acacia", meaning: "Incorruptibility", usage: "Structural Beams" }
    ],
    layers: [
      { name: "Inner Linen", detail: "Blue, Purple, Scarlet with Cherubim" },
      { name: "Goat Hair", detail: "The 'Tent' covering" },
      { name: "Ram Skins", detail: "Dyed Red" },
      { name: "Tachash Skins", detail: "Outer protection (Dolphin/Dugong/Fine Leather)" }
    ]
  };

  const TabernacleVisual = () => (
    <div className="relative w-full h-[450px] bg-[#0a0a0a] rounded-xl overflow-hidden border border-amber-900/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center mt-4">
      {/* The Wilderness Floor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1510_0%,_#000_100%)] opacity-80"></div>
      
      {/* Sacred Glow */}
      <div className="absolute w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] animate-pulse"></div>

      {/* The Structure */}
      <div className="relative transform-gpu transition-all duration-1000 ease-in-out scale-110">
        {/* The Golden Frame */}
        <div className="w-64 h-32 border-2 border-amber-600/40 bg-gradient-to-b from-amber-950/80 to-stone-900 shadow-[0_0_20px_rgba(217,119,6,0.2)] relative">
          
          {/* The Veil (Parochet) */}
          <div className="absolute inset-y-0 left-1/3 w-1 bg-gradient-to-b from-blue-900 via-purple-900 to-red-900 shadow-[0_0_15px_rgba(75,0,130,0.5)]"></div>
          
          {/* Holy of Holies Glow */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-amber-500/5 flex items-center justify-center">
            <div className="w-8 h-8 border border-amber-400/30 rounded-sm rotate-45 animate-spin-slow"></div>
          </div>

          {/* Golden Pillars */}
          <div className="absolute inset-0 flex justify-between px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-full bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 opacity-60"></div>
            ))}
          </div>
        </div>
        
        {/* Foundation Sockets (Silver) */}
        <div className="absolute -bottom-2 w-full flex justify-between px-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-2 bg-stone-400 rounded-b-sm shadow-sm border-t border-white/20"></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 text-center">
        <p className="text-amber-500 font-cinzel text-sm tracking-[0.3em] uppercase">The Pattern Shown on the Mountain</p>
        <p className="text-stone-500 text-[10px] mt-1 italic">Exodus 25:40</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#050505] min-h-screen font-serif text-stone-200">
      {/* Header with "Gold Edge" */}
      <header className="max-w-6xl mx-auto text-center mb-12 relative">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-600/50 to-transparent mb-8"></div>
        <h1 className="text-5xl font-cinzel tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700">
          MISHKAN
        </h1>
        <p className="text-stone-500 mt-2 tracking-[0.2em] text-sm italic">The Dwelling Place of the Infinite</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation - Ornate Sidebar */}
        <nav className="lg:col-span-3 space-y-4">
          {['sanctuary', 'pattern', 'elements', 'excavation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveView(tab)}
              className={`w-full text-left p-4 transition-all duration-500 border-l-2 group ${
                activeView === tab 
                ? 'border-amber-500 bg-amber-950/20 text-amber-200' 
                : 'border-stone-800 hover:border-amber-700 text-stone-500'
              }`}
            >
              <span className="block text-[10px] uppercase tracking-tighter opacity-50">View Section</span>
              <span className="text-lg font-cinzel capitalize group-hover:pl-2 transition-all">{tab}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-stone-900/30 p-8 rounded-lg border border-stone-800/50 backdrop-blur-sm">
          
          {activeView === 'sanctuary' && (
            <div className="animate-fadeIn">
              <TabernacleVisual />
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-amber-500 font-cinzel mb-4 border-b border-amber-900/30 pb-2">The Two Chambers</h3>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p><strong className="text-stone-300">The Holy Place:</strong> 20 cubits long. Containing the Menorah (Light), Table (Bread), and Altar of Incense (Prayer).</p>
                    <p><strong className="text-stone-300">Holy of Holies:</strong> A perfect cube of 10x10x10 cubits. The space of the Ark, where the Cloud of Glory descended.</p>
                  </div>
                </div>
                <div className="bg-stone-800/20 p-4 rounded-lg border border-amber-600/10">
                  <h3 className="text-amber-500 font-cinzel mb-4 text-sm">Sacred Materials</h3>
                  <div className="space-y-2">
                    {sacredSpecs.materials.map((m, i) => (
                      <div key={i} className="flex justify-between text-xs border-b border-stone-800 pb-1">
                        <span className="text-stone-400 font-bold">{m.item}</span>
                        <span className="text-stone-500 italic">{m.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'pattern' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-3xl font-cinzel text-amber-500">Divine Geometry</h2>
              <p className="text-stone-400 leading-relaxed italic">
                "See that you make them according to the pattern shown you on the mountain."
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "The Cubit", val: "approx 18-21 inches", desc: "Based on the forearm, connecting human scale to divine space." },
                  { title: "The Ratio", val: "1.5 : 2.5", desc: "The Ark's dimensions align with the Golden Ratio, reflecting creation's math." },
                  { title: "Orientation", val: "East-West", desc: "Facing the rising sun, symbolizing the return to Eden." }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-stone-800/40 border border-stone-700 rounded shadow-lg">
                    <div className="text-amber-600 text-[10px] uppercase font-bold mb-1">{item.title}</div>
                    <div className="text-xl text-stone-200 mb-2">{item.val}</div>
                    <div className="text-xs text-stone-500 leading-tight">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'excavation' && (
            <div className="animate-fadeIn space-y-4">
              <h2 className="text-2xl font-cinzel text-amber-500">The Shiloh Context</h2>
              <div className="h-48 bg-stone-800 rounded-lg flex items-center justify-center border border-stone-700 overflow-hidden">
                 <div className="text-center p-8">
                   <p className="text-stone-400 text-sm">Archaeological footprints at Ancient Shiloh reveal a platform consistent with the Tabernacle's dimensions, including rock-hewn holes for the poles.</p>
                 </div>
              </div>
              <p className="text-xs text-stone-500 italic text-center uppercase tracking-widest">Bridging Faith and Soil</p>
            </div>
          )}
          
          {/* Default view content for 'elements' omitted for brevity but follows the same style */}

        </div>
      </main>
      
      <footer className="mt-20 text-center text-stone-600 text-[10px] tracking-[0.5em] uppercase pb-10">
        Constructed in Virtu • 2026
      </footer>
    </div>
  );
};

export default TabernacleViewer;