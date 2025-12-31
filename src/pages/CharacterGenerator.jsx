import React, { useState } from 'react';

const CharacterGenerator = ({ onCharacterComplete }) => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '',
    lineage: 'Sethite',
    charClass: 'Warrior',
    sex: 'Male',
    visuals: '',
    // Base 5e Attributes (Standard Array-ish)
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
  });

  const [loading, setLoading] = useState(false);
  const [portrait, setPortrait] = useState(null); 
  const [error, setError] = useState('');

  // --- LORE RULES (Based on index.html) ---
  const LORE = {
    Sethite: { 
      desc: "Keepers of the original faith. +2 WIS, +1 CHA.",
      bonuses: { WIS: 2, CHA: 1 },
      startingRP: 1, // Righteousness Points
      startingCP: 0,
      hpBonus: 0
    },
    Cainite: { 
      desc: "City builders and masters of the forge. +2 STR, +1 INT.",
      bonuses: { STR: 2, INT: 1 },
      startingRP: 0,
      startingCP: 1, // Corruption Points
      hpBonus: 0
    },
    Nephilim: { 
      desc: "Giant-blooded warriors. +2 STR, +1 CON. Large Size.",
      bonuses: { STR: 2, CON: 1 },
      startingRP: 0,
      startingCP: 2, // Start with Corruption per lore
      hpBonus: 5     // Extra HP for being large/tough
    }
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttrChange = (attr, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: parseInt(value) || 10 }
    }));
  };

  // --- 1. GENERATE IMAGE ---
  const handleGenerate = async () => {
    if (!formData.visuals) {
      setError("Please describe your character's appearance.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Create a rich prompt
      const fullPrompt = `Fantasy character portrait, ${formData.sex} ${formData.lineage} ${formData.charClass}, ${formData.visuals}, ancient near east setting, biblical fantasy, realistic, dramatic lighting, 8k resolution`;

      // CRITICAL FIX: Send payload exactly as your backend expects it
      // Your generate-image.js expects: const { prompt } = await request.json();
      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || "Generation failed");
      }
      
      if (data.image) {
        setPortrait(`data:image/jpeg;base64,${data.image}`);
      } else {
        throw new Error("No image data received");
      }

    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. CALCULATE & SAVE ---
  const handleSave = () => {
    if (!formData.name || !portrait) {
      setError("Name and Portrait are required.");
      return;
    }

    // A. Apply Lineage Bonuses
    const finalStats = { ...formData.attributes };
    const loreData = LORE[formData.lineage];
    
    Object.entries(loreData.bonuses).forEach(([stat, bonus]) => {
      finalStats[stat] += bonus;
    });

    // B. Calculate 5e Modifiers
    const getMod = (score) => Math.floor((score - 10) / 2);
    const strMod = getMod(finalStats.STR);
    const dexMod = getMod(finalStats.DEX);
    const conMod = getMod(finalStats.CON);

    // C. Calculate Derived Stats
    const proficiency = 2; // Level 1 standard
    const maxHp = 10 + conMod + loreData.hpBonus;
    const defense = 10 + dexMod; // Unarmored defense or basic leather

    // D. Define Actions based on Class (Simple loadout)
    let mainAction = {};
    
    if (formData.charClass === 'Hunter') {
        mainAction = {
            id: 'w1', name: 'Composite Bow', type: 'ranged', cost: 1,
            toHitBonus: proficiency + dexMod,
            damageDice: '1d8', damageBonus: dexMod, damageType: 'piercing'
        };
    } else if (formData.charClass === 'Priest') {
        mainAction = {
            id: 'w1', name: 'Bronze Staff', type: 'melee', cost: 1,
            toHitBonus: proficiency + strMod,
            damageDice: '1d6', damageBonus: strMod, damageType: 'bludgeoning'
        };
    } else {
        // Warrior default
        mainAction = {
            id: 'w1', name: 'Bronze Khopesh', type: 'melee', cost: 1,
            toHitBonus: proficiency + strMod,
            damageDice: '1d8', damageBonus: strMod, damageType: 'slashing'
        };
    }

    // E. Construct Character Object
    const newCharacter = {
      id: 'p1',
      name: formData.name,
      isPlayer: true,
      portrait: portrait,
      lineage: formData.lineage,
      class: formData.charClass,
      attributes: finalStats,
      
      // Combat Screen Specifics
      hp: maxHp,
      maxHp: maxHp,
      defense: defense,
      initiativeBonus: dexMod,
      
      // Soul Economy
      rp: loreData.startingRP,
      cp: loreData.startingCP,

      actions: [mainAction]
    };

    // F. Save
    localStorage.setItem('generatedCharacter', JSON.stringify(newCharacter));

    if (onCharacterComplete) {
      onCharacterComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#d6d3d1] font-serif flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- LEFT PANEL: THE FORGE --- */}
        <div className="border-2 border-[#78350f] bg-[#1c1917]/95 p-8 shadow-[0_0_40px_rgba(245,158,11,0.1)] rounded-sm">
          <h1 className="text-4xl text-[#fcd34d] font-cinzel font-bold mb-6 border-b border-[#78350f] pb-2 tracking-widest text-center shadow-black drop-shadow-lg">
            SOUL FORGE
          </h1>

          <div className="space-y-5">
            
            {/* NAME */}
            <div>
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Adoniram"
                className="w-full bg-black border border-[#44403c] p-3 text-xl text-white focus:border-[#f59e0b] outline-none"
              />
            </div>

            {/* LINEAGE & SEX */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Lineage</label>
                    <select 
                        name="lineage"
                        value={formData.lineage}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
                    >
                        <option value="Sethite">Sethite</option>
                        <option value="Cainite">Cainite</option>
                        <option value="Nephilim">Nephilim</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Sex</label>
                    <select 
                        name="sex"
                        value={formData.sex} // Assuming you might add this to state
                        onChange={(e) => setFormData({...formData, sex: e.target.value})}
                        className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            {/* LORE INFO */}
            <div className="bg-[#292524] p-3 border-l-2 border-[#f59e0b] text-xs text-[#a8a29e]">
              <p className="italic mb-1">{LORE[formData.lineage].desc}</p>
              <p className="text-[#fcd34d] font-bold">
                Bonuses: {Object.entries(LORE[formData.lineage].bonuses).map(([k,v]) => `+${v} ${k}`).join(', ')}
              </p>
            </div>

            {/* CLASS & VISUALS */}
            <div>
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Class</label>
              <select 
                name="charClass"
                value={formData.charClass}
                onChange={handleChange}
                className="w-full bg-black border border-[#44403c] p-2 text-white outline-none mb-4"
              >
                <option>Warrior</option>
                <option>Hunter</option>
                <option>Priest</option>
                <option>Scholar</option>
              </select>

              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Visual Prompt</label>
              <textarea 
                name="visuals"
                value={formData.visuals}
                onChange={handleChange}
                placeholder="Describe your character (e.g. 'Golden armor, glowing halo, desert background')"
                className="w-full bg-black border border-[#44403c] p-3 text-sm text-white h-24 resize-none focus:border-[#f59e0b] outline-none"
              />
            </div>

            {/* ATTRIBUTES */}
            <div>
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-2">Base Attributes</label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(formData.attributes).map(attr => (
                  <div key={attr} className="text-center">
                    <span className="block text-[9px] text-[#78716c] font-bold mb-1">{attr}</span>
                    <input 
                      type="number"
                      value={formData.attributes[attr]}
                      onChange={(e) => handleAttrChange(attr, e.target.value)}
                      className="w-full bg-black border border-[#44403c] p-1 text-center text-[#fcd34d] font-bold focus:border-[#f59e0b] outline-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 font-cinzel font-bold text-lg uppercase tracking-widest transition-all border border-[#f59e0b] ${
                loading 
                  ? 'bg-[#292524] text-[#78716c] cursor-not-allowed' 
                  : 'bg-[#78350f] hover:bg-[#92400e] text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              }`}
            >
              {loading ? 'Communing...' : 'Generate Portrait'}
            </button>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 p-2 text-red-400 text-xs text-center mt-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: THE CARD PREVIEW --- */}
        <div className="border-2 border-[#78350f] bg-black p-2 flex flex-col relative shadow-2xl h-full min-h-[500px]">
            {/* Card Header */}
            <div className="text-center py-4 bg-[#1c1917] border-b border-[#292524]">
                <h2 className="text-3xl font-cinzel font-bold text-[#fcd34d] drop-shadow-md">
                    {formData.name || 'UNKNOWN'}
                </h2>
                <div className="flex justify-center gap-3 text-[#a8a29e] font-serif italic mt-1 text-xs uppercase tracking-wide">
                    <span>{formData.sex || 'Male'}</span>
                    <span>•</span>
                    <span>{formData.lineage}</span>
                    <span>•</span>
                    <span>{formData.charClass}</span>
                </div>
            </div>

            {/* Portrait Frame */}
            <div className="flex-1 border border-[#292524] bg-[#0c0a09] relative overflow-hidden group">
                {portrait ? (
                    <img src={portrait} alt="Generated" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#44403c]">
                        <span className="text-6xl opacity-20 mb-4 animate-pulse">⚔️</span>
                        <p className="uppercase tracking-widest text-xs">Portrait Required</p>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>

            {/* Save Button */}
            <div className="p-4 bg-[#1c1917] border-t border-[#292524]">
                {portrait ? (
                    <button 
                        onClick={handleSave}
                        className="w-full bg-green-900/80 border border-green-600 text-green-100 py-3 text-lg font-cinzel font-bold uppercase tracking-widest hover:bg-green-800 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                    >
                        Accept Soul & Begin
                    </button>
                ) : (
                    <div className="text-center text-[#57534e] text-xs uppercase tracking-widest py-3">
                        Awaiting Visualization
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterGenerator;