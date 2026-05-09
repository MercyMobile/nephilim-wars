import React from 'react';

export default function ProfileTab({ character }) {
  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-xl font-cinzel text-amber-500 mb-3">No Character Created</h2>
        <p className="text-stone-400 font-serif italic mb-6 max-w-sm">
          No character created yet. Use the Create Character screen to forge your legend.
        </p>
        <button
          className="px-6 py-2 bg-amber-900/30 border border-amber-600 text-amber-400 font-cinzel uppercase tracking-wider rounded hover:bg-amber-900/50 transition-colors"
          disabled
        >
          Create Character
        </button>
      </div>
    );
  }

  const ancestryTraits = character.ancestryTraits || character.traits || character.ancestry?.traits || [];
  const heritage = character.heritage || character.heritageName;
  const background = character.background || character.backgroundName || character.gameBackground;
  const size = character.size || 'Medium';
  const speed = character.speed || 30;
  const height = character.height || character.displayHeight;

  const ancestryLabel = character.ancestry?.name || character.lineage || character.ancestry || character.race;
  const classLabel = character.class?.label || character.class?.value || character.className || character.class;
  const rp = character.soulEconomy?.rp ?? character.rp ?? 0;
  const cp = character.soulEconomy?.cp ?? character.cp ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Portrait */}
      {character.portrait && (
        <div className="relative group mx-auto max-w-xs">
          <img
            src={character.portrait}
            alt={`Portrait of ${character.name}`}
            className="w-full rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      )}

      {/* Name */}
      <h1 className="text-2xl font-cinzel text-amber-500 text-center">
        {character.name}
      </h1>

      {/* Ancestry / Class / Level subtitle */}
      <p className="text-stone-400 italic text-center font-serif">
        {[ancestryLabel, classLabel, `Level ${character.level || 1}`]
          .filter(Boolean)
          .join(' • ')}
      </p>

      {/* Heritage & Background badges */}
      <div className="flex flex-wrap justify-center gap-2">
        {heritage && (
          <span className="bg-amber-900/30 border border-amber-600 text-amber-400 px-2 py-1 text-xs rounded font-cinzel uppercase tracking-wider">
            {heritage}
          </span>
        )}
        {background && (
          <span className="bg-stone-800 border border-stone-600 text-stone-300 px-2 py-1 text-xs rounded font-cinzel uppercase tracking-wider">
            {background}
          </span>
        )}
      </div>

      {/* Size / Speed / Height row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-stone-950 p-3 rounded text-center border border-stone-800">
          <div className="text-xs text-stone-500 uppercase tracking-widest font-cinzel">Size</div>
          <div className="text-stone-200 font-serif mt-1">{size}</div>
        </div>
        <div className="bg-stone-950 p-3 rounded text-center border border-stone-800">
          <div className="text-xs text-stone-500 uppercase tracking-widest font-cinzel">Speed</div>
          <div className="text-stone-200 font-serif mt-1">{speed} ft</div>
        </div>
        <div className="bg-stone-950 p-3 rounded text-center border border-stone-800">
          <div className="text-xs text-stone-500 uppercase tracking-widest font-cinzel">Height</div>
          <div className="text-stone-200 font-serif mt-1">{height}</div>
        </div>
      </div>

      {/* Ancestry traits */}
      {ancestryTraits.length > 0 && (
        <div>
          <h3 className="text-xs text-stone-500 uppercase tracking-widest font-cinzel mb-2">Ancestry Traits</h3>
          <div className="flex flex-wrap gap-2">
            {ancestryTraits.map((trait, i) => (
              <span
                key={i}
                className="bg-amber-900/20 border border-amber-700/40 text-amber-300 px-2 py-1 text-xs rounded font-serif"
              >
                {typeof trait === 'string' ? trait : trait.name || trait.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* RP / CP display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-stone-950 p-3 rounded border-l-4 border-blue-600">
          <h3 className="text-blue-500 font-bold text-xs uppercase mb-1 font-cinzel">Righteousness (RP)</h3>
          <div className="text-xl text-stone-200 font-serif">{rp}</div>
        </div>
        <div className="bg-stone-950 p-3 rounded border-l-4 border-red-800">
          <h3 className="text-red-600 font-bold text-xs uppercase mb-1 font-cinzel">Corruption (CP)</h3>
          <div className="text-xl text-stone-200 font-serif">{cp}</div>
        </div>
      </div>

      {/* Edit button placeholder */}
      <div className="text-center pt-2">
        <button className="px-6 py-2 border border-stone-700 text-stone-400 font-cinzel uppercase tracking-wider text-sm rounded hover:border-amber-600 hover:text-amber-400 transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
}