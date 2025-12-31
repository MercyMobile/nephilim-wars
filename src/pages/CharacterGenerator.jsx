import React, { useState, useEffect } from 'react';

const CharacterGenerator = ({ onCharacterComplete }) => {
  // === COMPREHENSIVE RACE DATA FROM ENCYCLOPEDIA ===
  const RACES = {
    Sethite: {
      name: "Sethite (Righteous Line)",
      desc: "Descendants of Seth. Keepers of the original faith and pre-fall history.",
      stats: { WIS: 2, CHA: 1 },
      traits: ["Blessed Heritage (Advantage on Religion)", "Divine Favor (1/Long Rest Reroll)"],
      startingRP: 2,
      startingCP: 0,
      hpBonus: 0,
      heightRange: { male: [65, 72], female: [60, 67] }, // inches
      accessory: "prayer shawl, scroll case, or holy phylactery",
      visuals: "simple robes, prayer shawl, serene expression, holding scroll or staff, semitic features, ancient hebrew"
    },
    Cainite: {
      name: "Cainite (City Builder)",
      desc: "Descendants of the first murderer. Masters of metallurgy, music, and urbanization.",
      stats: { INT: 2, CON: 1 },
      traits: ["Mark of Cain (Protection from vengeance)", "City Born (Urban Advantage)", "Builder's Heritage"],
      startingRP: 0,
      startingCP: 1,
      hpBonus: 0,
      heightRange: { male: [66, 73], female: [61, 68] },
      accessory: "bronze jewelry, musical instrument (lyre/flute), or artisan's hammer",
      visuals: "adorned in gold and brass jewelry, fine dyed clothes, musical instrument or hammer, elaborate hair, sharp features"
    },
    Wanderer: {
      name: "Wanderer (Nomad)",
      desc: "Those who rejected both the cities of Cain and the strictures of Seth.",
      stats: { DEX: 2, WIS: 1 },
      traits: ["Survivalist", "Swift Footed (35ft Speed)"],
      startingRP: 0,
      startingCP: 0,
      hpBonus: 0,
      heightRange: { male: [64, 71], female: [59, 66] },
      accessory: "tribal totems, bone necklace, or hunting fetish",
      visuals: "weather-beaten skin, animal furs, tribal tattoos, bow on back, wild hair, dust covered"
    },
    Nephilim: {
      name: "Nephilim (1st Gen Giant)",
      desc: "Direct offspring of Watchers and Humans. Titans of the ancient world.",
      stats: { STR: 4, CON: 2, DEX: -2 },
      traits: ["Large Size (12-15ft)", "Angelic Resistance (Radiant)", "Insatiable Hunger", "Powerful Build"],
      startingRP: 0,
      startingCP: 3,
      hpBonus: 10,
      heightRange: { male: [144, 180], female: [132, 168] }, // 12-15ft
      accessory: "massive bronze armor plates, giant's chain, or trophy skulls",
      visuals: "massive 12ft tall giant, glowing eyes, unnatural muscles, wearing heavy bronze armor, carrying massive weapon, imposing presence"
    },
    Rephaim: {
      name: "Rephaim (Shade/Giant)",
      desc: "Later generations of giants, often associated with the dead.",
      stats: { STR: 2, CON: 2 },
      traits: ["Spirit Sight", "Intimidating Presence"],
      startingRP: 0,
      startingCP: 2,
      hpBonus: 5,
      heightRange: { male: [108, 132], female: [102, 126] }, // 9-11ft
      accessory: "death shroud, spirit talisman, or ancient burial mask",
      visuals: "tall gaunt figure, pale grey skin, shadowy aura, ancient rusted armor, haunting eyes"
    },
    Anakim: {
      name: "Anakim (Noble Giant)",
      desc: "The 'Long-Necked Ones'. A race of giants known for wearing heavy chains.",
      stats: { STR: 3, CHA: 1, DEX: -1 },
      traits: ["Chain Master", "Noble Bearing"],
      startingRP: 0,
      startingCP: 2,
      hpBonus: 8,
      heightRange: { male: [120, 156], female: [114, 144] }, // 10-13ft
      accessory: "heavy gold chains (neck/wrist), royal signet, or ceremonial shackles",
      visuals: "giant stature, wearing heavy gold chains around neck, regal posture, clean shaven head, royal bearing"
    },
    Gibborim: {
      name: "Gibborim (Mighty Man)",
      desc: "Human-Giant hybrids. The 'Mighty Men of Old' - heroic warriors.",
      stats: { STR: 2, CON: 1 },
      traits: ["Powerful Build", "Martial Proficiency", "Heroic Feat"],
      startingRP: 0,
      startingCP: 1,
      hpBonus: 3,
      heightRange: { male: [78, 96], female: [72, 90] }, // 6.5-8ft
      accessory: "lion pelt cloak, hero's bronze bracers, or trophy weapon",
      visuals: "7ft tall, extremely muscular human, lion skin cloak, heroic pose, holding spear, warrior build"
    },
    Horim: {
      name: "Horim (Cave Dweller)",
      desc: "Giant-kin adapted to underground life.",
      stats: { DEX: 2, WIS: 1 },
      traits: ["Superior Darkvision", "Sunlight Sensitivity", "Stone Cunning"],
      startingRP: 0,
      startingCP: 1,
      hpBonus: 2,
      heightRange: { male: [70, 82], female: [65, 77] }, // 6-7ft
      accessory: "stone carving tools, luminescent fungi, or cave crystals",
      visuals: "pale skin, large black eyes, crouched posture, primitive stone tools, cave background, nocturnal"
    },
    Sorcerer: {
      name: "Sorcerer Clan (Watcher-Taught)",
      desc: "Humans initiated into Watcher mysteries like root-cutting and astrology.",
      stats: { INT: 2, CHA: 1 },
      traits: ["Dark Insight (Detect Magic)", "Blood Magic", "Watcher's Mark"],
      startingRP: 0,
      startingCP: 2,
      hpBonus: 0,
      heightRange: { male: [65, 72], female: [60, 67] },
      accessory: "star charts, ritual dagger, dried herbs pouch, or crystal focus",
      visuals: "robes covered in constellations, glowing runes on skin, holding strange herbs or crystals, purple magical aura, mystical"
    }
  };

  // === PHYSICAL APPEARANCE OPTIONS ===
  const SKIN_TONES = [
    { value: "olive", label: "Olive (Semitic)" },
    { value: "tan", label: "Tan (Levantine)" },
    { value: "light brown", label: "Light Brown (Mesopotamian)" },
    { value: "bronze", label: "Bronze (Desert Nomad)" },
    { value: "dark brown", label: "Dark Brown (Cushite/African)" },
    { value: "pale", label: "Pale (Cave Dweller/Northern)" },
    { value: "ashen grey", label: "Ashen Grey (Rephaim/Undead)" },
    { value: "unnaturally pale", label: "Unnaturally Pale (Nephilim)" }
  ];

  const EYE_COLORS = [
    { value: "dark brown", label: "Dark Brown" },
    { value: "brown", label: "Brown" },
    { value: "amber", label: "Amber" },
    { value: "hazel", label: "Hazel" },
    { value: "green", label: "Green (Rare)" },
    { value: "grey", label: "Grey" },
    { value: "blue-grey", label: "Blue-Grey (Rare)" },
    { value: "glowing amber", label: "Glowing Amber (Nephilim)" },
    { value: "black voids", label: "Black Voids (Corrupted)" }
  ];

  const HAIR_COLORS = [
    { value: "black", label: "Black" },
    { value: "dark brown", label: "Dark Brown" },
    { value: "brown", label: "Brown" },
    { value: "auburn", label: "Auburn/Reddish" },
    { value: "grey", label: "Grey (Elder)" },
    { value: "white", label: "White (Ancient)" },
    { value: "silver", label: "Silver (Unnatural)" }
  ];

  const HAIR_LENGTHS = [
    { value: "bald", label: "Bald/Shaven" },
    { value: "very short", label: "Very Short (< 2 inches)" },
    { value: "short", label: "Short (2-4 inches)" },
    { value: "shoulder length", label: "Shoulder Length" },
    { value: "mid-back", label: "Mid-Back" },
    { value: "waist length", label: "Waist Length" },
    { value: "floor length", label: "Floor Length (Nazarite)" }
  ];

  const DISTINGUISHING_FEATURES = [
    { value: "none", label: "None" },
    { value: "battle scar across face", label: "Battle Scar (Face)" },
    { value: "missing eye", label: "Missing Eye" },
    { value: "eyepatch", label: "Eyepatch" },
    { value: "blind milky eyes", label: "Blind (Milky Eyes)" },
    { value: "ritual scarification", label: "Ritual Scarification" },
    { value: "tribal tattoos", label: "Tribal Tattoos" },
    { value: "burn scars", label: "Burn Scars" },
    { value: "missing hand/arm", label: "Missing Hand/Arm" },
    { value: "peg leg", label: "Peg Leg" },
    { value: "hunched back", label: "Hunchback" },
    { value: "leprosy scars", label: "Leprosy (Scars)" },
    { value: "facial deformity", label: "Facial Deformity" },
    { value: "branded mark", label: "Branded Mark" },
    { value: "six fingers", label: "Six Fingers (Giant Blood)" },
    { value: "unnaturally tall", label: "Unnaturally Tall" },
    { value: "glowing runes", label: "Glowing Runes (Sorcerer)" },
    { value: "prophet's beard", label: "Long Prophet's Beard" }
  ];

  // === NAME DATABASES ===
  const NAMES = {
    Male: {
      Sethite: ["Enosh", "Kenan", "Mahalalel", "Jared", "Methuselah", "Lamech", "Noah", "Seth"],
      Cainite: ["Enoch", "Irad", "Mehujael", "Lamech", "Jabal", "Jubal", "Tubal-Cain"],
      Wanderer: ["Zorah", "Nahor", "Terah", "Eber", "Peleg"],
      Giant: ["Og", "Sihon", "Ahiman", "Sheshai", "Talmai", "Arba", "Goliath", "Lahmi", "Anak"]
    },
    Female: {
      Sethite: ["Naamah", "Azura", "Awan", "Dina", "Norea"],
      Cainite: ["Adah", "Zillah", "Naamah"],
      Wanderer: ["Sarai", "Milcah", "Iscah"],
      Giant: ["Noa", "Hoglah", "Tirzah"]
    }
  };

  // === CLASSES ===
  const CLASSES = [
    { value: "Warrior", label: "Warrior (Tribal Fighter)" },
    { value: "Gibbor", label: "Gibbor (Mighty Hero)" },
    { value: "Hunter", label: "Hunter (Wilderness)" },
    { value: "Magi", label: "Magi (Watcher-Taught Sorcerer)" },
    { value: "Priest", label: "Priest (Keeper of Rituals)" },
    { value: "Artisan", label: "Artisan (Smith/Builder)" },
    { value: "Scribe", label: "Scribe (Keeper of Tablets)" }
  ];

  // === VISUAL OPTIONS ===
  const BACKGROUNDS = [
    { value: "ancient stone city", label: "Stone City (Enoch/Irad)" },
    { value: "mountain stronghold", label: "Mountain Fortress" },
    { value: "arid desert wasteland", label: "Desert Wasteland" },
    { value: "lush hanging gardens", label: "Hanging Gardens" },
    { value: "dark ritual cavern", label: "Dark Cavern" },
    { value: "tribal encampment", label: "Nomadic Camp" },
    { value: "bronze age forge", label: "Ancient Forge" }
  ];

  const VIBES = [
    { value: "biblical epic", label: "Biblical Epic" },
    { value: "dark fantasy", label: "Dark Fantasy" },
    { value: "ethereal and holy", label: "Ethereal/Holy" },
    { value: "savage and primal", label: "Savage/Primal" },
    { value: "ancient mesopotamian", label: "Ancient Near East" }
  ];

  // === STATE ===
  const [formData, setFormData] = useState({
    name: '',
    lineage: 'Sethite',
    charClass: 'Warrior',
    sex: 'Male',
    height: '',
    skinTone: 'olive',
    eyeColor: 'dark brown',
    hairColor: 'black',
    hairLength: 'shoulder length',
    distinguishingFeature: 'none',
    background: 'ancient stone city',
    vibe: 'biblical epic',
    customVisuals: '',
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
  });

  const [loading, setLoading] = useState(false);
  const [portrait, setPortrait] = useState(null);
  const [error, setError] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [finalCharacter, setFinalCharacter] = useState(null);

  // === AUTO-GENERATE RANDOM NAME & HEIGHT ===
  useEffect(() => {
    generateRandomName();
    generateRandomHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateRandomName = () => {
    const race = formData.lineage;
    const sex = formData.sex;

    let namePool;
    if (race === 'Nephilim' || race === 'Rephaim' || race === 'Anakim' || race === 'Gibborim') {
      namePool = NAMES[sex].Giant;
    } else if (race === 'Sethite') {
      namePool = NAMES[sex].Sethite;
    } else if (race === 'Cainite') {
      namePool = NAMES[sex].Cainite;
    } else {
      namePool = NAMES[sex].Wanderer;
    }

    const randomName = namePool[Math.floor(Math.random() * namePool.length)];
    setFormData(prev => ({ ...prev, name: randomName }));
  };

  const generateRandomHeight = () => {
    const race = RACES[formData.lineage];
    const heightRange = race.heightRange[formData.sex.toLowerCase()];
    const randomHeight = Math.floor(Math.random() * (heightRange[1] - heightRange[0] + 1)) + heightRange[0];
    const feet = Math.floor(randomHeight / 12);
    const inches = randomHeight % 12;
    setFormData(prev => ({ ...prev, height: `${feet}'${inches}"` }));
  };

  // === HANDLERS ===
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAttrChange = (attr, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: parseInt(value) || 10 }
    }));
  };

  // === BUILD INTELLIGENT IMAGE PROMPT ===
  const buildImagePrompt = () => {
    const raceData = RACES[formData.lineage];
    const customDesc = formData.customVisuals.trim();

    const basePrompt = `Fantasy character portrait of a ${formData.sex} ${raceData.name}, ${formData.charClass} class`;

    // Physical description
    const physicalDesc = `${formData.skinTone} skin, ${formData.eyeColor} eyes, ${formData.hairLength} ${formData.hairColor} hair`;

    // Distinguishing feature
    const featureDesc = formData.distinguishingFeature !== 'none' ? formData.distinguishingFeature : '';

    // Race visuals
    const raceVisuals = raceData.visuals;

    // Height context
    const heightDesc = formData.height.includes("'") && parseInt(formData.height) > 8 ? "towering giant stature" : "";

    const settingDesc = `${formData.vibe} atmosphere, ${formData.background} background`;
    const styleDesc = "detailed biblical fantasy art, dramatic lighting, 8k resolution, oil painting style, historically accurate ancient near east";

    if (customDesc) {
      return `${basePrompt}, ${physicalDesc}, ${featureDesc}, ${customDesc}, ${heightDesc}, ${settingDesc}, ${styleDesc}`.replace(/,\s*,/g, ',').trim();
    } else {
      return `${basePrompt}, ${physicalDesc}, ${featureDesc}, ${raceVisuals}, ${heightDesc}, ${settingDesc}, ${styleDesc}`.replace(/,\s*,/g, ',').trim();
    }
  };

  // === GENERATE IMAGE ===
  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const fullPrompt = buildImagePrompt();
      console.log('Generating image with prompt:', fullPrompt);

      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        const errorMsg = data.message || data.details || data.error || "Generation failed";
        throw new Error(errorMsg);
      }

      if (data.image) {
        setPortrait(`data:image/jpeg;base64,${data.image}`);
      } else {
        throw new Error("No image data received");
      }

    } catch (err) {
      console.error('Image generation error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // === CALCULATE FINAL STATS & CREATE CHARACTER ===
  const handleCreateCharacter = () => {
    if (!formData.name || !portrait) {
      setError("Name and Portrait are required.");
      return;
    }

    const loreData = RACES[formData.lineage];

    // Apply Racial Stat Bonuses
    const finalStats = { ...formData.attributes };
    Object.entries(loreData.stats).forEach(([stat, bonus]) => {
      finalStats[stat] = (finalStats[stat] || 10) + bonus;
    });

    // Calculate Modifiers
    const getMod = (score) => Math.floor((score - 10) / 2);
    const strMod = getMod(finalStats.STR);
    const dexMod = getMod(finalStats.DEX);
    const conMod = getMod(finalStats.CON);

    // Calculate Derived Stats
    const proficiency = 2;
    const maxHp = 10 + conMod + loreData.hpBonus;
    const defense = 10 + dexMod;

    // Define Class Weapon
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
    } else if (formData.charClass === 'Magi') {
      mainAction = {
        id: 's1', name: 'Eldritch Blast', type: 'spell', cost: 1,
        toHitBonus: proficiency + getMod(finalStats.CHA),
        damageDice: '1d10', damageBonus: 0, damageType: 'force'
      };
    } else {
      mainAction = {
        id: 'w1', name: 'Bronze Khopesh', type: 'melee', cost: 1,
        toHitBonus: proficiency + strMod,
        damageDice: '1d8', damageBonus: strMod, damageType: 'slashing'
      };
    }

    const character = {
      id: 'p1',
      name: formData.name,
      isPlayer: true,
      portrait: portrait,
      lineage: formData.lineage,
      lineageData: loreData,
      class: formData.charClass,
      sex: formData.sex,
      height: formData.height,
      skinTone: formData.skinTone,
      eyeColor: formData.eyeColor,
      hairColor: formData.hairColor,
      hairLength: formData.hairLength,
      distinguishingFeature: formData.distinguishingFeature,
      accessory: loreData.accessory,
      attributes: finalStats,
      hp: maxHp,
      maxHp: maxHp,
      defense: defense,
      initiativeBonus: dexMod,
      rp: loreData.startingRP,
      cp: loreData.startingCP,
      actions: [mainAction]
    };

    setFinalCharacter(character);
    setShowSheet(true);
  };

  // === SAVE & CONTINUE ===
  const handleSave = () => {
    if (finalCharacter) {
      localStorage.setItem('generatedCharacter', JSON.stringify(finalCharacter));
      if (onCharacterComplete) {
        onCharacterComplete();
      }
    }
  };

  // === RESET TO CREATE NEW CHARACTER ===
  const handleReset = () => {
    setFormData({
      name: '',
      sex: 'Male',
      lineage: 'Sethite',
      charClass: 'Warrior',
      height: '',
      skinTone: 'olive',
      eyeColor: 'brown',
      hairColor: 'black',
      hairLength: 'short',
      distinguishingFeature: 'none',
      customVisuals: '',
      background: 'desert ruins',
      vibe: 'epic',
      attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
    });
    setPortrait('');
    setFinalCharacter(null);
    setShowSheet(false);
    setError('');
    setLoading(false);
  };

  // === CHARACTER SHEET VIEW ===
  if (showSheet && finalCharacter) {
    return (
      <div className="min-h-screen bg-[#0c0a09] text-[#d6d3d1] font-serif p-4">
        <div className="max-w-5xl mx-auto border-2 border-[#78350f] bg-[#1c1917] rounded-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#78350f] to-[#92400e] p-6 text-center">
            <h1 className="text-4xl font-cinzel font-bold text-[#fcd34d] mb-2">{finalCharacter.name}</h1>
            <div className="text-[#d6d3d1] text-lg">
              {finalCharacter.sex} {finalCharacter.lineageData.name} • {finalCharacter.class}
            </div>
            <div className="text-[#a8a29e] text-sm mt-1">{finalCharacter.height} tall</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

            {/* Portrait */}
            <div className="border-2 border-[#44403c] rounded overflow-hidden">
              <img src={finalCharacter.portrait} alt={finalCharacter.name} className="w-full h-auto" />
            </div>

            {/* Stats Column */}
            <div className="space-y-6">

              {/* Physical Appearance */}
              <div>
                <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">APPEARANCE</h3>
                <div className="bg-[#0c0a09] border border-[#44403c] p-3 space-y-1 text-sm">
                  <div><span className="text-[#78716c]">Skin:</span> <span className="text-[#d6d3d1] capitalize">{finalCharacter.skinTone}</span></div>
                  <div><span className="text-[#78716c]">Eyes:</span> <span className="text-[#d6d3d1] capitalize">{finalCharacter.eyeColor}</span></div>
                  <div><span className="text-[#78716c]">Hair:</span> <span className="text-[#d6d3d1] capitalize">{finalCharacter.hairLength} {finalCharacter.hairColor}</span></div>
                  {finalCharacter.distinguishingFeature !== 'none' && (
                    <div><span className="text-[#78716c]">Feature:</span> <span className="text-[#fcd34d] capitalize">{finalCharacter.distinguishingFeature}</span></div>
                  )}
                  <div><span className="text-[#78716c]">Accessory:</span> <span className="text-[#a8a29e] italic">{finalCharacter.accessory}</span></div>
                </div>
              </div>

              {/* Attributes */}
              <div>
                <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">ATTRIBUTES</h3>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(finalCharacter.attributes).map(([stat, value]) => (
                    <div key={stat} className="bg-[#0c0a09] border border-[#44403c] p-2 text-center">
                      <div className="text-[#78716c] text-xs font-bold">{stat}</div>
                      <div className="text-[#fcd34d] text-2xl font-bold">{value}</div>
                      <div className="text-[#a8a29e] text-sm">
                        {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combat Stats */}
              <div>
                <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">COMBAT</h3>
                <div className="grid grid-cols-3 gap-3 bg-[#0c0a09] p-3 border border-[#44403c]">
                  <div className="text-center">
                    <div className="text-[#78716c] text-xs">HP</div>
                    <div className="text-[#ef4444] text-xl font-bold">{finalCharacter.maxHp}</div>
                  </div>
                  <div className="text-center border-x border-[#44403c]">
                    <div className="text-[#78716c] text-xs">DEFENSE</div>
                    <div className="text-[#3b82f6] text-xl font-bold">{finalCharacter.defense}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#78716c] text-xs">INITIATIVE</div>
                    <div className="text-[#fcd34d] text-xl font-bold">
                      {finalCharacter.initiativeBonus >= 0 ? '+' : ''}{finalCharacter.initiativeBonus}
                    </div>
                  </div>
                </div>
              </div>

              {/* Soul Economy */}
              <div>
                <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">SOUL ECONOMY</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-950/30 border-l-4 border-blue-600 p-3">
                    <div className="text-blue-400 text-xs font-bold">RIGHTEOUSNESS (RP)</div>
                    <div className="text-white text-2xl font-bold">{finalCharacter.rp}</div>
                  </div>
                  <div className="bg-red-950/30 border-l-4 border-red-600 p-3">
                    <div className="text-red-400 text-xs font-bold">CORRUPTION (CP)</div>
                    <div className="text-white text-2xl font-bold">{finalCharacter.cp}</div>
                  </div>
                </div>
              </div>

              {/* Racial Traits */}
              <div>
                <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">RACIAL TRAITS</h3>
                <div className="space-y-2">
                  {finalCharacter.lineageData.traits.map((trait, i) => (
                    <div key={i} className="bg-[#0c0a09] border border-[#44403c] p-2 text-sm">
                      <span className="text-[#fcd34d] font-bold">{trait.split('(')[0]}</span>
                      {trait.includes('(') && <span className="text-[#a8a29e]"> ({trait.split('(')[1]}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">ACTIONS</h3>
                {finalCharacter.actions.map((action, i) => (
                  <div key={i} className="bg-[#0c0a09] border border-[#44403c] p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold">{action.name}</span>
                      <span className="text-[#78716c] text-xs uppercase">{action.type}</span>
                    </div>
                    <div className="text-sm text-[#a8a29e]">
                      <span className="text-[#fcd34d]">To Hit:</span> +{action.toHitBonus} |
                      <span className="text-[#fcd34d]"> Damage:</span> {action.damageDice}+{action.damageBonus} {action.damageType}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-6 bg-[#0c0a09] border-t border-[#44403c] flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => setShowSheet(false)}
              className="px-8 py-3 bg-[#44403c] border border-[#78716c] text-white font-bold rounded hover:bg-[#57534e] transition"
            >
              ← Back to Editor
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-[#78350f] border border-[#f59e0b] text-[#fcd34d] font-bold rounded hover:bg-[#92400e] transition"
            >
              ✨ Create Another Character
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-green-900 border border-green-600 text-green-100 font-bold rounded hover:bg-green-800 transition shadow-[0_0_20px_rgba(22,163,74,0.3)]"
            >
              Save & Enter Combat →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === CREATION FORM ===
  return (
    <div className="w-full bg-[#0c0a09] text-[#d6d3d1] font-serif p-4">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">

        {/* LEFT PANEL: CREATION FORM */}
        <div className="border-2 border-[#78350f] bg-[#1c1917]/95 p-6 shadow-[0_0_40px_rgba(245,158,11,0.1)] rounded-sm">
          <h1 className="text-4xl text-[#fcd34d] font-cinzel font-bold mb-6 border-b border-[#78350f] pb-2 tracking-widest text-center shadow-black drop-shadow-lg">
            CREATE CHARACTER
          </h1>

          <div className="space-y-5">

            {/* NAME with Random Button */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest">Name</label>
                <button
                  onClick={generateRandomName}
                  className="text-[#78716c] hover:text-[#fcd34d] text-xs font-bold uppercase transition"
                >
                  🎲 Random
                </button>
              </div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Enoch"
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
                  className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
                >
                  {Object.keys(RACES).map(key => (
                    <option key={key} value={key}>{RACES[key].name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* LORE INFO */}
            <div className="bg-[#292524] p-3 border-l-2 border-[#f59e0b] text-xs">
              <p className="text-[#d6d3d1] mb-1">{RACES[formData.lineage].desc}</p>
              <p className="text-[#fcd34d] font-bold">
                Bonuses: {Object.entries(RACES[formData.lineage].stats).map(([k,v]) => `${v>0?'+':''}${v} ${k}`).join(', ')}
              </p>
              <p className="text-blue-400 text-xs mt-1">RP: {RACES[formData.lineage].startingRP} | <span className="text-red-400">CP: {RACES[formData.lineage].startingCP}</span></p>
            </div>

            {/* CLASS */}
            <div>
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Class</label>
              <select
                name="charClass"
                value={formData.charClass}
                onChange={handleChange}
                className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
              >
                {CLASSES.map(cls => (
                  <option key={cls.value} value={cls.value}>{cls.label}</option>
                ))}
              </select>
            </div>

            {/* PHYSICAL APPEARANCE */}
            <div className="border-t border-[#44403c] pt-4">
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-3">Physical Appearance</label>

              {/* Height & Skin Tone */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">HEIGHT</label>
                  <div className="flex gap-2">
                    <input
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="flex-1 bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                      placeholder="e.g. 6'2&quot;"
                    />
                    <button
                      onClick={generateRandomHeight}
                      className="px-2 bg-[#292524] border border-[#44403c] text-[#78716c] hover:text-[#fcd34d] text-xs transition"
                    >
                      🎲
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">SKIN TONE</label>
                  <select
                    name="skinTone"
                    value={formData.skinTone}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {SKIN_TONES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Eye & Hair Color */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">EYE COLOR</label>
                  <select
                    name="eyeColor"
                    value={formData.eyeColor}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {EYE_COLORS.map(e => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">HAIR COLOR</label>
                  <select
                    name="hairColor"
                    value={formData.hairColor}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {HAIR_COLORS.map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hair Length & Features */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">HAIR LENGTH</label>
                  <select
                    name="hairLength"
                    value={formData.hairLength}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {HAIR_LENGTHS.map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">DISTINGUISHING FEATURE</label>
                  <select
                    name="distinguishingFeature"
                    value={formData.distinguishingFeature}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {DISTINGUISHING_FEATURES.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ATTRIBUTES */}
            <div className="border-t border-[#44403c] pt-4">
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

            {/* VISUAL CUSTOMIZATION */}
            <div className="border-t border-[#44403c] pt-4">
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-2">Visual Settings</label>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">BACKGROUND</label>
                  <select
                    name="background"
                    value={formData.background}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {BACKGROUNDS.map(bg => (
                      <option key={bg.value} value={bg.value}>{bg.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">ATMOSPHERE</label>
                  <select
                    name="vibe"
                    value={formData.vibe}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {VIBES.map(v => (
                      <option key={v.value} value={v.value}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] text-[10px] font-bold mb-1">CUSTOM DESCRIPTION (OPTIONAL)</label>
                <textarea
                  name="customVisuals"
                  value={formData.customVisuals}
                  onChange={handleChange}
                  placeholder="Add specific details (e.g., 'scarred face, carrying ancient tablet, glowing staff')..."
                  className="w-full bg-black border border-[#44403c] p-2 text-sm text-white h-16 resize-none focus:border-[#f59e0b] outline-none"
                />
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
              {loading ? 'Summoning Image...' : 'Generate Portrait'}
            </button>

            {error && (
              <div className="bg-red-900/30 border border-red-800 p-2 text-red-400 text-xs text-center mt-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: PREVIEW CARD */}
        <div className="border-2 border-[#78350f] bg-black p-2 flex flex-col relative shadow-2xl">
          <div className="text-center py-4 bg-[#1c1917] border-b border-[#292524]">
            <h2 className="text-3xl font-cinzel font-bold text-[#fcd34d] drop-shadow-md">
              {formData.name || 'UNKNOWN'}
            </h2>
            <div className="flex justify-center gap-3 text-[#a8a29e] font-serif italic mt-1 text-xs uppercase tracking-wide">
              <span>{formData.sex}</span>
              <span>•</span>
              <span>{formData.lineage}</span>
              <span>•</span>
              <span>{formData.charClass}</span>
            </div>
          </div>

          <div className="border border-[#292524] bg-[#0c0a09] relative overflow-hidden group aspect-square">
            {portrait ? (
              <img src={portrait} alt="Generated" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#44403c]">
                <span className="text-6xl opacity-20 mb-4 animate-pulse">📜</span>
                <p className="uppercase tracking-widest text-xs">Awaiting Portrait</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none"></div>
          </div>

          <div className="p-4 bg-[#1c1917] border-t border-[#292524]">
            {portrait ? (
              <button
                onClick={handleCreateCharacter}
                className="w-full bg-green-900/80 border border-green-600 text-green-100 py-3 text-lg font-cinzel font-bold uppercase tracking-widest hover:bg-green-800 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]"
              >
                View Character Sheet →
              </button>
            ) : (
              <div className="text-center text-[#57534e] text-xs uppercase tracking-widest py-3">
                Generate portrait first
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CharacterGenerator;
