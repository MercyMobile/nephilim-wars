import React, { useState } from 'react';

// Race data
const RACES = {
  "Sethite": {
    name: "Sethite (Righteous Line)",
    desc: "Descendants of Seth. Keepers of the original faith and pre-fall history.",
    stats: { wis: 2, cha: 1 },
    traits: ["Blessed Heritage (Advantage on Religion)", "Divine Favor (1/Long Rest Reroll)"],
    visuals: "simple robes, prayer shawl, serene expression, holding scroll or staff, semitic features"
  },
  "Cainite": {
    name: "Cainite (City Builder)",
    desc: "Descendants of the first murderer. Masters of metallurgy, music, and urbanization.",
    stats: { int: 2, con: 1 },
    traits: ["Mark of Cain (Protection from vengeance)", "City Born (Urban Advantage)", "Builder's Heritage"],
    visuals: "adorned in gold and brass jewelry, fine dyed clothes, musical instrument or hammer, elaborate hair, sharp features"
  },
  "Wanderer": {
    name: "Wanderer (Nomad)",
    desc: "Those who rejected both the cities of Cain and the strictures of Seth.",
    stats: { dex: 2, wis: 1 },
    traits: ["Survivalist", "Swift Footed (35ft Speed)"],
    visuals: "weather-beaten skin, animal furs, tribal tattoos, bow on back, wild hair, dust covered"
  },
  "Nephilim": {
    name: "Nephilim (1st Gen Giant)",
    desc: "Direct offspring of Watchers and Humans. Titans of the ancient world.",
    stats: { str: 4, con: 2, dex: -2 },
    traits: ["Large Size (12-15ft)", "Angelic Resistance (Radiant)", "Insatiable Hunger", "Powerful Build"],
    visuals: "massive 12ft tall giant, glowing eyes, unnatural muscles, wearing heavy bronze armor, carrying massive weapon"
  },
  "Rephaim": {
    name: "Rephaim (Shade/Giant)",
    desc: "Later generations of giants, often associated with the dead.",
    stats: { str: 2, con: 2 },
    traits: ["Spirit Sight", "Intimidating Presence"],
    visuals: "tall gaunt figure, pale grey skin, shadowy aura, ancient rusted armor"
  },
  "Anakim": {
    name: "Anakim (Noble Giant)",
    desc: "The 'Long-Necked Ones'. A race of giants known for wearing heavy chains.",
    stats: { str: 3, cha: 1, dex: -1 },
    traits: ["Chain Master", "Noble Bearing"],
    visuals: "giant stature, wearing heavy gold chains around neck, regal posture, clean shaven head"
  },
  "Gibborim": {
    name: "Gibborim (Mighty Man)",
    desc: "Human-Giant hybrids. Appearance is mostly human but with heroic stature.",
    stats: { str: 2, con: 1 },
    traits: ["Powerful Build", "Martial Proficiency", "Heroic Feat"],
    visuals: "7ft tall, extremely muscular human, lion skin cloak, heroic pose, holding spear"
  },
  "Horim": {
    name: "Horim (Cave Dweller)",
    desc: "Giant-kin adapted to underground life.",
    stats: { dex: 2, wis: 1 },
    traits: ["Superior Darkvision", "Sunlight Sensitivity", "Stone Cunning"],
    visuals: "pale skin, large black eyes, crouched posture, primitive stone tools, cave background"
  },
  "Sorcerer": {
    name: "Sorcerer Clan (Watcher-Taught)",
    desc: "Humans initiated into Watcher mysteries like root-cutting and astrology.",
    stats: { int: 2, cha: 1 },
    traits: ["Dark Insight (Detect Magic)", "Blood Magic", "Watcher's Mark"],
    visuals: "robes covered in constellations, glowing runes on skin, holding strange herbs or crystals, purple magical aura"
  }
};

const NAMES = {
  Male: ["Enoch", "Irad", "Lamech", "Jabal", "Tubal", "Methuselah", "Jared", "Mahalalel", "Kenan"],
  Female: ["Adah", "Zillah", "Naamah", "Sarai", "Milcah", "Noa", "Hoglah", "Tirzah"],
  Nephilim: ["Og", "Sihon", "Ahiman", "Sheshai", "Talmai", "Arba", "Goliath", "Lahmi"]
};

const CreatorScreen = () => {
  const [customName, setCustomName] = useState('');
  const [race, setRace] = useState('Sethite');
  const [charClass, setCharClass] = useState('Warrior');
  const [sex, setSex] = useState('Male');
  const [background, setBackground] = useState('ancient stone city');
  const [vibe, setVibe] = useState('biblical epic');
  const [baseStats, setBaseStats] = useState({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  
  const [charName, setCharName] = useState('Unknown Soul');
  const [charSubtitle, setCharSubtitle] = useState('Select options to begin...');
  const [finalStats, setFinalStats] = useState({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  const [charImage, setCharImage] = useState('https://placehold.co/600x600/0a0a0f/333?text=Portrait');
  const [isGenerating, setIsGenerating] = useState(false);

  const rollD6 = () => Math.floor(Math.random() * 6) + 1;
  const rollStat = () => {
    const rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
    rolls.sort((a, b) => a - b);
    return rolls[1] + rolls[2] + rolls[3];
  };
  const getMod = (score) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const handleStatChange = (stat, value) => {
    setBaseStats(prev => ({ ...prev, [stat]: value === 'random' ? rollStat() : parseInt(value) }));
  };

  const generateCharacter = async () => {
    setIsGenerating(true);
    const raceData = RACES[race];
    
    let name = customName;
    if (!name) {
      const nameList = (race === 'Nephilim' || race === 'Anakim') ? NAMES.Nephilim : NAMES[sex];
      name = nameList[Math.floor(Math.random() * nameList.length)];
    }

    const stats = { ...baseStats };
    if (raceData.stats) {
      Object.keys(raceData.stats).forEach(s => {
        if (stats[s] !== undefined) stats[s] += raceData.stats[s];
      });
    }

    setCharName(name);
    setCharSubtitle(`${sex} ${raceData.name} - ${charClass}`);
    setFinalStats(stats);

    const imgPrompt = `portrait of a ${raceData.visuals}, ${charClass} class, ${sex}, ${vibe} atmosphere, ${background} background, detailed fantasy art, dramatic lighting, 8k, oil painting style`;

    try {
      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imgPrompt, model: 'flux-schnell' })
      });

      if (response.ok) {
        const data = await response.json();
        setCharImage(`data:image/jpeg;base64,${data.image}`);
      } else {
        console.error('Image generation failed:', response.status);
        setCharImage(`https://placehold.co/600x600/1a1a1d/d4af37?text=${race}+${charClass}`);
      }
    } catch (e) {
      console.error("Image gen error:", e);
      setCharImage(`https://placehold.co/600x600/1a1a1d/d4af37?text=${race}+${charClass}`);
    }

    setIsGenerating(false);
  };

  const selectedRace = RACES[race];

  return (
    <div className="fixed inset-0 bg-[#050508] text-[#e0e0e0] overflow-auto">
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          
          {/* LEFT: BUILDER */}
          <div className="bg-[#0f0f16]/95 border border-[#8a7018] rounded p-4 md:p-6 lg:p-8 relative shadow-2xl h-fit">
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#d4af37]"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#d4af37]"></div>

            <h1 className="text-2xl md:text-3xl text-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-[#8a7018] bg-gradient-to-b from-[#f9e29c] to-[#d4af37] bg-clip-text text-transparent font-bold">
              Character Creator
            </h1>

            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs text-[#8a7018] uppercase tracking-wider mb-2 font-bold">Name</label>
                <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Leave blank for random..." className="w-full p-2 md:p-3 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] focus:border-[#d4af37] outline-none text-sm md:text-base" />
              </div>

              <div>
                <h3 className="text-[#d4af37] text-base md:text-lg mb-2 md:mb-3 pb-1 border-b border-dashed border-[#444]">Lineage</h3>
                <label className="block text-xs text-[#8a7018] uppercase tracking-wider mb-2 font-bold">Race</label>
                <select value={race} onChange={(e) => setRace(e.target.value)}
                  className="w-full p-2 md:p-3 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] focus:border-[#d4af37] outline-none text-sm md:text-base">
                  {Object.keys(RACES).map(key => <option key={key} value={key}>{RACES[key].name}</option>)}
                </select>
                <div className="mt-2 p-3 md:p-4 bg-black/30 border-l-4 border-[#8a7018] text-sm">
                  <span className="block text-[#f9e29c] font-bold mb-1">{selectedRace.name}</span>
                  <div>{selectedRace.desc}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="inline-block bg-[#d4af37]/10 border border-[#8a7018] px-2 py-1 text-xs text-[#f9e29c]">
                      {Object.entries(selectedRace.stats).map(([s, v]) => `${s.toUpperCase()} ${v > 0 ? '+' : ''}${v}`).join(', ')}
                    </span>
                    {selectedRace.traits.map((trait, i) => (
                      <span key={i} className="inline-block bg-[#d4af37]/10 border border-[#8a7018] px-2 py-1 text-xs text-[#f9e29c]">{trait}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs text-[#8a7018] uppercase tracking-wider mb-2 font-bold">Class</label>
                  <select value={charClass} onChange={(e) => setCharClass(e.target.value)}
                    className="w-full p-2 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] focus:border-[#d4af37] outline-none text-xs md:text-sm">
                    <option value="Warrior">Warrior</option>
                    <option value="Gibbor">Gibbor</option>
                    <option value="Hunter">Hunter</option>
                    <option value="Magi">Magi</option>
                    <option value="Priest">Priest</option>
                    <option value="Artisan">Artisan</option>
                    <option value="Scribe">Scribe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#8a7018] uppercase tracking-wider mb-2 font-bold">Sex</label>
                  <select value={sex} onChange={(e) => setSex(e.target.value)}
                    className="w-full p-2 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] focus:border-[#d4af37] outline-none text-xs md:text-sm">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-[#d4af37] text-base md:text-lg mb-2 md:mb-3 pb-1 border-b border-dashed border-[#444]">Attributes</h3>
                <div className="grid grid-cols-6 gap-1 bg-white/5 p-2 md:p-4 border border-[#333]">
                  {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => (
                    <div key={stat} className="text-center">
                      <label className="block text-[8px] md:text-[10px] text-[#8a7018] uppercase mb-1">{stat}</label>
                      <select value={baseStats[stat]} onChange={(e) => handleStatChange(stat, e.target.value)}
                        className="w-full p-0.5 md:p-1 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] text-[10px] md:text-xs text-center">
                        <option value="random">Roll</option>
                        {Array.from({length: 11}, (_, i) => i + 8).map(val => <option key={val} value={val}>{val}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#d4af37] text-base md:text-lg mb-2 md:mb-3 pb-1 border-b border-dashed border-[#444]">Visual Details</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs text-[#8a7018] uppercase tracking-wider mb-2 font-bold">Background</label>
                    <select value={background} onChange={(e) => setBackground(e.target.value)}
                      className="w-full p-2 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] focus:border-[#d4af37] outline-none text-xs md:text-sm">
                      <option value="ancient stone city">Stone City</option>
                      <option value="mountain stronghold">Mountain</option>
                      <option value="arid desert wasteland">Desert</option>
                      <option value="lush hanging gardens">Gardens</option>
                      <option value="dark ritual cavern">Cavern</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#8a7018] uppercase tracking-wider mb-2 font-bold">Vibe</label>
                    <select value={vibe} onChange={(e) => setVibe(e.target.value)}
                      className="w-full p-2 bg-[#0a0a0f] border border-[#333] text-[#e0e0e0] focus:border-[#d4af37] outline-none text-xs md:text-sm">
                      <option value="biblical epic">Biblical Epic</option>
                      <option value="dark fantasy">Dark Fantasy</option>
                      <option value="ethereal and holy">Ethereal/Holy</option>
                      <option value="savage and primal">Savage/Primal</option>
                    </select>
                  </div>
                </div>
              </div>

              <button onClick={generateCharacter} disabled={isGenerating}
                className="w-full p-3 md:p-4 bg-gradient-to-br from-[#8a7018] to-[#451a03] border border-[#f9e29c] text-white text-base md:text-lg font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:border-white transition-all disabled:opacity-50">
                {isGenerating ? 'Forging...' : 'Forge Legend'}
              </button>
            </div>
          </div>

          {/* RIGHT: SHEET */}
          <div className="bg-[#0a0a0f] border border-[#333] shadow-2xl flex flex-col h-fit lg:sticky lg:top-4">
            <div className="bg-[#14141d] p-4 md:p-5 text-center border-b-2 border-[#8a7018]">
              <div className="text-2xl md:text-3xl text-[#d4af37] uppercase tracking-wider font-bold">{charName}</div>
              <div className="text-[#a0a0a0] italic mt-1 text-sm md:text-base">{charSubtitle}</div>
            </div>

            <div className="relative w-full aspect-square bg-black border-b border-[#8a7018]">
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] z-10">
                  <div className="w-10 h-10 border-4 border-[#8a7018] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <div className="text-[#8a7018]">Summoning Image...</div>
                </div>
              )}
              <img src={charImage} alt="Character" className="w-full h-full object-cover"
                style={{ opacity: isGenerating ? 0 : 1, transition: 'opacity 1s' }} />
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(stat => (
                  <div key={stat} className="bg-white/5 border border-[#333] p-2 md:p-3 text-center relative">
                    <div className="text-xl md:text-2xl text-[#e0e0e0] font-bold">{finalStats[stat]}</div>
                    <div className="text-[8px] md:text-[10px] text-[#8a7018] uppercase tracking-wider">{stat}</div>
                    <div className="absolute -top-2 -right-1 bg-[#1a1a25] border border-[#8a7018] text-[10px] md:text-xs px-1 md:px-2 py-0.5 text-[#f9e29c] rounded">
                      {getMod(finalStats[stat])}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-[#d4af37] text-base md:text-lg mb-2 md:mb-3 pb-1 border-b border-dashed border-[#444]">Racial Traits</h3>
                <div className="space-y-2 text-xs md:text-sm">
                  {selectedRace.traits.map((trait, i) => {
                    const [name, detail] = trait.split('(');
                    return (
                      <div key={i} className="pb-2 border-b border-dashed border-[#333] last:border-0">
                        <span className="text-[#d4af37] font-bold">{name}</span>
                        {detail && <span className="text-[#ccc]"> ({detail}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorScreen;
