import React, { useState, useEffect } from 'react';

const CharacterGenerator = ({ onCharacterComplete }) => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    name: 'Adeleth',
    lineage: 'Sethite',
    charClass: 'Warrior',
    sex: 'Male',
    visualDetails: 'Rugged beard, glowing staff, desert robes',
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
  });

  const [loading, setLoading] = useState(false);
  const [portrait, setPortrait] = useState(null);
  const [error, setError] = useState('');

  // --- LORE & MECHANICS ---
  const lineageBonuses = {
    'Sethite': { desc: "Keepers of the original faith. +2 WIS, +1 CHA.", bonus: { WIS: 2, CHA: 1 } },
    'Cainite': { desc: "City builders and smiths. +2 STR, +1 INT.", bonus: { STR: 2, INT: 1 } },
    'Nephilim': { desc: "Giant blooded warriors. +2 STR, +2 CON.", bonus: { STR: 2, CON: 2 } }
  };

  // Helper to handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttrChange = (attr, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: parseInt(value) || 10 }
    }));
  };

  // --- IMAGE GENERATION ---
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Construct a lore-accurate prompt
      const prompt = `Fantasy character portrait, ${formData.sex} ${formData.lineage} ${formData.charClass}, ${formData.visualDetails}, ancient near east setting, biblical fantasy, highly detailed, dramatic lighting, 8k resolution, oil painting style`;

      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || 'Failed to generate');

      setPortrait(`data:image/jpeg;base64,${data.image}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE & START ---
  const handleSave = () => {
    if (!portrait) {
      setError("Please generate a portrait first.");
      return;
    }

    // 5e Calculation Logic
    const getMod = (score) => Math.floor((score - 10) / 2);
    const conMod = getMod(formData.attributes.CON);
    const dexMod = getMod(formData.attributes.DEX);

    // Apply Lineage Bonuses to base stats for final calculation
    const finalStats = { ...formData.attributes };
    const bonuses = lineageBonuses[formData.lineage].bonus;
    for (const [stat, val] of Object.entries(bonuses)) {
      finalStats[stat] += val;
    }

    const newCharacter = {
      id: 'p1',
      isPlayer: true,
      name: formData.name,
      portrait: portrait,
      // Lore & Stats
      lineage: formData.lineage,
      class: formData.charClass,
      attributes: finalStats,
      // Combat Screen Derived Stats
      hp: 10 + conMod + (formData.lineage === 'Nephilim' ? 5 : 0), // Nephilim bonus HP
      maxHp: 10 + conMod + (formData.lineage === 'Nephilim' ? 5 : 0),
      defense: 10 + dexMod, // Base AC
      initiativeBonus: dexMod,
      // Soul Economy
      rp: formData.lineage === 'Sethite' ? 2 : 0, // Sethites start with RP
      cp: formData.lineage === 'Nephilim' ? 2 : 0, // Nephilim start with CP
      actions: [
        { 
          id: 'atk1', 
          name: 'Basic Attack', 
          type: 'melee', 
          cost: 1, 
          damageDice: '1d8', 
          damageBonus: getMod(finalStats.STR), 
          damageType: 'physical' 
        }
      ]
    };

    localStorage.setItem('generatedCharacter', JSON.stringify(newCharacter));
    
    // Trigger App.jsx to switch views
    if (onCharacterComplete) onCharacterComplete();
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#d6d3d1] font-serif flex items-center justify-center p-6">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- LEFT PANEL: INPUTS --- */}
        <div className="border border-[#78350f] bg-[#1c1917] p-8 rounded shadow-2xl relative">
          <h1 className="text-3xl font-bold text-[#fcd34d] font-cinzel mb-2 tracking-widest uppercase border-b border-[#78350f] pb-4">
            Character Creator
          </h1>
          
          <div className="space-y-6 mt-6">
            {/* Name */}
            <div>
              <label className="block text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-1">Name</label>
              <input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-black border border-[#44403c] p-3 text-white focus:border-[#f59e0b] outline-none"
              />
            </div>

            {/* Lineage & Lore */}
            <div className="bg-[#292524] p-4 border-l-2 border-[#f59e0b]">
              <label className="block text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-1">Lineage</label>
              <select 
                value={formData.lineage}
                onChange={(e) => handleChange('lineage', e.target.value)}
                className="w-full bg-black border border-[#44403c] p-2 text-white outline-none mb-2"
              >
                {Object.keys(lineageBonuses).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
              <p className="text-xs text-stone-400 italic">
                {lineageBonuses[formData.lineage].desc}
              </p>
            </div>

            {/* Class & Sex */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-1">Class</label>
                <select 
                  value={formData.charClass}
                  onChange={(e) => handleChange('charClass', e.target.value)}
                  className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
                >
                  <option>Warrior</option>
                  <option>Priest</option>
                  <option>Hunter</option>
                  <option>Scholar</option>
                </select>
              </div>
              <div>
                <label className="block text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-1">Sex</label>
                <select 
                  value={formData.sex}
                  onChange={(e) => handleChange('sex', e.target.value)}
                  className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>

            {/* 5e Attributes */}
            <div>
              <label className="block text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-2">Attributes (Base)</label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(formData.attributes).map(attr => (
                  <div key={attr} className="text-center">
                    <span className="block text-[10px] text-stone-500 font-bold mb-1">{attr}</span>
                    <input 
                      type="number"
                      value={formData.attributes[attr]}
                      onChange={(e) => handleAttrChange(attr, e.target.value)}
                      className="w-full bg-black border border-[#44403c] p-1 text-center text-[#f59e0b] font-bold outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Visuals */}
            <div>
              <label className="block text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-1">Visual Details</label>
              <textarea 
                value={formData.visualDetails}
                onChange={(e) => handleChange('visualDetails', e.target.value)}
                className="w-full bg-black border border-[#44403c] p-3 text-stone-300 h-20 resize-none focus:border-[#f59e0b] outline-none text-sm"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 font-cinzel font-bold tracking-widest uppercase transition-all border border-[#f59e0b] ${
                loading ? 'bg-stone-800 text-stone-500' : 'bg-[#78350f] hover:bg-[#92400e] text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              }`}
            >
              {loading ? 'Forging Soul...' : 'Generate Portrait'}
            </button>
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>
        </div>

        {/* --- RIGHT PANEL: PREVIEW --- */}
        <div className="border border-[#78350f] bg-black p-1 relative flex flex-col">
          <div className="bg-[#1c1917] flex-1 flex flex-col relative overflow-hidden">
            
            {/* Header Overlay */}
            <div className="absolute top-0 w-full p-6 text-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <h2 className="text-4xl font-bold text-[#fcd34d] font-cinzel">{formData.name}</h2>
              <p className="text-stone-400 italic text-sm mt-1">{formData.sex} {formData.lineage} - {formData.charClass}</p>
            </div>

            {/* Image Area */}
            <div className="flex-1 flex items-center justify-center bg-stone-900 relative">
              {portrait ? (
                <img src={portrait} alt="Character" className="w-full h-full object-cover" />
              ) : (
                <div className="text-stone-700 flex flex-col items-center">
                  <span className="text-6xl opacity-20 mb-2">⚔️</span>
                  <p className="uppercase tracking-widest text-xs opacity-50">Awaiting Generation</p>
                </div>
              )}
            </div>

            {/* Footer / Confirm Button */}
            {portrait && (
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center">
                <button 
                  onClick={handleSave}
                  className="bg-green-900/90 border border-green-500 text-green-100 px-8 py-3 rounded uppercase tracking-widest hover:bg-green-800 transition-all font-bold shadow-[0_0_20px_rgba(22,163,74,0.4)]"
                >
                  Accept & Enter World
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterGenerator;