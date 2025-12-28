import React, { useState } from 'react';

// SAMPLE DATA (You can expand this later)
const BESTIARY_DATA = [
  { 
    id: 1, name: "Goliath of Gath", type: "Rephaim Giant", 
    hp: 140, ac: 16, cr: 8,
    desc: "A champion of the Philistines, six cubits and a span tall. His spear shaft is like a weaver's beam.",
    stats: "STR 24 | DEX 10 | CON 22 | INT 10 | WIS 12 | CHA 14",
    actions: ["Spear Thrust +12 (3d8+7)", "Shield Bash +8 (1d8+5)"]
  },
  { 
    id: 2, name: "Ohya", type: "Nephilim Warlord", 
    hp: 200, ac: 18, cr: 12,
    desc: "One of the sons of Semyaza. He dreams of the coming flood and commands legions of lesser giants.",
    stats: "STR 26 | DEX 14 | CON 24 | INT 16 | WIS 10 | CHA 18",
    actions: ["Sword of Wrath +14 (4d10+8)", "Command of Fear (Wis Save DC 16)"]
  },
  { 
    id: 3, name: "Baal-Priest", type: "Human Cultist", 
    hp: 45, ac: 12, cr: 3,
    desc: "A corrupted servant of the storm god, wielding dark rituals to summon storms and curse the righteous.",
    stats: "STR 10 | DEX 12 | CON 12 | INT 14 | WIS 16 | CHA 14",
    actions: ["Sacrificial Dagger +5 (1d4+2)", "Call Lightning (DC 13)"]
  }
];

const BestiaryScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filtered = BESTIARY_DATA.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-stone-900 text-stone-200 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
      
      {/* LEFT COLUMN: LIST & SEARCH */}
      <div className="w-full md:w-1/3 bg-black/40 border border-stone-700 rounded-xl p-4 flex flex-col gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search the archives..." 
            className="w-full bg-stone-800 border border-stone-600 rounded p-3 pl-10 text-stone-100 focus:border-amber-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3 text-stone-500">🔍</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {filtered.map(monster => (
            <div 
              key={monster.id}
              onClick={() => setSelectedEntry(monster)}
              className={`p-3 rounded cursor-pointer border hover:border-amber-500 transition-all ${selectedEntry?.id === monster.id ? 'bg-amber-900/30 border-amber-600' : 'bg-stone-800 border-stone-800'}`}
            >
              <h3 className="font-bold text-amber-100">{monster.name}</h3>
              <p className="text-xs text-stone-500 uppercase tracking-wide">{monster.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: DETAILS CARD */}
      <div className="w-full md:w-2/3 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-stone-800 rounded-xl border-2 border-stone-700 p-8 shadow-2xl overflow-y-auto relative">
        {selectedEntry ? (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="border-b-2 border-amber-700 pb-4 mb-6 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-serif text-amber-500 mb-2">{selectedEntry.name}</h1>
                <span className="bg-stone-900 text-stone-400 px-3 py-1 rounded text-sm font-bold border border-stone-700">{selectedEntry.type}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-500">{selectedEntry.hp} HP</div>
                <div className="text-stone-500 text-sm">AC: {selectedEntry.ac} | CR: {selectedEntry.cr}</div>
              </div>
            </div>

            <p className="italic text-stone-400 mb-6 text-lg leading-relaxed">"{selectedEntry.desc}"</p>
            
            <div className="bg-black/30 p-4 rounded border border-stone-600 mb-6 font-mono text-xs md:text-sm text-center text-amber-200/80">
              {selectedEntry.stats}
            </div>

            <h3 className="text-xl font-bold text-amber-100 mb-4 border-b border-stone-700 pb-2">Actions</h3>
            <div className="space-y-3">
              {selectedEntry.actions.map((act, i) => (
                <div key={i} className="bg-stone-900/50 p-3 rounded border-l-4 border-red-900">
                  <span className="text-stone-200 font-bold">⚔️ {act}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-stone-600 opacity-50">
            <span className="text-6xl mb-4">📜</span>
            <p className="text-xl uppercase tracking-widest">Select a record to view</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestiaryScreen;