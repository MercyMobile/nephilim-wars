import React, { useState, useEffect } from 'react';
import { validateCharacterName, validateAttribute, validateDescription } from '../utils/validation';
import { setCharacterData, addToPartyRoster } from '../utils/storage';

const CharacterGenerator = ({ onCharacterComplete }) => {
  // === COMPREHENSIVE ANCESTRY DATA (PF2e-Compliant per Manual) ===
  const RACES = {
    Sethite: {
      name: "Sethite (Righteous Line)",
      desc: "Descendants of Seth. Keepers of the original faith and pre-fall history.",
      abilityBoosts: ["Free", "Free"], 
      abilityFlaw: "Free", 
      ancestryHP: 8,
      size: "Medium",
      speed: 25,
      traits: ["Blessed Heritage (+1 Religion)", "Divine Favor (Detect Evil 1/day)", "Low-Light Vision"],
      startingRP: 2,
      startingCP: 0,
      heightRange: { male: [65, 72], female: [60, 67] },
      accessory: "prayer shawl, scroll case, or holy phylactery",
      // LOGIC FIX: Authentic Levantine details
      visuals: "simple unbleached linen robes, prayer shawl (tallit) with tekhelet fringes, serene expression, holding scroll or shepherd's staff, rich olive to deep bronze skin, dark textured hair and beard, strong aquiline nose, sandals, strictly humanoid anatomy"
    },
    Cainite: {
      name: "Cainite (City Builder)",
      desc: "Descendants of the first murderer. Masters of metallurgy, music, and urbanization.",
      abilityBoosts: ["Free", "Free"], 
      abilityFlaw: "Con",
      ancestryHP: 8,
      size: "Medium",
      speed: 25,
      traits: ["Mark of Cain (Protection from vengeance)", "City Born (Urban Advantage)", "Builder's Heritage"],
      startingRP: 0,
      startingCP: 1,
      heightRange: { male: [66, 74], female: [62, 70] },
      accessory: "musical instrument, bronze tools, or jewelry",
      // LOGIC FIX: Babylonian/Sumerian nobility details
      visuals: "adorned in hammered gold and brass jewelry, fine dyed clothes (Tyrian purple/crimson), musical instrument or bronze hammer, elaborate oiled and braided black hair, sharp angular features, polished copper or terracotta skin, tattoos of city maps"
    },
    Wanderer: {
      name: "Wanderer (Nomad)",
      desc: "Those who rejected both the cities of Cain and the strictures of Seth.",
      abilityBoosts: ["Dex", "Free"],
      abilityFlaw: "Cha",
      ancestryHP: 8,
      size: "Medium",
      speed: 30,
      traits: ["Survivalist", "Swift Footed (+5ft Speed)", "Wary"],
      startingRP: 1,
      startingCP: 0,
      heightRange: { male: [64, 73], female: [60, 68] },
      accessory: "composite bow, waterskin, or tribal totem",
      // LOGIC FIX: Proto-Bedouin/Nomadic details
      visuals: "weather-beaten deep tawny skin, sun-darkened complexion, animal furs and leather, tribal scarification, composite bow on back, wild wind-blown black hair, dust covered, piercing dark almond eyes, protective head-wrap"
    },
    Nephilim: {
      name: "Nephilim (The Fallen)",
      desc: "The offspring of the Watchers and humans. Powerful, tall, and spiritually conflicted.",
      abilityBoosts: ["Str", "Cha"],
      abilityFlaw: "Wis",
      ancestryHP: 10,
      size: "Medium",
      speed: 25,
      traits: ["Titanic Strength", "Divine Spark (Magic Affinity)", "Hubris"],
      startingRP: 0,
      startingCP: 2,
      heightRange: { male: [84, 96], female: [78, 90] },
      accessory: "bronze scale fragment, glowing gemstone, or broken shackle",
      // LOGIC FIX: Greek Heroic/Demigod aesthetic. EXPLICIT negative prompt for wings/horns.
      visuals: "towering height (7-8ft), unnaturally perfect physique (statuesque), faint glowing eyes, bronze armor scales, metallic or marble-like skin tone (unnatural perfection), NO wings, NO horns, distinct 'heroic' aura, chiseled features"
    },
    Anakim: {
      name: "Anakim (Giant)",
      desc: "True giants of the land. Warriors of terrifying strength.",
      abilityBoosts: ["Str", "Con"],
      abilityFlaw: "Dex",
      ancestryHP: 12,
      size: "Large",
      speed: 20,
      traits: ["Large Size", "Reach", "Terrifying Presence"],
      startingRP: 0,
      startingCP: 3,
      heightRange: { male: [108, 120], female: [100, 115] },
      accessory: "primitive heavy weapon, trophy, or iron chain",
      // LOGIC FIX: Philistine/Canaanite Warlord details
      visuals: "massive stature (9-10ft), thick muscular build, primitive heavy weapons (mauls/spears), deeply tanned and scarred skin, potentially six fingers on each hand (polydactyly), coarse thick hair, braided beards with bronze rings"
    }
  };

  const CLASSES = ["Warrior", "Priest", "Hunter", "Artisan", "Sorcerer"];
  const BACKGROUNDS = ["Shepherd", "City Guard", "Temple Scribe", "Exile", "Blacksmith", "Watcher's Disciple"];
  const ALIGNMENTS = ["LG", "NG", "CG", "LN", "TN", "CN", "LE", "NE", "CE"];

  const [characterName, setCharacterName] = useState("");
  const [selectedRace, setSelectedRace] = useState("Sethite");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedBackground, setSelectedBackground] = useState(BACKGROUNDS[0]);
  const [selectedAlignment, setSelectedAlignment] = useState("TN");
  const [attributes, setAttributes] = useState({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  const [backstory, setBackstory] = useState("");
  const [appearance, setAppearance] = useState("");
  
  // AI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // --- LOGIC FIX: IMPROVED AI GENERATION ---
  const generateLore = async () => {
    setIsGenerating(true);
    setError(null);

    const apiKey = ""; // Runtime handled key
    const raceInfo = RACES[selectedRace];

    const systemInstruction = `You are a strict creative writer for a Tabletop RPG set in the 'Nephilim Wars' universe (Biblical Antediluvian Bronze Age). 
    
    CRITICAL RULES:
    1. VISUALS: Characters must have 2 arms and 2 legs. NO WINGS. NO TAILS. NO HORNS (unless Anakim/Giant).
    2. SETTING: Bronze Age. No plate armor. Use linen, wool, bronze, leather.
    3. ETHNICITY: Ancient Near East (Mesopotamian/Levantine). 
       - Skin: Olive, Bronze, Copper, Tawny, Umber.
       - Hair: Dark, textured, curly/wavy.
       - Features: Aquiline noses, almond eyes.
       - AVOID: "Pale/Fair" European tropes.
    4. ACCURACY: Strictly adhere to the provided Visual Guide.`;

    const userPrompt = `
    Generate a concise JSON profile for this character:
    
    DATA:
    - Name: ${characterName || "Unnamed"}
    - Race: ${raceInfo.name}
    - Visual Guide: ${raceInfo.visuals}
    - Class: ${selectedClass}
    - Background: ${selectedBackground}
    - Alignment: ${selectedAlignment}
    - Attributes: Str ${attributes.str}, Dex ${attributes.dex}, Con ${attributes.con}, Int ${attributes.int}, Wis ${attributes.wis}, Cha ${attributes.cha}
    
    INSTRUCTIONS:
    - "appearance": A vivid physical description focusing on the skin tone and clothing materials (max 50 words).
    - "backstory": A brief 2-sentence history connected to their background.
    
    RESPONSE FORMAT (JSON ONLY):
    {
      "appearance": "...",
      "backstory": "..."
    }
    `;

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

      if (!response.ok) throw new Error("Scribe failed to record.");
      
      const data = await response.json();
      const content = JSON.parse(data.candidates[0].content.parts[0].text);
      
      setAppearance(content.appearance);
      setBackstory(content.backstory);
    } catch (err) {
      console.error(err);
      setError("The spirits remain silent. (Generation Failed)");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCharacter = () => {
    if (!validateCharacterName(characterName)) {
      setError("Name is required.");
      return;
    }
    
    const newChar = {
      id: Date.now().toString(),
      name: characterName,
      race: RACES[selectedRace],
      class: selectedClass,
      background: selectedBackground,
      alignment: selectedAlignment,
      attributes,
      appearance,
      backstory,
      hp: RACES[selectedRace].ancestryHP,
      level: 1
    };

    if (onCharacterComplete) {
      onCharacterComplete(newChar);
    } else if (typeof addToPartyRoster === 'function') {
      addToPartyRoster(newChar);
    }
  };

  return (
    <div className="bg-[#1c1917] text-stone-300 min-h-screen p-4 md:p-8 font-cinzel">
       {/* HEADER */}
       <div className="max-w-4xl mx-auto border-b border-amber-900/50 pb-4 mb-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl text-amber-500 font-bold tracking-widest">CHARACTER CHRONICLE</h1>
          <div className="text-stone-500 text-xs uppercase tracking-widest">Nephilim Wars • PF2e Edition</div>
       </div>

       <div className="max-w-4xl mx-auto space-y-8">
          
          {/* 1. BASIC DETAILS */}
          <section className="bg-stone-900/50 p-6 border border-stone-800 rounded">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-amber-600 text-xs uppercase tracking-widest mb-2">Name</label>
                   <input 
                      type="text" 
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="w-full bg-black/40 border border-stone-700 text-stone-100 p-2 focus:border-amber-500 focus:outline-none"
                      placeholder="Enter Name..."
                   />
                </div>
                <div>
                   <label className="block text-amber-600 text-xs uppercase tracking-widest mb-2">Lineage</label>
                   <select 
                      value={selectedRace}
                      onChange={(e) => setSelectedRace(e.target.value)}
                      className="w-full bg-black/40 border border-stone-700 text-stone-100 p-2 focus:border-amber-500 focus:outline-none"
                   >
                      {Object.keys(RACES).map(r => <option key={r} value={r}>{RACES[r].name}</option>)}
                   </select>
                </div>
             </div>
             
             {/* Race Details Preview */}
             <div className="mt-4 p-4 bg-black/20 border border-dashed border-stone-800 text-sm">
                <p className="text-stone-400 italic mb-2">{RACES[selectedRace].desc}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                   <span className="text-amber-700">HP: {RACES[selectedRace].ancestryHP}</span>
                   <span className="text-amber-700">Speed: {RACES[selectedRace].speed}ft</span>
                   <span className="text-amber-700">Size: {RACES[selectedRace].size}</span>
                   <span className="text-amber-700">RP: {RACES[selectedRace].startingRP}</span>
                </div>
             </div>
          </section>

          {/* 2. CLASS & ORIGIN */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label className="block text-amber-600 text-xs uppercase tracking-widest mb-2">Class</label>
                <select 
                   value={selectedClass} 
                   onChange={(e) => setSelectedClass(e.target.value)}
                   className="w-full bg-stone-900/50 border border-stone-800 text-stone-100 p-2"
                >
                   {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-amber-600 text-xs uppercase tracking-widest mb-2">Background</label>
                <select 
                   value={selectedBackground} 
                   onChange={(e) => setSelectedBackground(e.target.value)}
                   className="w-full bg-stone-900/50 border border-stone-800 text-stone-100 p-2"
                >
                   {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-amber-600 text-xs uppercase tracking-widest mb-2">Alignment</label>
                <select 
                   value={selectedAlignment} 
                   onChange={(e) => setSelectedAlignment(e.target.value)}
                   className="w-full bg-stone-900/50 border border-stone-800 text-stone-100 p-2"
                >
                   {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
             </div>
          </section>

          {/* 3. LORE GENERATION */}
          <section className="bg-stone-900/50 p-6 border border-stone-800 rounded relative">
             <div className="flex justify-between items-center mb