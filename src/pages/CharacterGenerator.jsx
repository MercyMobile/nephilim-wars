import React, { useState } from 'react';

// --- IMPROVED CULTURAL DATA ---
// Detailed visual guides to force the AI away from "Generic Euro-Fantasy" 
// and towards "Ancient Near East / Bronze Age / Antediluvian".
const RACES = {
  "Sethite": {
    name: "Sethite (Righteous Line)",
    desc: "Descendants of Seth. Keepers of the original faith and pre-fall history.",
    stats: { wis: 2, cha: 1 },
    traits: ["Blessed Heritage (Advantage on Religion)", "Divine Favor (1/Long Rest Reroll)"],
    // CULTURAL NOTE: Think Ancient Levantine Priesthood / Early Semitic Patriarchs
    visuals: "simple unbleached linen robes, prayer shawl (tallit) with tekhelet fringes, serene expression, holding scroll or shepherd's staff, rich olive to deep bronze skin, dark textured hair and beard, strong aquiline nose, sandals, strictly humanoid anatomy"
  },
  "Cainite": {
    name: "Cainite (City Builder)",
    desc: "Descendants of the first murderer. Masters of metallurgy, music, and urbanization.",
    stats: { int: 2, con: 1 },
    traits: ["Mark of Cain (Protection from vengeance)", "City Born (Urban Advantage)", "Builder's Heritage"],
    // CULTURAL NOTE: Think Ancient Babylonian / Sumerian Nobility
    visuals: "adorned in hammered gold and brass jewelry, fine dyed clothes (Tyrian purple/crimson), musical instrument or bronze hammer, elaborate oiled and braided black hair, sharp angular features, polished copper or terracotta skin, tattoos of city maps or cuneiform"
  },
  "Wanderer": {
    name: "Wanderer (Nomad)",
    desc: "Those who rejected both the cities of Cain and the strictures of Seth.",
    stats: { dex: 2, wis: 1 },
    traits: ["Survivalist", "Swift Footed (35ft Speed)"],
    // CULTURAL NOTE: Think Proto-Bedouin / Desert Nomads
    visuals: "weather-beaten deep tawny skin, sun-darkened complexion, animal furs and leather, tribal scarification, composite bow on back, wild wind-blown black hair, dust covered, piercing dark almond eyes, protective head-wrap"
  },
  "Nephilim": {
    name: "Nephilim (The Fallen)",
    desc: "The offspring of the Watchers and humans. Powerful, tall, and spiritually conflicted.",
    stats: { str: 2, cha: 1 },
    traits: ["Titanic Strength", "Divine Spark (Magic Affinity)", "Hubris (Disadvantage vs Flattery)"],
    // CULTURAL NOTE: The "Heroes of Old". Greek Heroic proportions but Bronze Age setting.
    visuals: "towering height (7-8ft), unnaturally perfect physique (statuesque), faint glowing eyes, bronze armor scales, metallic or marble-like skin tone (unnatural perfection), NO wings, NO horns, distinct 'heroic' aura, chiseled features"
  },
  "Anakim": {
    name: "Anakim (Giant)",
    desc: "True giants of the land. Warriors of terrifying strength.",
    stats: { str: 2, con: 1 },
    traits: ["Large Size", "Reach", "Terrifying Presence"],
    // CULTURAL NOTE: Philistine / Canaanite Warlords
    visuals: "massive stature (9-10ft), thick muscular build, primitive heavy weapons (mauls/spears), deeply tanned and scarred skin, potentially six fingers on each hand (polydactyly), coarse thick hair, braided beards with bronze rings"
  }
};

const CLASSES = [
  "Warrior (Bronze blade specialist)",
  "Priest (Keeper of the Altars)",
  "Hunter (Beast slayer)",
  "Artisan (Maker of Wonders)",
  "Sorcerer (Forbidden Bloodline)"
];

const BACKGROUNDS = [
  "Shepherd", "City Guard", "Temple Scribe", "Exile", "Blacksmith", "Watcher's Disciple"
];

const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

const getMod = (score) => {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : mod;
};

const CharacterGenerator = () => {
  const [step, setStep] = useState(1);
  const [selectedRace, setSelectedRace] = useState("Sethite");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS[0]);
  const [selectedAlignment, setSelectedAlignment] = useState(ALIGNMENTS[4]);
  
  const [baseStats, setBaseStats] = useState({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  const [pointsRemaining, setPointsRemaining] = useState(27);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLore, setGeneratedLore] = useState(null);
  const [error, setError] = useState(null);

  const raceData = RACES[selectedRace];
  const finalStats = { ...baseStats };
  if (raceData?.stats) {
    Object.entries(raceData.stats).forEach(([stat, bonus]) => {
      finalStats[stat] += bonus;
    });
  }

  const handleStatChange = (stat, delta) => {
    const currentCost = getPointCost(baseStats[stat]);
    const newScore = baseStats[stat] + delta;
    const newCost = getPointCost(newScore);
    
    if (newScore < 8 || newScore > 15) return;
    
    // Calculate cost difference
    let costDiff = 0;
    if (delta > 0) {
        costDiff = newCost - currentCost;
    } else {
        costDiff = currentCost - getPointCost(newScore);
        costDiff = -costDiff; // Refund
    }
    
    // Standard point buy logic check would go here, simplified for now:
    // We need to check total points spent
    let currentTotalSpent = 0;
    Object.keys(baseStats).forEach(s => currentTotalSpent += getPointCost(baseStats[s]));
    
    // If adding, check if we have budget
    if (delta > 0) {
        if ((27 - currentTotalSpent) < (newCost - currentCost)) return;
    }

    setBaseStats(prev => ({ ...prev, [stat]: newScore }));
    
    // Recalculate remaining (reliable method)
    const newStats = { ...baseStats, [stat]: newScore };
    let newTotalSpent = 0;
    Object.keys(newStats).forEach(s => newTotalSpent += getPointCost(newStats[s]));
    setPointsRemaining(27 - newTotalSpent);
  };

  const getPointCost = (score) => {
    if (score <= 13) return score - 8;
    if (score === 14) return 7;
    if (score === 15) return 9;
    return 0;
  };

  // --- THE CORE AI INTEGRATION ---
  const generateLore = async () => {
    setIsGenerating(true);
    setError(null);

    const apiKey = ""; // API Key handled by environment
    const raceInfo = RACES[selectedRace];

    // --- PROMPT ENGINEERING START ---
    // 1. Context Setting: Define the "Antediluvian Bronze Age" strictly.
    // 2. Visual Safety: Explicitly forbid wings/horns to prevent "generic demon/angel" hallucinations.
    // 3. Cultural Guide: Define the specific skin tones and features for this region.
    const systemInstruction = `You are a strict creative writer for a Tabletop RPG set in the 'Nephilim Wars' universe (Biblical Antediluvian Bronze Age). 
    
    YOUR GOAL: Generate a character description that is historically grounded in the Ancient Near East, rejecting generic European medieval fantasy tropes.

    CRITICAL VISUAL RULES:
    1. ANATOMY: Characters must have strictly 2 arms and 2 legs. NO WINGS. NO TAILS. NO HORNS. (Unless specifically requested for a Giant/Mutation).
    2. TECHNOLOGY: Bronze Age only. No steel plate, no crossbows. Use linen, wool, bronze, copper, leather.
    
    ETHNICITY & SKIN TONE GUIDE (MANDATORY):
    - SETTING: Ancient Mesopotamia / Levant / Fertile Crescent.
    - FORBIDDEN: Do not use "pale", "fair", "blonde", or "blue eyes" as defaults. Do not use Western European names.
    - PREFERRED SKIN TONES: Rich Olive, Burnished Bronze, Polished Copper, Deep Tawny, Sun-darkened, Deep Umber, Terracotta.
    - PREFERRED FEATURES: Aquiline/Strong noses, dark wavy/curly/textured hair, thick eyebrows, almond-shaped dark eyes.
    
    You must use the 'Visuals' string provided in the user prompt as the absolute base truth.`;

    const userPrompt = `
    Generate a JSON profile for this character:
    
    DATA:
    - Race: ${raceInfo.name}
    - Race Description: ${raceInfo.desc}
    - Race Visuals (STRICTLY ADHERE TO THIS): ${raceInfo.visuals}
    - Class: ${selectedClass}
    - Background: ${selectedBackground}
    - Alignment: ${selectedAlignment}
    - Attributes: Str ${finalStats.str}, Dex ${finalStats.dex}, Con ${finalStats.con}, Int ${finalStats.int}, Wis ${finalStats.wis}, Cha ${finalStats.cha}
    
    INSTRUCTIONS:
    - "backstory": A 2-sentence summary of their past tied to their Background.
    - "appearance": A vivid description matching the Race Visuals and the Ethnicity Guide. Focus on specific skin tone (e.g. "bronze-hued skin", "deep olive complexion") and material culture (linen, bronze).
    - "personality": A brief quirk based on their Alignment.
    
    RESPONSE FORMAT:
    {
      "name": "A Biblical/Ancient Semitic/Sumerian sounding name",
      "backstory": "...",
      "appearance": "...",
      "personality": "..."
    }
    `;
    // --- PROMPT ENGINEERING END ---

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      if (!response.ok) throw new Error("AI Generation failed");
      
      const data = await response.json();
      const content = JSON.parse(data.candidates[0].content.parts[0].text);
      setGeneratedLore(content);
      setStep(3); 
    } catch (err) {
      console.error(err);
      setError("The scribe's ink has dried. (Generation Failed)");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e0e0e0] font-sans selection:bg-[#8a7018] selection:text-black pb-20">
      {/* Header */}
      <div className="border-b border-[#333] bg-[#111] p-4 flex justify-between items-center sticky top-0 z-30 shadow-lg">
        <h1 className="font-cinzel text-xl md:text-2xl text-[#d4af37] tracking-widest">CHARACTER CREATION</h1>
        <div className="flex gap-2">
           <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-[#d4af37]' : 'bg-[#333]'}`} />
           <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-[#d4af37]' : 'bg-[#333]'}`} />
           <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-[#d4af37]' : 'bg-[#333]'}`} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        
        {/* STEP 1: RACE & CLASS */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Race Selection */}
            <section>
              <h2 className="font-cinzel text-[#d4af37] text-xl mb-4 flex items-center gap-2">
                <span className="text-2xl">I.</span> LINEAGE
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.keys(RACES).map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedRace(key)}
                    className={`text-left p-4 border transition-all duration-300 relative overflow-hidden group ${
                      selectedRace === key 
                        ? 'border-[#d4af37] bg-[#d4af37]/10' 
                        : 'border-[#333] hover:border-[#666] bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="relative z-10">
                        <div className={`font-bold text-lg mb-1 ${selectedRace === key ? 'text-[#d4af37]' : 'text-[#ccc]'}`}>
                            {RACES[key].name}
                        </div>
                        <div className="text-xs text-[#888] leading-relaxed mb-2 h-12 overflow-hidden">
                            {RACES[key].desc}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {Object.entries(RACES[key].stats).map(([stat, val]) => (
                                <span key={stat} className="text-[10px] uppercase bg-black/40 px-1.5 py-0.5 rounded border border-[#333] text-[#a0a0a0]">
                                    {stat.toUpperCase()} +{val}
                                </span>
                            ))}
                        </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Class & Background */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h2 className="font-cinzel text-[#d4af37] text-xl mb-4 flex items-center gap-2">
                  <span className="text-2xl">II.</span> CALLING
                </h2>
                <select 
                  className="w-full bg-[#1a1a1a] border border-[#333] p-3 text-[#e0e0e0] focus:border-[#d4af37] focus:outline-none transition-colors"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </section>

              <section>
                <h2 className="font-cinzel text-[#d4af37] text-xl mb-4 flex items-center gap-2">
                  <span className="text-2xl">III.</span> ORIGIN
                </h2>
                <select 
                    className="w-full bg-[#1a1a1a] border border-[#333] p-3 text-[#e0e0e0] focus:border-[#d4af37] focus:outline-none transition-colors"
                    value={selectedBackground}
                    onChange={(e) => setSelectedBackground(e.target.value)}
                >
                    {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </section>
            </div>
            
            <section>
                 <h2 className="font-cinzel text-[#d4af37] text-xl mb-4 flex items-center gap-2">
                  <span className="text-2xl">IV.</span> ALIGNMENT
                </h2>
                <div className="grid grid-cols-3 gap-2">
                    {ALIGNMENTS.map(a => (
                        <button 
                            key={a}
                            onClick={() => setSelectedAlignment(a)}
                            className={`text-xs p-2 border ${selectedAlignment === a ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-[#333] text-[#666] hover:border-[#555]'}`}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </section>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(2)}
                className="bg-[#d4af37] text-black font-bold px-8 py-3 hover:bg-[#b5952f] transition-colors font-cinzel tracking-widest"
              >
                NEXT: ATTRIBUTES
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STATS */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-end border-b border-[#333] pb-4">
                <h2 className="font-cinzel text-[#d4af37] text-xl">V. ATTRIBUTES</h2>
                <div className="text-right">
                    <div className="text-xs text-[#888] uppercase tracking-widest">Points Remaining</div>
                    <div className={`text-2xl font-bold ${pointsRemaining < 0 ? 'text-red-500' : 'text-[#e0e0e0]'}`}>
                        {pointsRemaining} / 27
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Object.keys(baseStats).map(stat => {
                    const racialBonus = raceData.stats[stat] || 0;
                    const total = baseStats[stat] + racialBonus;
                    const mod = getMod(total);

                    return (
                        <div key={stat} className="bg-[#1a1a1a] border border-[#333] p-4 relative group hover:border-[#555] transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#888] font-bold uppercase tracking-wider">{stat}</span>
                                <span className="text-xs text-[#555]">Base: {baseStats[stat]}</span>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                                <button 
                                    onClick={() => handleStatChange(stat, -1)}
                                    className="w-8 h-8 flex items-center justify-center border border-[#444] text-[#888] hover:bg-black hover:text-white transition-colors"
                                >-</button>
                                <span className="text-3xl text-[#e0e0e0] font-cinzel">{total}</span>
                                <button 
                                    onClick={() => handleStatChange(stat, 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-[#444] text-[#888] hover:bg-black hover:text-white transition-colors"
                                >+</button>
                            </div>

                            <div className="flex justify-between items-center text-xs border-t border-[#333] pt-2">
                                <span className="text-[#666]">
                                    {racialBonus > 0 ? `+${racialBonus} Racial Bonus` : 'No Bonus'}
                                </span>
                                <span className="bg-[#d4af37] text-black px-1.5 py-0.5 font-bold rounded">
                                    {mod}
                                </span>
                            </div>
                        </div>
                    );
                })}
             </div>

             <div className="flex justify-between pt-8">
                <button 
                    onClick={() => setStep(1)}
                    className="border border-[#333] text-[#888] px-6 py-3 hover:bg-[#1a1a1a] hover:text-[#ccc] transition-colors font-cinzel"
                >
                    BACK
                </button>
                <button 
                    onClick={generateLore}
                    disabled={isGenerating || pointsRemaining < 0}
                    className="bg-[#d4af37] text-black font-bold px-8 py-3 hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-cinzel tracking-widest flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                           <span className="animate-spin text-xl">✦</span> SCRIBING...
                        </>
                    ) : (
                        "FINALIZE & GENERATE"
                    )}
                </button>
             </div>
             {error && <div className="text-red-500 text-center mt-4">{error}</div>}
          </div>
        )}

        {/* STEP 3: RESULT */}
        {step === 3 && generatedLore && (
          <div className="animate-fade-in max-w-3xl mx-auto">
             <div className="bg-[#141414] border border-[#d4af37] p-1 relative overflow-hidden">
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]" />

                <div className="bg-[#0c0c0c] p-6 md:p-10 relative">
                    <div className="text-center mb-8">
                        <h2 className="font-cinzel text-3xl md:text-4xl text-[#d4af37] mb-2">{generatedLore.name}</h2>
                        <div className="text-[#888] text-sm uppercase tracking-[0.2em]">{selectedAlignment} {raceData.name.split('(')[0]} {selectedClass.split('(')[0]}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white/5 p-4 border border-[#333]">
                            <h3 className="text-[#d4af37] font-cinzel mb-2 border-b border-[#333] pb-1">Appearance</h3>
                            <p className="text-sm text-[#ccc] leading-relaxed italic">
                                "{generatedLore.appearance}"
                            </p>
                        </div>
                        <div className="bg-white/5 p-4 border border-[#333]">
                            <h3 className="text-[#d4af37] font-cinzel mb-2 border-b border-[#333] pb-1">Backstory</h3>
                            <p className="text-sm text-[#ccc] leading-relaxed">
                                {generatedLore.backstory}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-6 gap-2 mb-8">
                         {Object.keys(finalStats).map(stat => (
                             <div key={stat} className="text-center border border-[#333] p-2 bg-[#1a1a1a]">
                                 <div className="text-[10px] text-[#666] uppercase">{stat}</div>
                                 <div className="text-lg text-[#e0e0e0] font-bold">{finalStats[stat]}</div>
                                 <div className="text-xs text-[#d4af37]">{getMod(finalStats[stat])}</div>
                             </div>
                         ))}
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={() => {
                                setStep(1);
                                setGeneratedLore(null);
                            }}
                            className="text-[#555] hover:text-[#d4af37] transition-colors text-sm font-cinzel"
                        >
                            CREATE ANOTHER
                        </button>
                    </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterGenerator;