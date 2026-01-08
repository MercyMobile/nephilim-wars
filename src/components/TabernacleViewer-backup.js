import React, { useState } from 'react';

const TabernacleViewer = () => {
  // Main Tab Navigation State
  const [activeView, setActiveView] = useState('overview');
  
  // Sub-state specifically for the 3D Model view (Exterior vs Interior)
  const [modelSubView, setModelSubView] = useState('exterior');

  // --- 3D VISUALIZATION COMPONENT ---
  const Tabernacle3DVisualization = () => (
    <div className="relative w-full h-96 bg-gradient-to-b from-stone-800 to-stone-900 rounded-lg overflow-hidden border border-amber-900/30 shadow-inner flex items-center justify-center mt-4">
      
      {/* Ground Plane (Sand) */}
      <div className="absolute bottom-0 w-full h-1/3 bg-[#d6c096] opacity-10"></div>

      {/* Tabernacle Container - Centered */}
      <div className={`relative mt-16 transition-transform duration-700 ${modelSubView === 'interior' ? 'scale-150' : 'scale-100'}`}>
        
        {/* Roof (Tent Layers) - Only visible in Exterior view */}
        <div 
          className={`absolute -top-12 left-1/2 transform -translate-x-1/2 w-56 h-16 bg-gradient-to-b from-amber-900 to-amber-800 transition-opacity duration-500 ${modelSubView === 'interior' ? 'opacity-10' : 'opacity-100'}`}
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        ></div>

        {/* Main Structure (Walls) */}
        <div className="relative w-48 h-32 bg-amber-950 border-x-4 border-t-2 border-amber-800 shadow-2xl mx-auto flex justify-between px-4">
          
          {/* Left Pillar */}
          <div className="w-2 h-full bg-gradient-to-r from-amber-600 to-amber-800 rounded-sm"></div>
          
          {/* Entrance / Veil */}
          <div className="w-24 h-full bg-indigo-900/40 border-x border-amber-500/30 flex flex-col items-center justify-end pb-2 relative overflow-hidden">
             {/* Veil Texture Effect */}
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-transparent to-transparent"></div>
             
             {/* Cherubim Placeholder (Abstract) */}
             <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 mb-4 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-amber-500/50"></div>
             </div>
          </div>

          {/* Right Pillar */}
          <div className="w-2 h-full bg-gradient-to-r from-amber-600 to-amber-800 rounded-sm"></div>
        </div>

        {/* Side Curtains (Visual Depth) */}
        <div className={`absolute top-0 -left-4 w-4 h-32 bg-stone-800 transform skew-y-12 origin-top-right transition-opacity duration-500 ${modelSubView === 'interior' ? 'opacity-0' : 'opacity-100'}`}></div>
        <div className={`absolute top-0 -right-4 w-4 h-32 bg-stone-800 transform -skew-y-12 origin-top-left transition-opacity duration-500 ${modelSubView === 'interior' ? 'opacity-0' : 'opacity-100'}`}></div>

      </div>

      {/* Label Overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-stone-500 font-cinzel">
        {modelSubView === 'exterior' ? 'VIEW: EXTERIOR COURT' : 'VIEW: HOLY PLACE ENTRANCE'}
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-stone-900 min-h-screen">
      <h1 className="text-3xl font-cinzel text-amber-500 mb-6">Humble Tabernacle</h1>
      
      {/* --- NAVIGATION TABS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => setActiveView('overview')}
          className={`p-4 rounded border transition-colors ${
            activeView === 'overview' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400' 
              : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-900'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveView('dimensions')}
          className={`p-4 rounded border transition-colors ${
            activeView === 'dimensions' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400' 
              : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-900'
          }`}
        >
          Dimensions
        </button>
        <button 
          onClick={() => setActiveView('archaeology')}
          className={`p-4 rounded border transition-colors ${
            activeView === 'archaeology' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400' 
              : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-900'
          }`}
        >
          Archaeology
        </button>
        {/* NEW TAB BUTTON */}
        <button 
          onClick={() => setActiveView('3dmodel')}
          className={`p-4 rounded border transition-colors ${
            activeView === '3dmodel' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400' 
              : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-amber-900'
          }`}
        >
          3D Model
        </button>
      </div>

      {/* --- CONTENT: OVERVIEW --- */}
      {activeView === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-stone-800 p-6 rounded-lg border border-stone-700">
            <h2 className="text-xl font-cinzel text-amber-500 mb-3">Biblical Specifications</h2>
            <p className="text-stone-300">The Tabernacle was 30 cubits long × 10 cubits wide × 10 cubits high (Exodus 26:15-16)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-800 p-4 rounded border border-stone-700">
              <h3 className="font-bold text-amber-500">Materials Used</h3>
              <ul className="list-disc list-inside text-stone-300 mt-2">
                <li>Acacia wood posts and beams</li>
                <li>Fine linen curtains</li>
                <li>Goat hair coverings</li>
                <li>Ram skins and dolphin skins</li>
              </ul>
            </div>
            
            <div className="bg-stone-800 p-4 rounded border border-stone-700">
              <h3 className="font-bold text-amber-500">Archaeological Context</h3>
              <p className="text-stone-300 mt-2">Consistent with Second Temple period construction methods found at Temple Mount excavations.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT: DIMENSIONS --- */}
      {activeView === 'dimensions' && (
        <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 animate-fadeIn">
          <h2 className="text-xl font-cinzel text-amber-500 mb-4">Exact Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-amber-500">External Dimensions</h3>
              <table className="w-full text-sm text-stone-300 mt-2">
                <tbody>
                  <tr><td className="border border-stone-600 px-2 py-1">Length:</td><td className="border border-stone-600 px-2 py-1">30 cubits</td></tr>
                  <tr><td className="border border-stone-600 px-2 py-1">Width:</td><td className="border border-stone-600 px-2 py-1">10 cubits</td></tr>
                  <tr><td className="border border-stone-600 px-2 py-1">Height:</td><td className="border border-stone-600 px-2 py-1">10 cubits</td></tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="font-bold text-amber-500">Structural Elements</h3>
              <ul className="list-disc list-inside text-sm text-stone-300 mt-2">
                <li>5 curtain sets (10 curtains total)</li>
                <li>20 sockets for posts</li>
                <li>10 posts per side</li>
                <li>Total area: 300 square cubits</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT: ARCHAEOLOGY --- */}
      {activeView === 'archaeology' && (
        <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 animate-fadeIn">
          <h2 className="text-xl font-cinzel text-amber-500 mb-4">Archaeological Evidence</h2>
          <p className="text-stone-300 mb-4">Construction methods and materials align with Second Temple period archaeological findings.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-stone-700 p-4 rounded bg-stone-900/50">
              <h3 className="font-bold text-amber-500">Temple Mount Excavations</h3>
              <p className="text-xs text-stone-400 mt-2">Evidence of similar construction techniques used in the First Temple era.</p>
            </div>
            
            <div className="border border-stone-700 p-4 rounded bg-stone-900/50">
              <h3 className="font-bold text-amber-500">Ancient Near Eastern Patterns</h3>
              <p className="text-xs text-stone-400 mt-2">Comparable to other ancient religious structures from the region.</p>
            </div>
            
            <div className="border border-stone-700 p-4 rounded bg-stone-900/50">
              <h3 className="font-bold text-amber-500">Historical Consistency</h3>
              <p className="text-xs text-stone-400 mt-2">Archaeological data supports biblical descriptions of tabernacle construction.</p>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT: 3D MODEL (NEW) --- */}
      {activeView === '3dmodel' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center bg-stone-800 p-3 rounded-t-lg border-x border-t border-stone-700">
             <h2 className="font-cinzel text-amber-500">Interactive Visualization</h2>
             <div className="space-x-2">
                <button 
                  onClick={() => setModelSubView('exterior')}
                  className={`px-3 py-1 text-xs rounded border ${modelSubView === 'exterior' ? 'bg-amber-700 border-amber-500 text-white' : 'border-stone-600 text-stone-400'}`}
                >
                  Exterior
                </button>
                <button 
                  onClick={() => setModelSubView('interior')}
                  className={`px-3 py-1 text-xs rounded border ${modelSubView === 'interior' ? 'bg-amber-700 border-amber-500 text-white' : 'border-stone-600 text-stone-400'}`}
                >
                  Interior Focus
                </button>
             </div>
          </div>
          
          <div className="bg-stone-800 p-4 rounded-b-lg border border-stone-700 min-h-[400px]">
            <Tabernacle3DVisualization />
            <p className="text-center text-xs text-stone-500 mt-4 italic">
              *Visual representation based on Exodus descriptions. CSS-generated geometry.*
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default TabernacleViewer;