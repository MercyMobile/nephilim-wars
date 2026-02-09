import React, { useState, useEffect } from 'react';
import { validateCharacterName, validateAttribute, validateDescription } from '../utils/validation';
import { setCharacterData, addToPartyRoster } from '../utils/storage';

// === CONSTANTS ===
const RACES = {
  Sethite: {
    desc: "Descendants of Seth, blessed with righteousness and wisdom.",
    abilityBoosts: ["WIS", "Free", "Free"],
    abilityFlaw: null,
    size: "Medium",
    speed: 25,
    accessory: "Sacred scroll or tablet",
    startingRP: 2,
    startingCP: 2,
    ancestryHP: 8,
    heightRange: { male: [66, 72], female: [62, 68] }, // in inches
    visuals: "simple robes, leather belt, travel sandals"
  },
  // Add other races here as needed...
};

const CLASSES = [
  { value: "Warrior", label: "Warrior (Protector)", classHP: 10, keyAbility: "STR or DEX" },
  { value: "Priest", label: "Priest (Holy Servant)", classHP: 8, keyAbility: "WIS" },
  { value: "Artisan", label: "Artisan (Smith/Builder)", classHP: 8, keyAbility: "INT or STR" },
  { value: "Scribe", label: "Scribe (Keeper of Tablets)", classHP: 6, keyAbility: "INT" }
];

const GAME_BACKGROUNDS = [
  { value: "watchers_apprentice", label: "Watcher's Apprentice", boost: "INT", skill: "Arcana", lore: "Astronomy Lore" },
  { value: "desert_nomad", label: "Desert Nomad", boost: "CON", skill: "Survival", lore: "Desert Lore" },
  // Add more backgrounds as needed...
];

const EQUIPMENT = {
  Warrior: [
    { id: 'bronze_sword', name: 'Bronze Longsword', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'slashing', desc: 'Standard military sword' },
    { id: 'spear_shield', name: 'Spear & Shield', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'piercing', desc: 'Versatile spear (1d8 two-handed), +2 AC from shield' },
    // Add more equipment...
  ],
  Priest: [
    { id: 'holy_staff', name: 'Blessed Bronze Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Inscribed with sacred names' },
    // Add more equipment...
  ],
  // Add other classes...
};

const WEAPON_VISUALS = {
  'bronze_sword': 'a gleaming bronze longsword with intricate engravings',
  'spear_shield': 'a long bronze-tipped spear paired with a hide-covered wooden shield',
  'holy_staff': 'an ornate bronze-tipped staff adorned with symbols',
  // Add more if needed...
};

const CLASS_VISUALS = {
  Warrior: "leather cuirass, arm guards, sturdy boots, practical utility belt",
  Priest: "linen robes, ceremonial sash, bronze ornaments, simple sandals",
  Artisan: "leather apron, tool belt, sturdy work clothes, protective gloves",
  Scribe: "scroll case, ink-stained fingers, simple robes, writing implements",
};

const SKIN_TONES = [
  { value: 'olive', label: 'Olive' },
  { value: 'tan', label: 'Tan' },
  { value: 'warm bronze', label: 'Warm Bronze' },
  { value: 'deep brown', label: 'Deep Brown' },
  { value: 'fair', label: 'Fair (Pale)' },
  { value: 'ebony', label: 'Ebony' }
];

const SKIN_MAP = {
  'olive': 'warm olive skin',
  'tan': 'sun-kissed tan skin',
  'warm bronze': 'warm bronze skin',
  'deep brown': 'rich deep brown skin',
  'fair': 'fair skin',
  'ebony': 'ebony skin'
};

const EYE_COLORS = [
  { value: 'dark brown', label: 'Dark Brown' },
  { value: 'brown', label: 'Brown' },
  { value: 'hazel', label: 'Hazel' },
  { value: 'amber', label: 'Amber' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'grey', label: 'Grey' }
];

const HAIR_COLORS = [
  { value: "jet black", label: "Black" },
  { value: "dark brown", label: "Dark Brown" },
  { value: "brown", label: "Brown" },
  { value: "auburn reddish", label: "Auburn/Reddish" },
  { value: "bright golden blonde", label: "Golden" },
  { value: "iron grey", label: "Grey (Elder)" },
  { value: "pure white", label: "White (Ancient)" },
  { value: "metallic silver", label: "Silver (Unnatural)" },
  { value: "dark blue-black with vivid blue sheen and blue highlights", label: "Raven Blue (Dark Sheen)" }
];

const HAIR_LENGTHS = [
  { value: "completely bald shaved head", label: "Bald/Shaven" },
  { value: "very short cropped close to scalp", label: "Short Cropped" },
  { value: "shoulder length hair ending exactly at the shoulders", label: "Shoulder Length" },
  { value: "long flowing hair past the shoulders to mid-back", label: "Long Flowing" },
  { value: "tightly braided hair in multiple braids", label: "Braided" },
  { value: "wild untamed mane of hair in all directions", label: "Wild Mane" },
  { value: "very long hair reaching down to the waist", label: "Waist Length" },
  { value: "extremely long hair reaching the floor", label: "Floor Length (Nazarite)" }
];

const BODY_BUILDS = [
  { value: "random", label: "Random" },
  { value: "gaunt", label: "Gaunt / Emaciated" },
  { value: "lean", label: "Lean / Wiry" },
  { value: "athletic", label: "Athletic / Muscular" },
  { value: "stocky", label: "Stocky / Broad" },
  { value: "heavyset", label: "Heavyset / Fat" },
  { value: "towering", label: "Towering / Giant-Blooded" }
];

const DISTINGUISHING_FEATURES = [
  { value: "none", label: "None" },
  { value: "small scar on cheek", label: "Small Scar on Cheek" },
  { value: "birthmark shaped like a star", label: "Birthmark (Star-Shaped)" },
  { value: "distinctive tattoo of a serpent", label: "Tattoo (Serpent Motif)" },
  { value: "missing finger on left hand", label: "Missing Finger (Left Hand)" },
  { value: "piercing green eyes", label: "Piercing Green Eyes" },
  { value: "unusually tall for their race", label: "Unusually Tall" },
  { value: "weathered hands from labor", label: "Weathered Hands" }
];

const MOUNTS = [
  { value: "none", label: "None" },
  { value: "donkey", label: "Donkey (Steady)" },
  { value: "horse", label: "Horse (Swift)" },
  { value: "camel", label: "Camel (Desert)" },
  { value: "ox", label: "Ox (Strong)" }
];

const BACKGROUNDS = [
  { value: "ancient stone city", label: "Ancient Stone City" },
  { value: "desert oasis", label: "Desert Oasis" },
  { value: "fertile river valley", label: "Fertile River Valley" },
  { value: "hillside village", label: "Hillside Village" },
  { value: "coastal trading port", label: "Coastal Trading Port" }
];

const VIBES = [
  { value: "biblical epic", label: "Biblical Epic" },
  { value: "dark fantasy", label: "Dark Fantasy" },
  { value: "ethereal and holy", label: "Ethereal/Holy" },
  { value: "savage and primal", label: "Savage/Primal" },
  { value: "cosmic horror lovecraftian", label: "Cosmic Horror (Lovecraftian)" },
  { value: "renaissance oil painting dramatic", label: "Renaissance Oil (Dramatic)" },
  { value: "frazetta fantasy pulp", label: "Frazetta Fantasy (Pulp)" },
  { value: "ancient mystery foggy", label: "Ancient Mystery (Foggy)" },
  { value: "ancient mesopotamian", label: "Ancient Near East" }
];

// Names placeholder
const NAMES = {
  Male: {
    Sethite: ["Enosh", "Kenan", "Mahalalel", "Jared", "Enoch", "Methuselah", "Lamech", "Noah"],
    // Add more as needed...
  },
  Female: {
    Sethite: ["Adah", "Zillah", "Naamah", "Azura", "Iradia"],
    // Add more as needed...
  }
};

// === COMPONENT ===
export default function CharacterGenerator({ onCharacterComplete }) {
  // === STATE ===
  const [formData, setFormData] = useState({
    name: '',
    lineage: 'Sethite',
    charClass: 'Warrior',
    level: 1,
    gameBackground: 'watchers_apprentice',
    sex: 'Male',
    height: '',
    skinTone: 'olive',
    eyeColor: 'dark brown',
    hairColor: 'black',
    hairLength: 'shoulder length',
    bodyBuild: 'athletic',
    distinguishingFeature: 'none',
    mount: 'none',
    background: 'ancient stone city',
    vibe: 'biblical epic',
    customVisuals: '',
    imageModel: 'flux-schnell',
    equipment: 'bronze_sword', // Default equipment
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    // PF2e Boost Allocations
    ancestryFreeBoosts: [],
    ancestryFlaw: '',
    bgFixedChoice: '',
    bgFreeBoost: '',
    classKeyChoice: '',
    freeBoosts: []
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

    if (race === 'Nephilim'|| race === 'Rephaim'|| race === 'Anakim'|| race === 'Gibborim'|| race === 'Elioud') {
      namePool = NAMES[sex].Giant;
    } else if (race === 'Sethite') {
      namePool = NAMES[sex].Sethite;
    } else if (race === 'Cainite') {
      namePool = NAMES[sex].Cainite;
    } else if (race === 'Sorcerer') {
      namePool = NAMES[sex].Sorcerer;
    } else if (race === 'Horim') {
      namePool = NAMES[sex].Giant; // Horim use giant-kin names
    } else {
      namePool = NAMES[sex].Sethite; // Default
    }

    if (!namePool || namePool.length === 0) {
      console.warn(`No names found for race: ${race}, sex: ${sex}`);
      setFormData(prev => ({ ...prev, name: `Unknown ${race}` }));
      return;
    }

    const randomName = namePool[Math.floor(Math.random() * namePool.length)];
    setFormData(prev => ({ ...prev, name: randomName }));
  };

  const generateRandomHeight = () => {
    const race = RACES[formData.lineage];
    if (!race || !race.heightRange) {
      console.warn(`No height range found for race: ${formData.lineage}`);
      return;
    }
    const heightRange = race.heightRange[formData.sex.toLowerCase()];
    const randomHeight = Math.floor(Math.random() * (heightRange[1] - heightRange[0] + 1)) + heightRange[0];
    const feet = Math.floor(randomHeight / 12);
    const inches = randomHeight % 12;
    setFormData(prev => ({ ...prev, height: `${feet}'${inches}"` }));
  };

  // === SUMMON RANDOM LEGEND ===
  const summonRandomLegend = () => {
    const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const raceKeys = Object.keys(RACES);
    const randomRace = randomFrom(raceKeys);
    const randomSex = randomFrom(['Male', 'Female']);
    const randomClass = randomFrom(CLASSES).value;
    const randomBg = randomFrom(GAME_BACKGROUNDS).value;

    // Randomly allocate boosts per PF2e rules
    const raceData = RACES[randomRace];
    const classData = CLASSES.find(c => c.value === randomClass)|| CLASSES[0];
    const bgData = GAME_BACKGROUNDS.find(b => b.value === randomBg);

    // Ancestry free boosts
    const freeCount = raceData.abilityBoosts.filter(b => b === 'Free').length;
    const allStats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    const shuffled = [...allStats].sort(() => Math.random() - 0.5);
    const ancestryFreeBoosts = shuffled.slice(0, freeCount);

    // Ancestry flaw
    const ancestryFlaw = raceData.abilityFlaw && raceData.abilityFlaw !== "Free" ? raceData.abilityFlaw : '';

    // Background fixed choice
    let bgFixedChoice = '';
    if (bgData && bgData.boost.includes(' or ')) {
        const options = bgData.boost.split(' or ').map(s => s.trim());
        bgFixedChoice = randomFrom(options);
    }

    // Background free boost
    const bgFreeBoost = randomFrom(allStats);

    // Class key choice
    let classKeyChoice = '';
    if (classData && classData.keyAbility.includes(' or ')) {
        const options = classData.keyAbility.split(' or ').map(s => s.trim());
        classKeyChoice = randomFrom(options);
    }

    // Free boosts (4 total)
    const availableStats = allStats.filter(stat => !ancestryFreeBoosts.includes(stat) && stat !== ancestryFlaw && stat !== bgFreeBoost && (!bgFixedChoice || stat !== bgFixedChoice) && (!classKeyChoice || stat !== classKeyChoice));
    const shuffledFree = [...availableStats].sort(() => Math.random() - 0.5);
    const freeBoosts = shuffledFree.slice(0, 4);

    setFormData({
      ...formData,
      lineage: randomRace,
      sex: randomSex,
      charClass: randomClass,
      gameBackground: randomBg,
      level: Math.floor(Math.random() * 5) + 1,
      skinTone: randomFrom(SKIN_TONES).value,
      eyeColor: randomFrom(EYE_COLORS).value,
      hairColor: randomFrom(HAIR_COLORS).value,
      hairLength: randomFrom(HAIR_LENGTHS).value,
      bodyBuild: randomFrom(BODY_BUILDS).value,
      distinguishingFeature: randomFrom(DISTINGUISHING_FEATURES).value,
      mount: Math.random() > 0.7 ? randomFrom(MOUNTS.filter(m => m.value !== 'none')).value : 'none',
      background: randomFrom(BACKGROUNDS).value,
      vibe: randomFrom(VIBES).value,
      equipment: EQUIPMENT[randomClass]?.[Math.floor(Math.random() * (EQUIPMENT[randomClass]?.length|| 1))]?.id|| 'bronze_sword',
      attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      ancestryFreeBoosts,
      ancestryFlaw,
      bgFixedChoice,
      bgFreeBoost,
      classKeyChoice,
      freeBoosts
    });

    // Generate name after state update
    setTimeout(() => {
      generateRandomName();
      generateRandomHeight();
    }, 50);
  };

  // === HANDLERS ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lineage') {
      setFormData(prev => ({ ...prev, [name]: value, ancestryFreeBoosts: [], ancestryFlaw: '' }));
    } else if (name === 'charClass') {
      setFormData(prev => ({
        ...prev,
        charClass: value,
        // Reset equipment to first option of new class
        equipment: EQUIPMENT[value]?.[0]?.id|| 'bronze_sword',
        classKeyChoice: ''
      }));
    } else if (name === 'gameBackground') {
      setFormData({ ...formData, [name]: value, bgFixedChoice: '', bgFreeBoost: '' });
    }
    // All other fields
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAttrChange = (attr, value) => {
    const validatedValue = validateAttribute(value, 3, 20);
    setFormData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: validatedValue }
    }));
  };

  // === PF2e BOOST SYSTEM ===
  const STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  // Apply a single boost to a score: +2 (or +1 if 18+)
  const applyBoost = (scores, stat) => {
    if (!stat|| !scores[stat] === undefined) return;
    scores[stat] = scores[stat] >= 18 ? scores[stat] + 1 : scores[stat] + 2;
  };

  // Compute final attributes from all boost sources
  const computeAttributes = (data) => {
    const scores = { ...data.attributes }; // Start with base 10s
    const raceData = RACES[data.lineage];
    const classData = CLASSES.find(c => c.value === data.charClass)|| CLASSES[0];
    const bgData = GAME_BACKGROUNDS.find(b => b.value === data.gameBackground);

    // 1. Ancestry fixed boosts
    (raceData.abilityBoosts || []).forEach(boost => {
      if (boost !== 'Free') applyBoost(scores, boost);
    });
    // 2. Ancestry free boosts
    (data.ancestryFreeBoosts || []).forEach(boost => applyBoost(scores, boost));
    // 3. Ancestry flaw
    if (data.ancestryFlaw) {
      scores[data.ancestryFlaw] = (scores[data.ancestryFlaw]|| 10) - 2;
    }
    // 4. Background fixed boost
    if (bgData) {
      const bgBoostStr = bgData.boost;
      if (bgBoostStr.includes(' or ')) {
        // Player chose one
        if (data.bgFixedChoice) applyBoost(scores, data.bgFixedChoice);
      } else {
        applyBoost(scores, bgBoostStr);
      }
    }
    // 5. Background free boost
    if (data.bgFreeBoost) applyBoost(scores, data.bgFreeBoost);
    // 6. Class key ability boost
    const keyAbility = classData.keyAbility;
    if (keyAbility.includes(' or ')) {
      if (data.classKeyChoice) applyBoost(scores, data.classKeyChoice);
    } else {
      applyBoost(scores, keyAbility);
    }
    // 7. 4 Free boosts
    (data.freeBoosts || []).forEach(boost => applyBoost(scores, boost));

    return scores;
  };

const buildImagePrompt = () => {
  const raceData = RACES[formData.lineage];
  const customDesc = formData.customVisuals.trim();
  const isFemale = formData.sex === 'Female';
  const raceKey = formData.lineage.toLowerCase();

  // === STEP 1: Precise, culturally grounded phenotype (no vagueness) ===
  let phenotype;
  let hairTexture = "thick, wavy";

  if (raceKey === 'sethite') {
    phenotype = isFemale
      ? "noble woman of Seth's line, warm olive to tan skin, high cheekbones, dark brown or hazel almond-shaped eyes, refined but strong Semitic features, serene expression, ancient Near Eastern priestly bearing"
      : "noble man of Seth's line, warm olive to tan skin, strong jawline, high cheekbones, dark brown or hazel eyes, well-groomed black hair, dignified and righteous countenance, ancient Near Eastern Semitic ancestry";
  } else if (raceKey === 'cainite') {
    phenotype = isFemale
      ? "urban woman of Cain's line, tan to warm bronze skin, intelligent gaze, practical earth-toned robes, calloused hands, sharp features, Bronze Age Levantine city-dweller"
      : "robust man of Cain's line, tan to warm bronze skin, observant eyes, sturdy build, practical leather-and-linen attire, skilled artisan or builder";
  } else if (raceKey === 'rephaim') {
    phenotype = isFemale
      ? "tall gaunt woman, deep brown skin, hollow cheekbones, solemn eyes, draped in layered linen and bronze, ancient Near Eastern underworld presence"
      : "tall gaunt man, deep brown skin, elongated face, solemn dignity, bronze adornments, spectral but human--no fantasy elements";
  } else if (raceKey === 'anakim' || raceKey === 'gibborim' || raceKey === 'elioud') {
    phenotype = isFemale
      ? "imposing yet noble giantess, rich deep brown skin, regal posture, calm authority, proportional heroic anatomy, no deformities"
      : "mighty giant warrior, rich deep brown skin, powerful frame, stoic nobility, proportional heroic anatomy, no exaggeration or distortion";
  } else {
    // fallback (Horim, Wanderer, etc.)
    phenotype = isFemale
      ? "righteous woman of ancient times, warm olive skin, kind eyes, modest but dignified appearance, biblical-era Semitic features"
      : "righteous man of ancient times, warm olive skin, strong features, wise expression, biblical-era Semitic features";
  }

  // === STEP 2: Skin, eyes, hair -- use full descriptive phrases (no single-word ambiguity) ===
  const skinDesc = SKIN_MAP[formData.skinTone.toLowerCase()] || 'warm olive skin';
  const eyeDesc = formData.eyeColor ? `${formData.eyeColor} eyes` : 'dark brown eyes';
  const hairLengthDesc = formData.hairLength?.trim() || 'shoulder length';
  const hairColorDesc = formData.hairColor?.trim() || 'black';
  const hairFull = `${hairLengthDesc} ${hairColorDesc} ${hairTexture} hair`;

  // === STEP 3: Body & distinguishing feature ===
  const bodyBuild = formData.bodyBuild === 'random'
    ? ['lean', 'athletic', 'stocky'][Math.floor(Math.random() * 3)]
    : formData.bodyBuild;
  const featureDesc = formData.distinguishingFeature !== 'none'
    ? formData.distinguishingFeature.replace(/^[a-z]/, c => c.toUpperCase())
    : '';

  // === STEP 4: Class & gear -- use your existing mappings ===
  const classVisual = CLASS_VISUALS[formData.charClass] || raceData.visuals;
  const selectedWeapon = EQUIPMENT[formData.charClass]?.find(w => w.id === formData.equipment);
  const weaponDesc = selectedWeapon
    ? (WEAPON_VISUALS[selectedWeapon.id] || selectedWeapon.name.replace('Bronze ', 'bronze '))
    : '';

  // === STEP 5: Setting & vibe ===
  const bgDesc = formData.background || 'ancient holy land';
  const vibeDesc = formData.vibe || 'biblical epic';

  // === CORE PROMPT -- ordered by importance, strict, non-redundant ===
  const coreParts = [
    // Quality & style (avoid cartoon/3D/photo)
    "masterpiece, best quality, ultra-detailed illustration, biblical fantasy art, soft divine lighting, historical realism, oil painting texture",

    // Subject + ethnicity (critical anchor)
    phenotype,

    // Physical specifics (explicit, anatomically safe)
    `${skinDesc}, ${eyeDesc}, ${hairFull}`,
    `${bodyBuild} build, proportional realistic anatomy, no distortions, no extra limbs, no fused fingers`,

    // Attire & role
    `wearing ${classVisual}`,
    weaponDesc ? `carrying ${weaponDesc}` : '',

    // Setting & lore
    `${formData.charClass}, ${bgDesc}, ${vibeDesc} atmosphere`,
    "ancient stone architecture, desert landscape, Levantine hill country, no modern elements"
  ];

  // Optional additions
  if (featureDesc) coreParts.push(featureDesc);
  if (formData.mount !== 'none') coreParts.push(`riding ${formData.mount}`);
  if (customDesc) coreParts.push(customDesc);

  // === NEGATIVE PROMPT -- tightened for fidelity & safety ===
  const negativePrompt = [
    'European features, Nordic features, Viking, pale skin, fair hair, blue eyes, blonde eyebrows',
    'deformed, distorted face, extra arms, extra fingers, mutated, disfigured, blurry, bad anatomy',
    'photograph, photo, photorealistic, 3d render, cartoon, anime, sketch, drawing',
    'watermark, signature, text, logo, border, frame',
    'fantasy clichés: pointed ears, horns, wings, tattoos (unless specified), glowing eyes',
    'modern clothing, glasses, watches, contemporary items',
    'excessive violence, blood, gore, nudity, sensual pose'
  ].join(', ');

  // === ASSEMBLE & SAFELY TRUNCATE (preserve key parts) ===
  let prompt = coreParts.filter(Boolean).join(', ');
  prompt = prompt.replace(/\s+/g, ' ').trim();

  const MAX_LENGTH = 950;
  if (prompt.length > MAX_LENGTH) {
    const essential = [coreParts[0], coreParts[1], coreParts[2], coreParts[3], coreParts[4]];
    let truncated = essential.join(', ');
    if (truncated.length > MAX_LENGTH) {
      truncated = truncated.slice(0, MAX_LENGTH);
    }
    prompt = truncated;
  }

  return { prompt, negativePrompt };
};
  // === GENERATE IMAGE ===
  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const { prompt: fullPrompt, negativePrompt } = buildImagePrompt();
      console.log('Generating image with prompt:', fullPrompt);
      console.log('Negative prompt:', negativePrompt);
      const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, negative_prompt: negativePrompt, model: formData.imageModel })
      });
      const data = await response.json();
      console.log('API Response:', data);
      if (!response.ok) {
        const errorMsg = data.message|| data.details|| data.error|| "Generation failed";
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
    if (!formData.name|| !portrait) {
      setError("Name and Portrait are required.");
      return;
    }

    const finalStats = computeAttributes(formData);
    const level = formData.level;

    // Calculate derived stats (PF2e: Ancestry HP + Class HP per level + CON mod per level)
    const loreData = RACES[formData.lineage];
    const classData = CLASSES.find(c => c.value === formData.charClass)|| CLASSES[0];
    const conMod = Math.floor((finalStats.CON - 10) / 2);

    const proficiency = 2 + Math.floor((level - 1) / 2); // PF2e proficiency scales with level
    const maxHp = loreData.ancestryHP + (classData.classHP + conMod) * level;
    const dexMod = Math.floor((finalStats.DEX - 10) / 2);
    const defense = 10 + dexMod; // Base AC (armor adds more in PF2e)

    // Get selected equipment from class list
    const classEquipment = EQUIPMENT[formData.charClass]|| EQUIPMENT.Warrior;
    const selectedEquipment = classEquipment.find(e => e.id === formData.equipment)|| classEquipment[0];
    // Calculate attack bonus
    const strMod = Math.floor((finalStats.STR - 10) / 2);
    const attackMod = formData.charClass === 'Warrior' && ['STR', 'DEX'].includes(selectedEquipment.useStat) ? Math.max(strMod, dexMod) : (selectedEquipment.useStat === 'STR' ? strMod : dexMod);
    const damageMod = selectedEquipment.useStat === 'STR' ? strMod : 0; // For melee weapons

    const mainAction = {
      name: selectedEquipment.name,
      type: selectedEquipment.type,
      cost: 1,
      toHitBonus: proficiency + attackMod,
      damageDice: selectedEquipment.damageDice,
      damageBonus: damageMod,
      damageType: selectedEquipment.damageType
    };

    const character = {
      id: 'p1',
      name: formData.name,
      isPlayer: true,
      portrait: portrait,
      lineage: formData.lineage,
      class: formData.charClass,
      level: level,
      gameBackground: bgData ? bgData.label : 'None',
      size: loreData.size,
      speed: loreData.speed,
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
      ancestryHP: loreData.ancestryHP,
      classHP: classData.classHP,
      keyAbility: classData.keyAbility,
      actions: [mainAction]
    };

    setFinalCharacter(character);
    setShowSheet(true);
  };

  // === SAVE & CONTINUE ===
  const handleSave = () => {
    if (finalCharacter) {
      const success = setCharacterData(finalCharacter);
      // Also add to party roster
      addToPartyRoster(finalCharacter);
      if (success && onCharacterComplete) {
        onCharacterComplete();
      } else if (!success) {
        setError('Failed to save character data. Please try again.');
      }
    }
  };

  // === SAVE TO ROSTER ONLY ===
  const handleSaveToRoster = () => {
    if (finalCharacter) {
      const success = addToPartyRoster(finalCharacter);
      if (success) {
        alert(`${finalCharacter.name} has been saved to your party roster!`);
        handleReset(); // Reset to create another character
      } else {
        setError('Failed to save character to roster. Please try again.');
      }
    }
  };

  // === RESET TO CREATE NEW CHARACTER ===
  const handleReset = () => {
    setFormData({
      name: '',
      lineage: 'Sethite',
      charClass: 'Warrior',
      level: 1,
      gameBackground: 'watchers_apprentice',
      sex: 'Male',
      height: '',
      skinTone: 'olive',
      eyeColor: 'dark brown',
      hairColor: 'black',
      hairLength: 'shoulder length',
      bodyBuild: 'athletic',
      distinguishingFeature: 'none',
      mount: 'none',
      background: 'ancient stone city',
      vibe: 'biblical epic',
      customVisuals: '',
      imageModel: 'flux-schnell',
      equipment: 'bronze_sword',
      attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      ancestryFreeBoosts: [],
      ancestryFlaw: '',
      bgFixedChoice: '',
      bgFreeBoost: '',
      classKeyChoice: '',
      freeBoosts: []
    });
    setPortrait(null);
    setError('');
    setShowSheet(false);
    setFinalCharacter(null);
    generateRandomName();
    generateRandomHeight();
  };

  // Computed attributes (reactive)
  const computedAttrs = computeAttributes(formData);

  // --- RENDER ---

  if (showSheet && finalCharacter) {
    return (
      <div className="bg-[#1a1a25] p-6 rounded border border-[#44403c] max-w-4xl mx-auto">
        <h2 className="text-2xl font-cinzel text-[#f59e0b] mb-4">Character Sheet: {finalCharacter.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Portrait */}
          <div className="border-2 border-[#44403c] rounded overflow-hidden self-start">
            <img src={finalCharacter.portrait} alt={finalCharacter.name} className="w-full h-auto max-h-[600px] object-cover object-top" />
          </div>
          {/* Stats Column */}
          <div className="space-y-6">
            {/* Physical Appearance */}
            <div>
              <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">APPEARANCE</h3>
              <div><span className="text-[#78716c]">Lineage:</span> <span className="text-[#d6d3d1]">{finalCharacter.lineage}</span></div>
              <div><span className="text-[#78716c]">Gender:</span> <span className="text-[#d6d3d1]">{finalCharacter.sex}</span></div>
              <div><span className="text-[#78716c]">Height:</span> <span className="text-[#d6d3d1]">{finalCharacter.height}</span></div>
              <div><span className="text-[#78716c]">Skin:</span> <span className="text-[#d6d3d1] capitalize">{finalCharacter.skinTone}</span></div>
              <div><span className="text-[#78716c]">Eyes:</span> <span className="text-[#d6d3d1] capitalize">{finalCharacter.eyeColor}</span></div>
              <div><span className="text-[#78716c]">Hair:</span> <span className="text-[#d6d3d1] capitalize">{finalCharacter.hairLength} {finalCharacter.hairColor}</span></div>
              {finalCharacter.distinguishingFeature !== 'none' && (
                <div><span className="text-[#78716c]">Feature:</span> <span className="text-[#fcd34d] capitalize">{finalCharacter.distinguishingFeature}</span></div>
              )}
              <div><span className="text-[#78716c]">Accessory:</span> <span className="text-[#a8a29e] italic">{finalCharacter.accessory}</span></div>
            </div>

            {/* Attributes */}
            <div>
              <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">ATTRIBUTES</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(finalCharacter.attributes).map(([stat, value]) => (
                  <div key={stat} className="bg-[#0c0a09] border border-[#44403c] p-2 text-center">
                    <div className="text-[#f59e0b] font-bold text-sm">{stat}</div>
                    <div className="text-white font-serif">{value}</div>
                    <div className="text-[#a8a29e] text-xs">({Math.floor((value - 10) / 2) >= 0 ? '+' : ''}{Math.floor((value - 10) / 2)})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Derived Stats */}
            <div>
              <h3 className="text-[#f59e0b] font-bold text-lg mb-3 border-b border-[#44403c] pb-1">COMBAT</h3>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-[#78716c]">HP:</span> <span className="text-white">{finalCharacter.hp}/{finalCharacter.maxHp}</span></div>
                <div><span className="text-[#78716c]">AC:</span> <span className="text-white">{finalCharacter.defense}</span></div>
                <div><span className="text-[#78716c]">Initiative:</span> <span className="text-white">{finalCharacter.initiativeBonus >= 0 ? '+' : ''}{finalCharacter.initiativeBonus}</span></div>
                <div><span className="text-[#78716c]">Class:</span> <span className="text-white">{finalCharacter.class}</span></div>
              </div>
              <div className="mt-2">
                <h4 className="text-[#f59e0b] text-sm">Main Action</h4>
                <div className="text-sm text-[#d6d3d1]">{finalCharacter.actions[0].name} - {finalCharacter.actions[0].toHitBonus >= 0 ? '+' : ''}{finalCharacter.actions[0].toHitBonus} to hit, {finalCharacter.actions[0].damageDice}+{finalCharacter.actions[0].damageBonus} {finalCharacter.actions[0].damageType}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={handleSave} className="px-4 py-2 bg-[#78350f] text-white border border-[#f59e0b] hover:bg-[#92400e]">Save & Continue</button>
          <button onClick={handleSaveToRoster} className="px-4 py-2 bg-[#1a1a25] text-white border border-[#44403c] hover:bg-[#2a2a35]">Save to Roster Only</button>
          <button onClick={handleReset} className="px-4 py-2 bg-[#292524] text-[#a8a29e] border border-[#44403c] hover:bg-[#3a3534]">Create New Character</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a25] p-6 rounded border border-[#44403c] max-w-4xl mx-auto">
      <h2 className="text-2xl font-cinzel text-[#f59e0b] mb-4">Character Generator</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black border border-[#44403c] p-2 text-white outline-none focus:border-[#f59e0b]"
            placeholder="Enter character name..."
          />
        </div>
        <div>
          <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Gender</label>
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Race & Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Lineage</label>
          <select
            name="lineage"
            value={formData.lineage}
            onChange={handleChange}
            className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
          >
            {Object.entries(RACES).map(([key, data]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <div className="bg-[#292524] p-3 border-l-2 border-[#f59e0b] text-xs mt-1">
            <p className="text-[#d6d3d1] mb-1">{RACES[formData.lineage].desc}</p>
            <p className="text-[#fcd34d] font-bold">
              Boosts: {RACES[formData.lineage].abilityBoosts.join(', ')}
              {RACES[formData.lineage].abilityFlaw && RACES[formData.lineage].abilityFlaw !== "Free" && (
                <span className="text-red-400"> | Flaw: {RACES[formData.lineage].abilityFlaw}</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Class</label>
          <select
            name="charClass"
            value={formData.charClass}
            onChange={(e) => {
              const newClass = e.target.value;
              setFormData(prev => ({
                ...prev,
                charClass: newClass,
                // Reset equipment to first option of new class
                equipment: EQUIPMENT[newClass]?.[0]?.id|| 'bronze_sword'
              }));
            }}
            className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
          >
            {CLASSES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Background */}
      <div className="mb-6">
        <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Background</label>
        <select
          name="gameBackground"
          value={formData.gameBackground}
          onChange={handleChange}
          className="w-full bg-black border border-[#44403c] p-2 text-white outline-none"
        >
          {GAME_BACKGROUNDS.map(bg => (
            <option key={bg.value} value={bg.value}>{bg.label}</option>
          ))}
        </select>
      </div>

      {/* PF2e Ability Boost System */}
      <div className="border-t border-[#44403c] pt-6 mb-6">
        <h3 className="text-lg font-cinzel text-[#f59e0b] mb-3">Ability Score Allocation (PF2e)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STATS.map(stat => (
            <div key={stat} className="bg-[#0c0a09] border border-[#44403c] p-2">
              <div className="text-[#f59e0b] font-bold text-sm">{stat}</div>
              <input
                type="number"
                min="3"
                max="20"
                value={computedAttrs[stat]}
                onChange={(e) => handleAttrChange(stat, parseInt(e.target.value) || 10)}
                className="w-full bg-black border border-[#44403c] p-1 text-white text-center mt-1"
              />
              <div className="text-[#a8a29e] text-xs mt-1">Mod: {Math.floor((computedAttrs[stat] - 10) / 2) >= 0 ? '+' : ''}{Math.floor((computedAttrs[stat] - 10) / 2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Settings */}
      <div className="border-t border-[#44403c] pt-6 mb-6">
        <label className="block text-lg font-cinzel text-[#f59e0b] uppercase tracking-widest mb-2">Visual Settings</label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">SKIN TONE</label>
            <select
              name="skinTone"
              value={formData.skinTone}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {SKIN_TONES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">EYE COLOR</label>
            <select
              name="eyeColor"
              value={formData.eyeColor}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {EYE_COLORS.map(ec => (
                <option key={ec.value} value={ec.value}>{ec.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">HAIR COLOR</label>
            <select
              name="hairColor"
              value={formData.hairColor}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {HAIR_COLORS.map(hc => (
                <option key={hc.value} value={hc.value}>{hc.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">HAIR LENGTH</label>
            <select
              name="hairLength"
              value={formData.hairLength}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {HAIR_LENGTHS.map(hl => (
                <option key={hl.value} value={hl.value}>{hl.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">BODY TYPE</label>
            <select
              name="bodyBuild"
              value={formData.bodyBuild}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {BODY_BUILDS.map(bb => (
                <option key={bb.value} value={bb.value}>{bb.label}</option>
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
              {DISTINGUISHING_FEATURES.map(df => (
                <option key={df.value} value={df.value}>{df.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">MOUNT / COMPANION</label>
            <select
              name="mount"
              value={formData.mount}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {MOUNTS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#78716c] text-[10px] font-bold mb-1">EQUIPMENT</label>
            <select
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
            >
              {EQUIPMENT[formData.charClass]?.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              )) || <option>No Equipment Available</option>}
            </select>
          </div>
        </div>
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
        <div className="mb-3">
          <label className="block text-[#78716c] text-[10px] font-bold mb-1">CUSTOM DETAILS</label>
          <textarea
            name="customVisuals"
            value={formData.customVisuals}
            onChange={handleChange}
            placeholder="Add specific details (e.g., 'scarred face, carrying ancient tablet, glowing staff')..."
            maxLength={500}
            className="w-full bg-black border border-[#44403c] p-2 text-sm text-white h-16 resize-none focus:border-[#f59e0b] outline-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={summonRandomLegend}
          disabled={loading}
          className="w-full py-3 font-cinzel font-bold text-base uppercase tracking-widest transition-all border border-[#44403c] bg-[#1a1a25] hover:bg-[#2a2a35] hover:border-[#78716c] text-[#a8a29e] mb-3"
        >
          Summon Random Legend
        </button>
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

      {/* Portrait Preview */}
      {portrait && (
        <div className="mt-6 border border-[#44403c] rounded overflow-hidden">
          <img src={portrait} alt="Generated Character" className="w-full h-auto max-h-[500px] object-contain bg-black" />
        </div>
      )}

      {/* Create Character Button */}
      {portrait && (
        <button
          onClick={handleCreateCharacter}
          className="w-full mt-4 py-3 font-cinzel font-bold text-lg uppercase tracking-widest bg-[#0c0a09] border border-[#78716c] hover:bg-[#1a1a25] text-[#d6d3d1] transition-all"
        >
          Create Character
        </button>
      )}
    </div>
  );
}