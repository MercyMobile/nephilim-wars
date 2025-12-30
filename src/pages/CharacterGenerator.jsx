import React, { useState } from 'react';

const CharacterGenerator = ({ onCharacterComplete }) => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: '',
    lineage: 'Sethite',
    charClass: 'Warrior',
    visuals: '',
    // Base stats (before lineage bonuses)
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
  });

  const [loading, setLoading] = useState(false);
  const [portrait, setPortrait] = useState(null); // Stores the Base64 image
  const [error, setError] = useState('');

  // --- LORE LOGIC ---
  const LORE = {
    Sethite: { 
      desc: "Keepers of the ancient faith. Wise and charismatic leaders.",
      bonuses: { WIS: 2, CHA: 1 } 
    },
    Cainite: { 
      desc: "City builders and masters of the forge. Strong and cunning.",
      bonuses: { STR: 2, INT: 1 } 
    },
    Nephilim: { 
      desc: "Giant-blooded warriors of renown. Mighty and enduring.",
      bonuses: { STR: 2, CON: 2 } 
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

  // --- 1. GENERATE IMAGE (Connects to your generate-image.js) ---
  const handleGenerate = async () => {
    if (!formData.visuals) {
      setError("Please describe your character first.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Create a rich prompt for the AI
      const prompt = `Fantasy character portrait, ${formData.sex || 'Male'} ${formData.lineage} ${formData.charClass}, ${formData.visuals}, ancient near east setting, biblical fantasy, realistic, dramatic lighting, 8k`;

      // Call the Worker
      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.details || "Generation failed");
      
      // Save the image to state
      setPortrait(`data:image/jpeg;base64,${data.image}`);

    } catch (err) {
      console.error(err);
      setError("Failed to summon image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. CALCULATE STATS & SAVE ---
  const handleSave = () => {
    if (!formData.name || !portrait) {
      setError("You must have a Name and a Portrait to proceed.");
      return;
    }

    // A. Apply Lineage Bonuses
    const finalStats = { ...formData.attributes };
    const bonuses = LORE[formData.lineage].bonuses;
    for (const [key, val] of Object.entries(bonuses)) {
      finalStats[key] += val;
    }

    // B. Calculate Derivatives (5e Style)
    const getMod = (score) => Math.floor((score - 10) / 2);
    const conMod = getMod(finalStats.CON);
    const dexMod = getMod(finalStats.DEX);
    const strMod = getMod(finalStats.STR);

    // C. Build Character Object
    const newCharacter = {
      id: 'player_1',
      name: formData.name,
      isPlayer: true,
      portrait: portrait, // The base64 string
      lineage: formData.lineage,
      class: formData.charClass,
      
      // Combat Stats
      maxHp: 10 + conMod + (formData.lineage === 'Nephilim' ? 5 : 0), // Nephilim get +5 HP
      hp: 10 + conMod + (formData.lineage === 'Nephilim' ? 5 : 0),
      defense: 10 + dexMod, // Base AC
      initiativeBonus: dexMod,
      
      // Soul Economy (from index.html)
      rp: formData.lineage === 'Sethite' ? 2 : 0, 
      cp: formData.lineage === 'Nephilim' ? 2 : 0,

      // Default Weapon
      actions: [
        {
          id: 'w1',
          name: 'Bronze Sword',
          type: 'melee',
          cost: 1,
          toHitBonus: 2 + strMod, // Proficiency(2) + STR
          damageDice: '1d8',
          damageBonus: strMod,
          damageType: 'slashing'
        }
      ]
    };

    // D. Save to LocalStorage
    localStorage.setItem('generatedCharacter', JSON.stringify(newCharacter));

    // E. Notify App to Switch Screens
    if (onCharacterComplete) {
      onCharacterComplete();
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- LEFT PANEL: THE FORGE --- */}
        <div className="border-2 border-amber-700 bg-black/90 p-8 shadow-[0_0_50px_rgba(245,158,11,0.1)] relative">
          <h1 className="text-4xl text-amber-500 font-cinzel font-bold mb-6 border-b border-amber-800 pb-2 tracking-widest text-center">
            NEXUS CREATOR
          </h1>

          <div className="space-y-6">
            
            {/* Name Input */}
            <div>
              <label className="block text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">True Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Enoch"
                className="w-full bg-stone-900 border border-stone-700 p-3 text-xl text-white focus:border-amber-500 outline-none"
              />
            </div>

            {/* Lineage Selection */}
            <div className="bg-stone-900/50 p-4 border-l-2 border-amber-600">
              <label className="block text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">Lineage</label>
              <select 
                name="lineage"
                value={formData.lineage}
                onChange={handleChange}
                className="w-full bg-black border border-stone-700 p-2 text-white outline-none mb-2"
              >
                <option value="Sethite">Sethite (Righteous)</option>
                <option value="Cainite">Cainite (Corrupted)</option>
                <option value="Nephilim">Nephilim (Giant)</option>
              </select>
              <p className="text-xs text-stone-400 italic">{LORE[formData.lineage].desc}</p>
              <p className="text-xs text-amber-500 mt-1">
                Bonuses: {Object.entries(LORE[formData.lineage].bonuses).map(([k,v]) => `+${v} ${k}`).join(', ')}
              </p>
            </div>

            {/* Attributes Grid */}
            <div>
              <label className="block text-amber-600 text-xs font-bold uppercase tracking-widest mb-2">Base Attributes</label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(formData.attributes).map(attr => (
                  <div key={attr} className="text-center">
                    <span className="block text-[10px] text-stone-500 font-bold mb-1">{attr}</span>
                    <input 
                      type="number"
                      value={formData.attributes[attr]}
                      onChange={(e) => handleAttrChange(attr, e.target.value)}
                      className="w-full bg-black border border-stone-800 p-1 text-center text-amber-500 font-bold focus:border-amber-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Prompt */}
            <div>
              <label className="block text-amber-600 text-xs font-bold uppercase tracking-widest mb-1">Visual Description</label>
              <textarea 
                name="visuals"
                value={formData.visuals}
                onChange={handleChange}
                placeholder="Describe your hero... (e.g. 'Scarred face, glowing blue eyes, holding a bronze spear')"
                className="w-full bg-stone-900 border border-stone-700 p-3 text-sm text-white h-24 resize-none focus:border-amber-500 outline-none"
              />
            </div>

            {/* Generate Button */}
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 font-cinzel font-bold text-lg uppercase tracking-widest transition-all border border-amber-600 ${
                loading 
                  ? 'bg-stone-800 text-stone-600 cursor-wait' 
                  : 'bg-amber-900/40 text-amber-100 hover:bg-amber-700 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
              }`}
            >
              {loading ? 'Communing with the Machine...' : 'Generate Portrait'}
            </button>
            
            {error && <p className="text-red-500 text-sm text-center bg-red-900/20 p-2 border border-red-900">{error}</p>}
          </div>
        </div>

        {/* --- RIGHT PANEL: THE CARD --- */}
        <div className="border-2 border-stone-800 bg-black p-2 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent opacity-50"></div>
            
            {/* Character Header */}
            <div className="text-center py-6">
                <h2 className="text-5xl font-cinzel font-bold text-amber-500 drop-shadow-md">
                    {formData.name || 'UNKNOWN'}
                </h2>
                <div className="flex justify-center gap-4 text-stone-500 font-serif italic mt-2 text-sm">
                    <span>{formData.lineage}</span>
                    <span>•</span>
                    <span>{formData.charClass}</span>
                </div>
            </div>

            {/* Image Frame */}
            <div className="flex-1 border border-stone-800 bg-stone-900 relative overflow-hidden group">
                {portrait ? (
                    <img src={portrait} alt="Generated" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-stone-700">
                        <span className="text-8xl opacity-20 mb-4">⚔️</span>
                        <p className="uppercase tracking-widest text-xs">Portrait Pending</p>
                    </div>
                )}
                
                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>

            {/* Footer / Save */}
            <div className="p-6">
                {portrait ? (
                    <button 
                        onClick={handleSave}
                        className="w-full bg-green-900/80 border border-green-600 text-green-100 py-3 text-xl font-cinzel font-bold uppercase tracking-widest hover:bg-green-800 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(22,163,74,0.2)]"
                    >
                        Accept Soul & Begin
                    </button>
                ) : (
                    <div className="text-center text-stone-600 text-xs uppercase tracking-widest">
                        Awaiting Creation
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterGenerator;