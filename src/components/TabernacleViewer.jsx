import React, { useState } from 'react';

const TabernacleViewer = () => {
  const [activeView, setActiveView] = useState('overview');
  
  return (
    <div className="p-6 bg-stone-900 min-h-screen">
      <h1 className="text-3xl font-cinzel text-amber-500 mb-6">Humble Tabernacle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => setActiveView('overview')}
          className={`p-4 rounded border ${
            activeView === 'overview' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400'
              : 'bg-stone-800 border-stone-700 text-stone-300'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveView('dimensions')}
          className={`p-4 rounded border ${
            activeView === 'dimensions' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400'
              : 'bg-stone-800 border-stone-700 text-stone-300'
          }`}
        >
          Dimensions
        </button>
        <button 
          onClick={() => setActiveView('archaeology')}
          className={`p-4 rounded border ${
            activeView === 'archaeology' 
              ? 'bg-amber-900/40 border-amber-600 text-amber-400'
              : 'bg-stone-800 border-stone-700 text-stone-300'
          }`}
        >
          Archaeological Evidence
        </button>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          <div className="bg-stone-800 p-6 rounded-lg">
            <h2 className="text-xl font-cinzel text-amber-500 mb-3">Biblical Specifications</h2>
            <p className="text-stone-300">The Tabernacle was 30 cubits long × 10 cubits wide × 10 cubits high (Exodus 26:15-16)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-800 p-4 rounded">
              <h3 className="font-bold text-amber-500">Materials Used</h3>
              <ul className="list-disc list-inside text-stone-300 mt-2">
                <li>Acacia wood posts and beams</li>
                <li>Fine linen curtains</li>
                <li>Goat hair coverings</li>
                <li>Ram skins and dolphin skins</li>
              </ul>
            </div>
            
            <div className="bg-stone-800 p-4 rounded">
              <h3 className="font-bold text-amber-500">Archaeological Context</h3>
              <p className="text-stone-300 mt-2">Consistent with Second Temple period construction methods found at Temple Mount excavations.</p>
            </div>
          </div>
        </div>
      )}

      {activeView === 'dimensions' && (
        <div className="bg-stone-800 p-6 rounded-lg">
          <h2 className="text-xl font-cinzel text-amber-500 mb-4">Exact Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-amber-500">External Dimensions</h3>
              <table className="w-full text-sm">
                <tr><td className="border border-stone-700 px-2 py-1">Length:</td><td className="border border-stone-700 px-2 py-1">30 cubits</td></tr>
                <tr><td className="border border-stone-700 px-2 py-1">Width:</td><td className="border border-stone-700 px-2 py-1">10 cubits</td></tr>
                <tr><td className="border border-stone-700 px-2 py-1">Height:</td><td className="border border-stone-700 px-2 py-1">10 cubits</td></tr>
              </table>
            </div>
            
            <div>
              <h3 className="font-bold text-amber-500">Structural Elements</h3>
              <ul className="list-disc list-inside text-sm">
                <li>5 curtain sets (10 curtains total)</li>
                <li>20 sockets for posts</li>
                <li>10 posts per side</li>
                <li>Total area: 300 square cubits</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeView === 'archaeology' && (
        <div className="bg-stone-800 p-6 rounded-lg">
          <h2 className="text-xl font-cinzel text-amber-500 mb-4">Archaeological Evidence</h2>
          <p className="text-stone-300 mb-4">Construction methods and materials align with Second Temple period archaeological findings.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-stone-700 p-4 rounded">
              <h3 className="font-bold text-amber-500">Temple Mount Excavations</h3>
              <p className="text-xs mt-2">Evidence of similar construction techniques used in the First Temple era.</p>
            </div>
            
            <div className="border border-stone-700 p-4 rounded">
              <h3 className="font-bold text-amber-500">Ancient Near Eastern Patterns</h3>
              <p className="text-xs mt-2">Comparable to other ancient religious structures from the region.</p>
            </div>
            
            <div className="border border-stone-700 p-4 rounded">
              <h3 className="font-bold text-amber-500">Historical Consistency</h3>
              <p className="text-xs mt-2">Archaeological data supports biblical descriptions of tabernacle construction.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabernacleViewer;