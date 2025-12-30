import React from 'react';

const CharacterSheet = ({ character, onClose }) => {
  if (!character) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="char-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-stone-900 border-2 border-amber-700 w-full max-w-4xl rounded-lg shadow-2xl relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close Character Sheet"
          className="absolute top-2 right-2 z-10 text-gray-400 hover:text-white p-2 text-xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ×
        </button>

        {/* SECTION 1: VISUALS (Left Col) */}
        <div className="md:w-1/3 relative group">
          <img 
            src={character.portrait} 
            alt={`Portrait of ${character.name}, a ${character.class || 'warrior'}`} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          {/* Overlay Stats for Quick Glance */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 pt-12">
            <h1 id="char-name" className="text-3xl font-serif text-amber-500 font-bold">{character.name}</h1>
            <p className="text-stone-300 italic">{character.race || 'Human'} • Level {character.level || 1}</p>
          </div>
        </div>

        {/* SECTION 2: STATS (Right Col) */}
        <div className="flex-1 p-8 text-stone-200 font-serif">
          
          {/* Vitals Grid */}
          <section aria-labelledby="vitals-heading" className="grid grid-cols-3 gap-4 mb-8 text-center bg-black/40 p-4 rounded border border-stone-800">
            <h2 id="vitals-heading" className="sr-only">Vitals</h2>
            
            <div className="flex flex-col">
              <span className="text-xs uppercase text-stone-500 tracking-widest">Health</span>
              <span className="text-2xl font-bold text-red-500">{character.hp} <span className="text-sm text-stone-600">/ {character.maxHp}</span></span>
            </div>
            
            <div className="flex flex-col border-x border-stone-800">
              <span className="text-xs uppercase text-stone-500 tracking-widest">Defense (AC)</span>
              <span className="text-2xl font-bold text-blue-400">{character.defense}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs uppercase text-stone-500 tracking-widest">Initiative</span>
              <span className="text-2xl font-bold text-amber-400">{character.initiativeBonus >= 0 ? '+' : ''}{character.initiativeBonus}</span>
            </div>
          </section>

          {/* Soul Economy (From index.html rules) */}
          <section aria-labelledby="soul-heading" className="mb-8 grid grid-cols-2 gap-6">
            <h2 id="soul-heading" className="sr-only">Soul Economy</h2>
            
            <div className="bg-stone-950 p-3 rounded border-l-4 border-blue-600">
              <h3 className="text-blue-500 font-bold text-sm uppercase mb-1">Righteousness (RP)</h3>
              <div className="text-xl">{character.rp || 0}</div>
              <p className="text-xs text-stone-500 mt-1">Spend to reroll dice or heal allies.</p>
            </div>

            <div className="bg-stone-950 p-3 rounded border-l-4 border-red-800">
              <h3 className="text-red-600 font-bold text-sm uppercase mb-1">Corruption (CP)</h3>
              <div className="text-xl">{character.cp || 0}</div>
              <p className="text-xs text-stone-500 mt-1">High CP reduces Initiative.</p>
            </div>
          </section>

          {/* Actions List */}
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="text-amber-500 border-b border-amber-900 pb-2 mb-4 font-bold">Combat Actions</h2>
            <ul className="space-y-3">
              {character.actions.map((action, i) => (
                <li key={i} className="flex justify-between items-center bg-stone-800/50 p-3 rounded hover:bg-stone-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {action.type === 'melee' ? '⚔️' : '🏹'}
                    </span>
                    <div>
                      <div className="font-bold text-white">{action.name}</div>
                      <div className="text-xs text-stone-400 capitalize">{action.type} • {action.cost} AP</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-amber-200 font-bold">{action.damageDice} + {action.damageBonus}</div>
                    <div className="text-[10px] uppercase text-stone-500">{action.damageType}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;