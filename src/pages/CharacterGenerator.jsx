import React, { useState, useEffect } from 'react';
import { validateCharacterName, validateAttribute, validateDescription } from '../utils/validation';
import { setCharacterData, addToPartyRoster } from '../utils/storage';

const CharacterGenerator = ({ onCharacterComplete }) => {
  // === COMPREHENSIVE ANCESTRY DATA (PF2e-Compliant per Manual) ===
  const RACES = {
    Sethite: {
      name: "Sethite (Righteous Line)",
      desc: "Descendants of Seth. Keepers of the original faith and pre-fall history.",
      abilityBoosts: ["Free", "Free"], // Two free boosts
      abilityFlaw: "Free", // One free flaw (optional)
      ancestryHP: 8,
      size: "Medium",
      speed: 25,
      traits: ["Blessed Heritage (+1 Religion)", "Divine Favor (Detect Evil 1/day)", "Low-Light Vision"],
      startingRP: 2,
      startingCP: 0,
      heightRange: { male: [65, 72], female: [60, 67] },
      accessory: "prayer shawl, scroll case, or holy phylactery",
      visuals: "simple robes of wool and linen, prayer shawl, holding scroll or staff"
    },
    Cainite: {
      name: "Cainite (City Builder)",
      desc: "Descendants of the first murderer. Masters of metallurgy, music, and urbanization.",
      abilityBoosts: ["Free", "Free"], // Two free boosts
      abilityFlaw: "Free", // One free flaw (optional)
      ancestryHP: 8,
      size: "Medium",
      speed: 25,
      traits: ["City Born (+1 Urban Recall Knowledge)", "Mark of Cain (Protection)", "Builder's Heritage"],
      startingRP: 0,
      startingCP: 1,
      heightRange: { male: [66, 73], female: [61, 68] },
      accessory: "bronze jewelry, musical instrument (lyre/flute), or artisan's hammer",
      visuals: "elaborate dyed fabrics, bronze ornaments, gold and brass jewelry, practical stylish clothing"
    },
    Wanderer: {
      name: "Wanderer (Nomad)",
      desc: "Those who rejected both the cities of Cain and the strictures of Seth.",
      abilityBoosts: ["Free", "Free"], // Two free boosts
      abilityFlaw: "Free", // One free flaw (optional)
      ancestryHP: 10,
      size: "Medium",
      speed: 30,
      traits: ["Survivalist (+1 Subsist/Survival)", "Swift Footed (30ft base Speed)"],
      startingRP: 0,
      startingCP: 0,
      heightRange: { male: [64, 71], female: [59, 66] },
      accessory: "tribal totems, bone necklace, or hunting fetish",
      visuals: "practical leather and fur clothing, tribal bead and feather decorations, animal hide garments"
    },
    Nephilim: {
      name: "Nephilim (1st Gen Giant)",
      desc: "Direct offspring of Watchers and Humans. Titans of the ancient world.",
      abilityBoosts: ["STR", "CON", "Free"], // STR, CON, one free
      abilityFlaw: "DEX",
      ancestryHP: 12,
      size: "Large",
      speed: 25,
      traits: ["Angelic Resistance (Radiant 5)", "Insatiable Hunger", "Powerful Build", "Large Size (10ft reach)"],
      startingRP: 0,
      startingCP: 3,
      heightRange: { male: [144, 180], female: [132, 168] },
      accessory: "massive bronze armor plates, giant's chain, or trophy skulls",
      visuals: "massive bronze armor plates, heavy bronze weaponry, clothing and equipment scaled to immense size"
    },
    Rephaim: {
      name: "Rephaim (Shade/Giant)",
      desc: "Later generations of giants, often associated with the dead and the underworld.",
      abilityBoosts: ["STR", "CON", "Free"], // STR, CON, one free
      abilityFlaw: "CHA",
      ancestryHP: 10,
      size: "Large",
      speed: 25,
      traits: ["Spirit Sight (See Invisibility)", "Deathly Aura (-1 fear saves 10ft)", "Intimidating Presence (+1 Intimidation)"],
      startingRP: 0,
      startingCP: 2,
      heightRange: { male: [108, 132], female: [102, 126] },
      accessory: "death shroud, spirit talisman, or ancient burial mask",
      visuals: "dark clothing and armor, bones and skulls and death motifs incorporated into appearance"
    },
    Anakim: {
      name: "Anakim (Noble Giant)",
      desc: "The 'Long-Necked Ones'. Noble giants known for chain weapons and regal bearing.",
      abilityBoosts: ["STR", "CHA", "Free"], // STR, CHA, one free
      abilityFlaw: "DEX",
      ancestryHP: 12,
      size: "Large",
      speed: 25,
      traits: ["Chain Master (15ft grapple reach)", "Noble Bearing (+1 Diplomacy vs giants)", "Long-Necked (+1 Perception)"],
      startingRP: 0,
      startingCP: 2,
      heightRange: { male: [120, 156], female: [114, 144] },
      accessory: "heavy gold chains (neck/wrist), royal signet, or ceremonial shackles",
      visuals: "massive bronze chain links across shoulders and chest, bronze rings woven in braided hair, regal noble attire"
    },
    Gibborim: {
      name: "Gibborim (Mighty One)",
      desc: "Human-Giant hybrids. The 'Mighty Ones of Old' - heroic warriors of renown.",
      abilityBoosts: ["STR", "CON", "Free"], // STR, CON, one free
      abilityFlaw: null, // None
      ancestryHP: 10,
      size: "Medium",
      speed: 25,
      traits: ["Powerful Build (counts as Large for carry/push)", "Martial Training (+1 Athletics)", "Heroic Blood (+1 vs fear)"],
      startingRP: 0,
      startingCP: 1,
      heightRange: { male: [78, 96], female: [72, 90] },
      accessory: "lion pelt cloak, hero's bronze bracers, or trophy weapon",
      visuals: "practical well-made armor, lion pelt cloak, bronze rings and beads of victory in hair"
    },
    Horim: {
      name: "Horim (Cave Dweller)",
      desc: "Giant-kin adapted to underground life. Masters of stone and darkness.",
      abilityBoosts: ["DEX", "WIS", "Free"], // DEX, WIS, one free
      abilityFlaw: "CHA",
      ancestryHP: 8,
      size: "Medium",
      speed: 25,
      traits: ["Superior Darkvision (120ft)", "Stone Cunning (+1 stonework/geology)", "Sunlight Sensitivity (dazzled in sunlight)"],
      startingRP: 0,
      startingCP: 1,
      heightRange: { male: [72, 82], female: [65, 77] },
      accessory: "stone carving tools, luminescent fungi, or cave crystals",
      visuals: "simple leather and fur garments, stone and crystal and bronze ornaments, cave-dweller clothing"
    },
    Elioud: {
      name: "Elioud (Third-Gen Giant-Kin)",
      desc: "Third-generation giant descendants who can pass as large humans. Bridge between worlds.",
      abilityBoosts: ["STR", "Free"], // STR, one free
      abilityFlaw: null, // None
      ancestryHP: 8,
      size: "Medium",
      speed: 25,
      traits: ["Diluted Blood (pass as human DC 15)", "Ancestral Echo (1/day +2 STR checks 1 min)", "Mighty Heritage (+1 Grapple/Shove/Trip)"],
      startingRP: 0,
      startingCP: 1,
      heightRange: { male: [74, 84], female: [70, 80] },
      accessory: "ancestral amulet, oversized bronze bracers, or giant-blood tattoos",
      visuals: "practical clothing that blends into human society, bronze-age leather armor with fine craftsmanship"
    },
    Sorcerer: {
      name: "Sorcerer Clan (Watcher-Taught)",
      desc: "Humans initiated into Watcher mysteries like root-cutting and astrology.",
      abilityBoosts: ["Free", "Free"], // Two free boosts
      abilityFlaw: "Free", // One free flaw (optional)
      ancestryHP: 6,
      size: "Medium",
      speed: 25,
      traits: ["Dark Insight (Detect Magic 1/day)", "Watcher's Mark", "Forbidden Knowledge"],
      startingRP: 0,
      startingCP: 2,
      heightRange: { male: [65, 72], female: [60, 67] },
      accessory: "star charts, ritual dagger, dried herbs pouch, or crystal focus",
      visuals: "robes concealing mystical marks, star charts and dried herbs, crystal focus, Watchers Mark brand on skin"
    }
  };

  // === PHYSICAL APPEARANCE OPTIONS ===
  const SKIN_TONES = [
    { value: "olive", label: "Olive (Semitic)" },
    { value: "bronze", label: "Bronze (Sun-Kissed)" },
    { value: "copper", label: "Copper (Reddish)" },
    { value: "tan", label: "Tan (Levantine)" },
    { value: "light brown", label: "Light Brown (Mesopotamian)" },
    { value: "dark brown", label: "Dark Brown (Nubian)" },
    { value: "alabaster", label: "Alabaster (Translucent White)" },
    { value: "obsidian", label: "Obsidian (Deep Black/Purple)" },
    { value: "red clay", label: "Red Clay (Adamah)" },
    { value: "ashen grey", label: "Ash Grey (Deathly)" },
    { value: "copper patina", label: "Copper Patina (Oxidized)" },
    { value: "marble", label: "Marble (Veined Stone)" },
    { value: "gold-dust", label: "Gold-Dust (Shimmering)" },
    { value: "pale", label: "Pale (Cave Dweller/Northern)" },
    { value: "unnaturally pale", label: "Unnaturally Pale (Nephilim)" }
  ];

  const EYE_COLORS = [
    { value: "dark brown", label: "Dark Brown" },
    { value: "brown", label: "Brown" },
    { value: "amber", label: "Amber" },
    { value: "hazel", label: "Hazel" },
    { value: "green", label: "Green (Rare)" },
    { value: "grey", label: "Grey" },
    { value: "molten gold", label: "Molten Gold (Glowing)" },
    { value: "void black", label: "Void Black (No Sclera)" },
    { value: "nebula violet", label: "Nebula Violet (Swirling)" },
    { value: "blind white", label: "Blind White (Seer)" },
    { value: "burning ember", label: "Burning Ember (Internal Light)" },
    { value: "quicksilver", label: "Quicksilver (Liquid Metal)" },
    { value: "glowing amber", label: "Glowing Amber (Nephilim)" },
    { value: "glowing blue", label: "Glowing Blue (Watcher Blood)" },
    { value: "black voids", label: "Black Voids (Corrupted)" }
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
    { value: "battle scar across face", label: "Facial Scar" },
    { value: "tribal tattoos", label: "Tribal Tattoos" },
    { value: "gold piercings", label: "Gold Piercings" },
    { value: "blind eye", label: "Blind Eye" },
    { value: "glowing runes", label: "Glowing Runes" },
    { value: "six fingers on each hand", label: "Polydactyly (Six Fingers)" },
    { value: "luminous glowing veins", label: "Luminous Veins" },
    { value: "vestigial wing stubs", label: "Vestigial Wings" },
    { value: "small obsidian horns", label: "Obsidian Horns" },
    { value: "patches of scales", label: "Scale Patches" },
    { value: "heterochromia mismatched eyes", label: "Heterochromia (Mismatched Eyes)" },
    { value: "ritual scarification", label: "Ritual Scarification" },
    { value: "faint halo of light", label: "Halo of Faint Light" },
    { value: "living tattoos with moving ink", label: "Living Tattoos (Moving Ink)" },
    { value: "ornate bronze mask", label: "Bronze Mask" },
    { value: "burn scars", label: "Burn Scars" },
    { value: "branded mark", label: "Branded Mark" },
    { value: "prophet's long beard", label: "Long Prophet's Beard" },
    { value: "missing hand or arm", label: "Missing Hand/Arm" }
  ];

  const MOUNTS = [
    { value: "none", label: "None" },
    { value: "sitting astride a massive long-necked sauropod dinosaur with thick grey hide and a wooden howdah saddle on its back", label: "Behemoth (Sauropod)" },
    { value: "mounted on a huge armored war elephant with bronze plate barding and tusks wrapped in leather", label: "War Elephant" },
    { value: "riding a giant maned lion the size of a horse with golden fur and fierce amber eyes", label: "Dire Lion" },
    { value: "standing beside a massive coiled sea serpent with dark green scales and glowing yellow eyes rising from water", label: "Leviathan Spawn (Serpent)" },
    { value: "mounted on a muscular winged bull with eagle wings and bronze hooves flying above the ground", label: "Cherubim Steed (Winged Bull)" },
    { value: "accompanied by a large scaly monitor-lizard-like drake companion with thick armored hide and a spiked tail standing at waist height", label: "Hunting Drake (Companion)" }
  ];

  // === NAME DATABASES (Expanded) ===
  const NAMES = {
    Male: {
      Sethite: ["Enosh", "Kenan", "Mahalalel", "Jared", "Methuselah", "Lamech", "Noah", "Seth", "Shem", "Ham", "Japheth", "Adam", "Abel", "Enoch the Righteous"],
      Cainite: ["Enoch", "Irad", "Mehujael", "Methusael", "Lamech", "Jabal", "Jubal", "Tubal-Cain", "Nimrod", "Ashur", "Cush"],
      Wanderer: ["Zorah", "Nahor", "Terah", "Eber", "Peleg", "Reu", "Serug", "Shelah", "Arpachshad"],
      Giant: ["Og", "Sihon", "Ahiman", "Sheshai", "Talmai", "Arba", "Goliath", "Lahmi", "Anak", "Gilgamesh", "Enkidu", "Ohya", "Mahway", "Hahyah"],
      Sorcerer: ["Azazel-Kin", "Baraqel", "Kokabiel", "Penemue", "Sariel", "Armaros", "Gadreel"]
    },
    Female: {
      Sethite: ["Naamah", "Azura", "Awan", "Dina", "Norea", "Emzara", "Sedeqetelebab", "Baraka"],
      Cainite: ["Adah", "Zillah", "Naamah", "Elisheba", "Basemath", "Mahalath"],
      Wanderer: ["Sarai", "Milcah", "Iscah", "Reumah", "Keturah", "Hagar"],
      Giant: ["Noa", "Hoglah", "Tirzah", "Mahlah", "Ahinoam", "Rizpah"],
      Sorcerer: ["Ishtahar", "Lilith-Born", "Naamah the Enchantress", "Astarte", "Inanna"]
    }
  };

  // === CLASSES (PF2e-Compliant per Manual) ===
  const CLASSES = [
    { value: "Warrior", label: "Warrior (Tribal Fighter)", classHP: 10, keyAbility: "STR or DEX" },
    { value: "Gibbor", label: "Gibbor (Mighty Hero)", classHP: 12, keyAbility: "STR" },
    { value: "Hunter", label: "Hunter (Wilderness)", classHP: 8, keyAbility: "DEX" },
    { value: "Magi", label: "Magi (Watcher-Taught Sorcerer)", classHP: 6, keyAbility: "INT" },
    { value: "Priest", label: "Priest (Keeper of Rituals)", classHP: 8, keyAbility: "WIS" },
    { value: "Artisan", label: "Artisan (Smith/Builder)", classHP: 8, keyAbility: "INT or STR" },
    { value: "Scribe", label: "Scribe (Keeper of Tablets)", classHP: 6, keyAbility: "INT" }
  ];

  // === GAME BACKGROUNDS (from Manual Chapter 3) ===
  const GAME_BACKGROUNDS = [
    { value: "watchers_apprentice", label: "Watcher's Apprentice", boost: "INT", skill: "Arcana", lore: "Forbidden Lore" },
    { value: "tribal_elder", label: "Tribal Elder", boost: "WIS", skill: "Diplomacy", lore: "Tribal Lore" },
    { value: "bronze_smith", label: "Bronze Smith", boost: "INT or STR", skill: "Crafting", lore: "Metallurgy Lore" },
    { value: "temple_servant", label: "Temple Servant", boost: "WIS", skill: "Religion", lore: "Temple Lore" },
    { value: "giants_thrall", label: "Giant's Thrall", boost: "CON", skill: "Survival", lore: "Giant Lore" },
    { value: "wandering_prophet", label: "Wandering Prophet", boost: "WIS", skill: "Religion", lore: "Prophecy Lore" },
    { value: "merchant_of_enoch", label: "Merchant of Enoch", boost: "CHA", skill: "Diplomacy", lore: "Trade Lore" },
    { value: "beast_tamer", label: "Beast Tamer", boost: "WIS", skill: "Nature", lore: "Animal Lore" },
    { value: "star_reader", label: "Star Reader", boost: "INT", skill: "Occultism", lore: "Astrology Lore" },
    { value: "herb_cutter", label: "Herb Cutter", boost: "INT or WIS", skill: "Nature", lore: "Herbalism Lore" },
    { value: "flood_plains_survivor", label: "Survivor of the Flood Plains", boost: "CON", skill: "Survival", lore: "Weather Lore" },
    { value: "nephilim_offspring", label: "Nephilim Offspring", boost: "STR or CHA", skill: "Intimidation", lore: "Giant Heritage Lore" },
    { value: "keeper_of_scrolls", label: "Keeper of the Scrolls", boost: "INT", skill: "Society", lore: "Ancient History Lore" },
    { value: "hunter_of_abominations", label: "Hunter of Abominations", boost: "WIS", skill: "Survival", lore: "Monster Lore" },
    { value: "penitent_cultist", label: "Penitent Cultist", boost: "WIS", skill: "Occultism", lore: "Cult Lore" },
    { value: "desert_nomad", label: "Desert Nomad", boost: "CON", skill: "Survival", lore: "Desert Lore" },
    { value: "river_fisher", label: "River Fisher", boost: "WIS", skill: "Survival", lore: "Fishing Lore" },
    { value: "stone_mason", label: "Stone Mason", boost: "STR or INT", skill: "Crafting", lore: "Architecture Lore" },
    { value: "tribal_scout", label: "Tribal Scout", boost: "DEX", skill: "Stealth", lore: "Scouting Lore" },
    { value: "sacred_dancer", label: "Sacred Dancer", boost: "DEX or CHA", skill: "Performance", lore: "Dance Lore" }
  ];

  // === EQUIPMENT BY CLASS (D&D 5e Stats) ===
  const EQUIPMENT = {
    Warrior: [
      { id: 'bronze_sword', name: 'Bronze Longsword', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'slashing', desc: 'Versatile bronze blade (1d10 two-handed)' },
      { id: 'bronze_greatsword', name: 'Bronze Greatsword', type: 'melee', useStat: 'STR', damageDice: '2d6', damageType: 'slashing', desc: 'Massive two-handed weapon' },
      { id: 'bronze_battleaxe', name: 'Bronze Battle Axe', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'slashing', desc: 'Heavy war axe (1d10 two-handed)' },
      { id: 'spear_shield', name: 'Spear & Shield', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'piercing', desc: 'Versatile spear (1d8 two-handed), +2 AC from shield' },
      { id: 'war_hammer', name: 'Bronze War Hammer', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'bludgeoning', desc: 'Crushing weapon (1d10 two-handed)' },
      { id: 'flail', name: 'Bronze Flail', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'bludgeoning', desc: 'Chained weapon, ignores shields' }
    ],
    Gibbor: [
      { id: 'hero_blade', name: "Hero's Greatsword", type: 'melee', useStat: 'STR', damageDice: '2d6', damageType: 'slashing', desc: 'Legendary bronze blade of champions' },
      { id: 'maul', name: 'Giant Maul', type: 'melee', useStat: 'STR', damageDice: '2d6', damageType: 'bludgeoning', desc: 'Devastating two-handed crushing weapon' },
      { id: 'glaive', name: 'Bronze Glaive', type: 'melee', useStat: 'STR', damageDice: '1d10', damageType: 'slashing', desc: 'Polearm with reach (10ft)' },
      { id: 'greataxe', name: 'Bronze Greataxe', type: 'melee', useStat: 'STR', damageDice: '1d12', damageType: 'slashing', desc: 'Brutal two-handed axe' },
      { id: 'lance', name: 'Bronze Lance', type: 'melee', useStat: 'STR', damageDice: '1d12', damageType: 'piercing', desc: 'Mounted weapon with reach' }
    ],
    Hunter: [
      { id: 'longbow', name: 'Composite Longbow', type: 'ranged', useStat: 'DEX', damageDice: '1d8', damageType: 'piercing', desc: 'Range 150/600, powerful bow' },
      { id: 'shortbow', name: 'Hunting Shortbow', type: 'ranged', useStat: 'DEX', damageDice: '1d6', damageType: 'piercing', desc: 'Range 80/320, quick to draw' },
      { id: 'hand_crossbow', name: 'Hand Crossbow', type: 'ranged', useStat: 'DEX', damageDice: '1d6', damageType: 'piercing', desc: 'Range 30/120, one-handed' },
      { id: 'sling', name: 'Leather Sling', type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'bludgeoning', desc: 'Range 30/120, simple and silent' },
      { id: 'javelin', name: 'Hunting Javelins', type: 'ranged', useStat: 'STR', damageDice: '1d6', damageType: 'piercing', desc: 'Range 30/120, throwable spear' },
      { id: 'scimitar', name: 'Bronze Scimitar', type: 'melee', useStat: 'DEX', damageDice: '1d6', damageType: 'slashing', desc: 'Light, finesse blade' }
    ],
    Magi: [
      { id: 'arcane_staff', name: 'Watcher-Carved Staff', type: 'spell', useStat: 'INT', damageDice: '1d10', damageType: 'force', desc: 'Eldritch Blast - forbidden Watcher magic' },
      { id: 'fire_wand', name: 'Wand of Fire', type: 'spell', useStat: 'INT', damageDice: '1d10', damageType: 'fire', desc: 'Fire Bolt - flames of destruction' },
      { id: 'frost_orb', name: 'Orb of Winter', type: 'spell', useStat: 'INT', damageDice: '1d8', damageType: 'cold', desc: 'Ray of Frost - freezing magic' },
      { id: 'shock_rod', name: 'Lightning Rod', type: 'spell', useStat: 'INT', damageDice: '1d8', damageType: 'lightning', desc: 'Shocking Grasp - electric touch' },
      { id: 'poison_focus', name: 'Serpent Focus', type: 'spell', useStat: 'INT', damageDice: '1d12', damageType: 'poison', desc: 'Poison Spray - toxic cloud' },
      { id: 'ritual_dagger', name: 'Ritual Dagger', type: 'melee', useStat: 'DEX', damageDice: '1d4', damageType: 'piercing', desc: 'Ceremonial blade, finesse' }
    ],
    Priest: [
      { id: 'holy_staff', name: 'Blessed Bronze Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Inscribed with sacred names' },
      { id: 'mace', name: 'Ceremonial Mace', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Bronze holy weapon' },
      { id: 'sacred_light', name: 'Sacred Flame', type: 'spell', useStat: 'WIS', damageDice: '1d8', damageType: 'radiant', desc: 'Divine fire from heaven' },
      { id: 'divine_smite', name: 'Divine Word', type: 'spell', useStat: 'WIS', damageDice: '1d8', damageType: 'thunder', desc: 'Power of the spoken Name' },
      { id: 'war_pick', name: "Priest's War Pick", type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'piercing', desc: 'For holy warriors' },
      { id: 'sling_stones', name: 'Blessed Sling', type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'bludgeoning', desc: 'Range 30/120, like David' }
    ],
    Artisan: [
      { id: 'smith_hammer', name: "Smith's War Hammer", type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'bludgeoning', desc: 'Forged by Tubal-Cain (1d10 two-handed)' },
      { id: 'battle_pick', name: 'Mining Pick', type: 'melee', useStat: 'STR', damageDice: '1d8', damageType: 'piercing', desc: 'Tool and weapon' },
      { id: 'hand_axe', name: 'Bronze Hand Axe', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'slashing', desc: 'Light, throwable (20/60)' },
      { id: 'light_crossbow', name: 'Engineering Crossbow', type: 'ranged', useStat: 'DEX', damageDice: '1d8', damageType: 'piercing', desc: 'Range 80/320, mechanical marvel' },
      { id: 'quarterstaff', name: 'Reinforced Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Versatile (1d8 two-handed)' }
    ],
    Scribe: [
      { id: 'quill_dagger', name: 'Scribe Dagger', type: 'melee', useStat: 'DEX', damageDice: '1d4', damageType: 'piercing', desc: 'Light, finesse, concealable' },
      { id: 'quarterstaff', name: 'Walking Staff', type: 'melee', useStat: 'STR', damageDice: '1d6', damageType: 'bludgeoning', desc: 'Versatile (1d8 two-handed)' },
      { id: 'dart', name: 'Poison Darts', type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'piercing', desc: 'Range 20/60, finesse, throwable' },
      { id: 'sling_scholar', name: "Scholar's Sling", type: 'ranged', useStat: 'DEX', damageDice: '1d4', damageType: 'bludgeoning', desc: 'Range 30/120, simple' },
      { id: 'arcane_knowledge', name: 'Arcane Knowledge', type: 'spell', useStat: 'INT', damageDice: '1d10', damageType: 'psychic', desc: 'Mind Spike - forbidden knowledge' }
    ]
  };

  // === VISUAL OPTIONS ===
  const BACKGROUNDS = [
    { value: "ancient stone city", label: "Stone City (Enoch/Irad)" },
    { value: "mountain stronghold", label: "Mountain Fortress" },
    { value: "arid desert wasteland", label: "Desert Wasteland" },
    { value: "lush hanging gardens", label: "Hanging Gardens" },
    { value: "dark ritual cavern", label: "Dark Cavern" },
    { value: "ziggurat temple", label: "Ziggurat Temple" },
    { value: "mount hermon summit snowy peaks", label: "Mount Hermon Summit (Snowy)" },
    { value: "ancient cedar forest", label: "Cedar Forests (Ancient)" },
    { value: "coastal waters fountains of the deep", label: "Fountains of the Deep (Coastal)" },
    { value: "iron furnace industrial", label: "Iron Furnace (Industrial)" },
    { value: "wasteland of nod red sky", label: "Wasteland of Nod (Red Sky)" },
    { value: "underground catacomb", label: "Underground Catacomb" },
    { value: "tribal encampment", label: "Nomadic Camp" },
    { value: "bronze age forge", label: "Ancient Forge" }
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
    equipment: 'bronze_sword', // Default equipment
    attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    // PF2e Boost Allocations
    ancestryFreeBoosts: [],    // Which stats the player chose for ancestry free boosts
    ancestryFlaw: '',          // Which stat for free flaw (Sethite, Cainite, Wanderer, Sorcerer Clan)
    bgFixedChoice: '',         // For "or" backgrounds (e.g., "INT or STR"), which one they picked
    bgFreeBoost: '',           // Which stat for background free boost
    classKeyChoice: '',        // For "or" classes (e.g., Warrior "STR or DEX"), which one they picked
    freeBoosts: []             // 4 free boosts (each to a different stat)
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
    if (race === 'Nephilim' || race === 'Rephaim' || race === 'Anakim' || race === 'Gibborim' || race === 'Elioud') {
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

  // === SUMMON RANDOM LEGEND ===
  const summonRandomLegend = () => {
    const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const allStats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

    const raceKeys = Object.keys(RACES);
    const randomRace = randomFrom(raceKeys);
    const randomSex = randomFrom(['Male', 'Female']);
    const randomClass = randomFrom(CLASSES).value;
    const randomBg = randomFrom(GAME_BACKGROUNDS).value;

    // Randomly allocate boosts per PF2e rules
    const raceData = RACES[randomRace];
    const classData = CLASSES.find(c => c.value === randomClass) || CLASSES[0];
    const bgData = GAME_BACKGROUNDS.find(b => b.value === randomBg);

    // Ancestry free boosts
    const freeCount = raceData.abilityBoosts.filter(b => b === 'Free').length;
    const shuffled = [...allStats].sort(() => Math.random() - 0.5);
    const ancestryFreeBoosts = shuffled.slice(0, freeCount);

    // Ancestry flaw (if free)
    const ancestryFlaw = raceData.abilityFlaw === 'Free' ? randomFrom(allStats) : '';

    // Background fixed choice (for "or" type)
    let bgFixedChoice = '';
    if (bgData && bgData.boost.includes(' or ')) {
      const opts = bgData.boost.split(' or ');
      bgFixedChoice = randomFrom(opts);
    }

    // Background free boost
    const bgFreeBoost = randomFrom(allStats);

    // Class key choice (for "or" type)
    let classKeyChoice = '';
    if (classData.keyAbility.includes(' or ')) {
      const opts = classData.keyAbility.split(' or ');
      classKeyChoice = randomFrom(opts);
    }

    // 4 free boosts (each to different stat)
    const freeShuffled = [...allStats].sort(() => Math.random() - 0.5);
    const freeBoosts = freeShuffled.slice(0, 4);

    setFormData(prev => ({
      ...prev,
      lineage: randomRace,
      sex: randomSex,
      charClass: randomClass,
      level: Math.floor(Math.random() * 5) + 1,
      gameBackground: randomBg,
      skinTone: randomFrom(SKIN_TONES).value,
      eyeColor: randomFrom(EYE_COLORS).value,
      hairColor: randomFrom(HAIR_COLORS).value,
      hairLength: randomFrom(HAIR_LENGTHS).value,
      bodyBuild: randomFrom(BODY_BUILDS).value,
      distinguishingFeature: randomFrom(DISTINGUISHING_FEATURES).value,
      mount: Math.random() > 0.7 ? randomFrom(MOUNTS.filter(m => m.value !== 'none')).value : 'none',
      background: randomFrom(BACKGROUNDS).value,
      vibe: randomFrom(VIBES).value,
      equipment: EQUIPMENT[randomClass]?.[Math.floor(Math.random() * (EQUIPMENT[randomClass]?.length || 1))]?.id || 'bronze_sword',
      attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
      ancestryFreeBoosts,
      ancestryFlaw,
      bgFixedChoice,
      bgFreeBoost,
      classKeyChoice,
      freeBoosts
    }));

    // Generate name after state update
    setTimeout(() => {
      generateRandomName();
      generateRandomHeight();
    }, 50);
  };

  // === HANDLERS ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate name input
    if (name === 'name') {
      const sanitized = validateCharacterName(value);
      setFormData({ ...formData, [name]: sanitized });
    }
    // Validate custom visuals
    else if (name === 'customVisuals') {
      const sanitized = validateDescription(value, 500);
      setFormData({ ...formData, [name]: sanitized });
    }
    // Reset boost allocations when ancestry/class/background changes
    else if (name === 'lineage') {
      setFormData({ ...formData, [name]: value, ancestryFreeBoosts: [], ancestryFlaw: '' });
    } else if (name === 'charClass') {
      setFormData({ ...formData, [name]: value, classKeyChoice: '' });
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
    if (!stat || !scores[stat] === undefined) return;
    scores[stat] = scores[stat] >= 18 ? scores[stat] + 1 : scores[stat] + 2;
  };

  // Compute final attributes from all boost sources
  const computeAttributes = (data) => {
    const scores = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
    const raceData = RACES[data.lineage];
    const classData = CLASSES.find(c => c.value === data.charClass) || CLASSES[0];
    const bgData = GAME_BACKGROUNDS.find(b => b.value === data.gameBackground);

    // 1. Ancestry fixed boosts
    raceData.abilityBoosts.forEach(boost => {
      if (boost !== 'Free') applyBoost(scores, boost);
    });

    // 2. Ancestry free boosts
    (data.ancestryFreeBoosts || []).forEach(stat => applyBoost(scores, stat));

    // 3. Ancestry flaw
    if (raceData.abilityFlaw && raceData.abilityFlaw !== 'Free' && raceData.abilityFlaw !== null) {
      scores[raceData.abilityFlaw] = (scores[raceData.abilityFlaw] || 10) - 2;
    } else if (raceData.abilityFlaw === 'Free' && data.ancestryFlaw) {
      scores[data.ancestryFlaw] = (scores[data.ancestryFlaw] || 10) - 2;
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

    // 7. Four free boosts (each to a different stat)
    (data.freeBoosts || []).forEach(stat => applyBoost(scores, stat));

    return scores;
  };

  // Get number of ancestry free boost slots
  const getAncestryFreeCount = () => {
    const raceData = RACES[formData.lineage];
    return raceData.abilityBoosts.filter(b => b === 'Free').length;
  };

  // Get whether ancestry flaw is free choice
  const isAncestryFlawFree = () => {
    const raceData = RACES[formData.lineage];
    return raceData.abilityFlaw === 'Free';
  };

  // Get background boost options (for "or" type)
  const getBgBoostOptions = () => {
    const bgData = GAME_BACKGROUNDS.find(b => b.value === formData.gameBackground);
    if (!bgData) return null;
    if (bgData.boost.includes(' or ')) {
      return bgData.boost.split(' or ');
    }
    return null; // Fixed, no choice needed
  };

  // Get class key ability options (for "or" type)
  const getClassKeyOptions = () => {
    const classData = CLASSES.find(c => c.value === formData.charClass) || CLASSES[0];
    if (classData.keyAbility.includes(' or ')) {
      return classData.keyAbility.split(' or ');
    }
    return null; // Fixed, no choice needed
  };

  // Toggle a stat in an array-based boost list
  const toggleBoost = (field, stat, maxCount) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(stat)) {
        return { ...prev, [field]: current.filter(s => s !== stat) };
      }
      if (current.length >= maxCount) return prev; // Already at max
      return { ...prev, [field]: [...current, stat] };
    });
  };

  // Computed attributes (reactive)
  const computedAttrs = computeAttributes(formData);

  // === BUILD PHOTOREALISTIC IMAGE PROMPT ===
  const buildImagePrompt = () => {
    const raceData = RACES[formData.lineage];
    const customDesc = formData.customVisuals.trim();

    // Skin tone mapping — explicit descriptions so image model renders correct ethnicity
    const SKIN_MAP = {
      'olive': 'light olive-toned Mediterranean Middle Eastern skin NOT dark NOT black',
      'bronze': 'warm golden sun-tanned bronze Middle Eastern skin',
      'copper': 'warm copper-toned reddish-brown skin',
      'tan': 'light tan Levantine Middle Eastern skin',
      'light brown': 'light brown Mesopotamian skin',
      'dark brown': 'deep dark brown Nubian African skin',
      'alabaster': 'extremely pale white translucent alabaster skin',
      'obsidian': 'very deep black-purple obsidian dark skin',
      'red clay': 'warm reddish clay-colored earthy skin',
      'ashen grey': 'grey ashen deathly pale skin with grey undertone',
      'copper patina': 'greenish oxidized copper-patina tinted skin',
      'marble': 'pale white marble-like skin with visible veining',
      'gold-dust': 'warm golden shimmering luminous skin',
      'pale': 'pale light-skinned northern complexion',
      'unnaturally pale': 'extremely pale almost white ghostly skin'
    };
    let cleanSkin = SKIN_MAP[formData.skinTone] || formData.skinTone;

    // Hair texture and phenotype by ancestry (sex-aware per manual physical descriptions)
    const raceKey = formData.lineage.toLowerCase();
    const isFemale = formData.sex === 'Female';
    let phenotype = isFemale
      ? "woman, Middle Eastern Semitic features, ancient Hebrew biblical era"
      : "man, Middle Eastern Semitic features, aquiline nose, ancient Hebrew biblical era";
    let hairTexture = "thick wavy";

    if (raceKey === 'nephilim') {
      phenotype = isFemale
        ? "towering 12ft giantess woman, massively powerful build, broad shoulders, thick limbs, angular face with celestial features, Middle Eastern features, ancient bronze-age warrior woman"
        : "towering 12ft giant man, massively muscular, inhuman proportions, rigid angular face, Middle Eastern features, ancient bronze-age warrior";
      hairTexture = "thick wild";
    } else if (raceKey === 'rephaim') {
      phenotype = isFemale
        ? "tall 9ft gaunt giantess woman, pale ashen complexion, hollow cheekbones, deep-set shadowed eyes, skeletal angular features, spectral haunting presence"
        : "tall 10ft gaunt giant man, pale grey complexion, hollow cheekbones, haunted ancient warrior, spectral presence";
      hairTexture = "thin wispy";
    } else if (raceKey === 'anakim') {
      phenotype = isFemale
        ? "tall 10ft giantess woman, regal bearing, elongated neck, high cheekbones, sharp refined features, piercing eyes, noble ancient warrior queen, Middle Eastern features, adorned with heavy bronze chains"
        : "tall 11ft giant man, regal bearing, long neck, noble ancient warrior-king, Middle Eastern features, adorned with heavy chains";
      hairTexture = "thick braided";
    } else if (raceKey === 'gibborim') {
      phenotype = isFemale
        ? "tall 7ft powerfully built woman warrior, well-proportioned athletic build, broad shoulders, intense eyes, striking strong features, Middle Eastern features, ancient legendary heroine"
        : "tall 7ft powerfully muscular man warrior, heroic proportions, strong jaw, Middle Eastern features, ancient legendary hero";
      hairTexture = "thick wavy";
    } else if (raceKey === 'elioud') {
      phenotype = isFemale
        ? "tall 6ft5 athletic woman, powerful well-proportioned build, broader shoulders, unusually intense eyes, subtle giant characteristics, Middle Eastern features, passing as human but uncanny, ancient warrior woman"
        : "tall 7ft athletic man, subtle inhuman beauty, striking intense eyes, Middle Eastern features, passing as human but uncanny, ancient warrior-scholar";
      hairTexture = "thick flowing";
    } else if (raceKey === 'horim') {
      phenotype = isFemale
        ? "pale translucent skin woman, large luminous eyes, lean wiry build, cave-dweller, visible blue veins, primal ancient features"
        : "pale skin man, wide dark eyes, wiry compact build, cave-dweller, primal ancient features";
      hairTexture = "coarse matted";
    } else if (raceKey === 'cainite') {
      phenotype = isFemale
        ? "urban sophisticated woman, calloused hands, trade-marked features, elaborate dyed clothing, Middle Eastern Semitic features, ancient city-dweller"
        : "urban robust man, calloused hands, trade-marked features, sharp cunning eyes, Middle Eastern Semitic features, ancient city-builder";
      hairTexture = "thick coarse";
    } else if (raceKey === 'sethite') {
      phenotype = isFemale
        ? "dignified woman, refined features, thoughtful contemplative expression, Middle Eastern Semitic features, priestly ancient lineage, simple wool and linen garments"
        : "noble bearing man, serene expression, refined features, Middle Eastern Semitic features, priestly ancient lineage";
      hairTexture = "thick wavy";
    } else if (raceKey === 'wanderer') {
      phenotype = isFemale
        ? "lean weathered woman traveler, sun-darkened skin, wind-tousled hair, scarred calloused hands, lean muscular, Middle Eastern Semitic features, ancient nomad"
        : "rugged man traveler, sun-weathered face, Middle Eastern Semitic features, ancient nomad";
      hairTexture = "thick windswept";
    } else if (raceKey === 'sorcerer clan') {
      phenotype = isFemale
        ? "mystical woman, intense unnatural gaze, faint Watcher mark on skin, eyes with faint luminescence, Middle Eastern features, ancient occult sorceress"
        : "intense mystical man, sharp angular face, Middle Eastern features, ancient occult scholar";
      hairTexture = "thick straight";
    }

    // Body build
    let bodyBuild = formData.bodyBuild;
    if (bodyBuild === 'random') {
      const types = ['gaunt', 'lean', 'athletic', 'stocky', 'heavyset'];
      bodyBuild = types[Math.floor(Math.random() * types.length)];
    }

    // Hair length (values are already descriptive for image model)
    let cleanHairLen = formData.hairLength;

    // Height context
    const safeHeight = formData.height.replace(/'/g, "ft ").replace(/"/g, "in").trim();

    // Feature
    const featureDesc = formData.distinguishingFeature !== 'none' ? `, with ${formData.distinguishingFeature}` : '';

    // Mount
    const mountDesc = formData.mount !== 'none' ? `, ${formData.mount}` : '';

    // Hair descriptor — combine length, color, and texture explicitly
    const hairDesc = `${cleanHairLen} ${formData.hairColor} colored ${hairTexture} hair`;

    // Appearance assembly — skin tone first and emphasized
    let appearance = `${cleanSkin}, ${phenotype}, ${bodyBuild} build, ${formData.eyeColor} eyes, ${hairDesc}${featureDesc}`;

    if (customDesc) appearance += `, ${customDesc}`;

    // Photorealistic prompt style - biblical bronze-age human characters, NOT fantasy creatures
    // Build prompt in priority order so truncation removes least important parts first
    const coreParts = [
      `close-up portrait headshot of a ${formData.sex} ${formData.lineage} ${formData.charClass}`,
      appearance,
      `wearing ${raceData.visuals}`,
      `fully clothed modest ancient clothing`,
      `${formData.background} background`,
      `${formData.vibe} atmosphere`,
      `ancient bronze-age biblical Hebrew setting`,
      `dramatic lighting, 8k, photorealistic`,
    ];
    const emphasisParts = [
      `MUST HAVE ${cleanSkin}`,
      `MUST HAVE ${hairDesc}`,
    ];
    const negativeParts = [
      `NO extra limbs, NO extra arms, NO extra fingers, NO horns, NO wings`,
      `NO nudity, NO bare chest, fully covered, PG-13`,
    ];

    // Assemble and trim to fit within 1000 character API limit
    const MAX_PROMPT_LENGTH = 1000;
    const allParts = [...coreParts, ...emphasisParts, ...negativeParts];
    let prompt = allParts.join(', ');
    prompt = prompt.replace(/[()"]/g, "").replace(/,\s*,/g, ',').trim();

    if (prompt.length > MAX_PROMPT_LENGTH) {
      // Drop sections from the end (least important first) until it fits
      const parts = [...coreParts, ...emphasisParts, ...negativeParts];
      while (parts.length > 1) {
        parts.pop();
        prompt = parts.join(', ').replace(/[()"]/g, "").replace(/,\s*,/g, ',').trim();
        if (prompt.length <= MAX_PROMPT_LENGTH) break;
      }
      // Final hard truncate if a single section is still too long
      if (prompt.length > MAX_PROMPT_LENGTH) {
        prompt = prompt.slice(0, MAX_PROMPT_LENGTH);
      }
    }

    return prompt;
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
    const classData = CLASSES.find(c => c.value === formData.charClass) || CLASSES[0];
    const bgData = GAME_BACKGROUNDS.find(b => b.value === formData.gameBackground);
    const level = formData.level || 1;

    // Compute final stats from PF2e boost system
    const finalStats = computeAttributes(formData);

    // Calculate Modifiers
    const getMod = (score) => Math.floor((score - 10) / 2);
    const strMod = getMod(finalStats.STR);
    const dexMod = getMod(finalStats.DEX);
    const conMod = getMod(finalStats.CON);

    // Calculate Derived Stats (PF2e: Ancestry HP + Class HP per level + CON mod per level)
    const proficiency = 2 + Math.floor((level - 1) / 2); // PF2e proficiency scales with level
    const maxHp = loreData.ancestryHP + (classData.classHP + conMod) * level;
    const defense = 10 + dexMod; // Base AC (armor adds more in PF2e)

    // Get selected equipment from class list
    const classEquipment = EQUIPMENT[formData.charClass] || EQUIPMENT.Warrior;
    const selectedEquipment = classEquipment.find(e => e.id === formData.equipment) || classEquipment[0];

    // Calculate attack bonus based on equipment's stat requirement
    const statMods = {
      STR: strMod,
      DEX: dexMod,
      CON: conMod,
      INT: getMod(finalStats.INT),
      WIS: getMod(finalStats.WIS),
      CHA: getMod(finalStats.CHA)
    };

    const attackMod = statMods[selectedEquipment.useStat] || 0;
    const damageMod = selectedEquipment.type === 'spell' ? 0 : attackMod;

    const mainAction = {
      id: selectedEquipment.id,
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
    const resetData = {
      name: '',
      sex: 'Male',
      lineage: 'Sethite',
      charClass: 'Warrior',
      level: 1,
      gameBackground: 'watchers_apprentice',
      height: '',
      skinTone: 'olive',
      eyeColor: 'brown',
      hairColor: 'black',
      hairLength: 'short',
      bodyBuild: 'athletic',
      distinguishingFeature: 'none',
      mount: 'none',
      customVisuals: '',
      background: 'ancient stone city',
      vibe: 'biblical epic',
      equipment: 'bronze_sword',
      attributes: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 }
    };

    setFormData(resetData);
    setPortrait(null);
    setFinalCharacter(null);
    setShowSheet(false);
    setError('');
    setLoading(false);
  };

  // === CHARACTER SHEET VIEW ===
  if (showSheet && finalCharacter) {
    // Look up race data from RACES object using the lineage string
    const raceData = RACES[finalCharacter.lineage];

    return (
      <div className="min-h-screen bg-[#0c0a09] text-[#d6d3d1] font-serif p-4 pb-8">
        <div className="max-w-5xl mx-auto border-2 border-[#78350f] bg-[#1c1917] rounded-lg overflow-hidden mb-8">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#78350f] to-[#92400e] p-4 sm:p-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-[#fcd34d] mb-2">{finalCharacter.name}</h1>
            <div className="text-[#d6d3d1] text-base sm:text-lg">
              {finalCharacter.sex} {raceData.name} • {finalCharacter.class} (Level {finalCharacter.level})
            </div>
            <div className="text-[#a8a29e] text-sm mt-1">
              {finalCharacter.height} tall • {finalCharacter.size} • Speed {finalCharacter.speed} ft
              {finalCharacter.gameBackground && finalCharacter.gameBackground !== 'None' && (
                <span> • {finalCharacter.gameBackground}</span>
              )}
            </div>
          </div>

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
                  {raceData.traits.map((trait, i) => (
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
              className="px-6 sm:px-8 py-3 bg-[#44403c] border border-[#78716c] text-white font-bold rounded hover:bg-[#57534e] transition text-sm sm:text-base"
            >
              ← Back to Editor
            </button>
            <button
              onClick={handleSaveToRoster}
              className="px-6 sm:px-8 py-3 bg-blue-900 border border-blue-600 text-blue-100 font-bold rounded hover:bg-blue-800 transition text-sm sm:text-base"
            >
              💾 Save to Roster
            </button>
            <button
              onClick={handleSave}
              className="px-6 sm:px-8 py-3 bg-green-900 border border-green-600 text-green-100 font-bold rounded hover:bg-green-800 transition shadow-[0_0_20px_rgba(22,163,74,0.3)] text-sm sm:text-base"
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
        <div className="border-2 border-[#78350f] bg-[#1c1917]/95 p-4 sm:p-6 shadow-[0_0_40px_rgba(245,158,11,0.1)] rounded-sm">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#fcd34d] font-cinzel font-bold mb-6 border-b border-[#78350f] pb-2 tracking-widest text-center shadow-black drop-shadow-lg">
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
                maxLength={50}
                required
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
                Boosts: {RACES[formData.lineage].abilityBoosts.join(', ')}
                {RACES[formData.lineage].abilityFlaw && RACES[formData.lineage].abilityFlaw !== "Free" && RACES[formData.lineage].abilityFlaw !== null && (
                  <span className="text-red-400"> | Flaw: {RACES[formData.lineage].abilityFlaw}</span>
                )}
              </p>
              <p className="text-[#a8a29e] text-xs mt-1">
                HP: {RACES[formData.lineage].ancestryHP} | Size: {RACES[formData.lineage].size} | Speed: {RACES[formData.lineage].speed} ft
              </p>
              <p className="text-blue-400 text-xs mt-1">RP: {RACES[formData.lineage].startingRP} | <span className="text-red-400">CP: {RACES[formData.lineage].startingCP}</span></p>
            </div>

            {/* CLASS */}
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
                    equipment: EQUIPMENT[newClass]?.[0]?.id || 'bronze_sword'
                  }));
                }}
                className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
              >
                {CLASSES.map(cls => (
                  <option key={cls.value} value={cls.value}>{cls.label}</option>
                ))}
              </select>
            </div>

            {/* LEVEL & BACKGROUND */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(lvl => (
                    <option key={lvl} value={lvl}>Level {lvl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Background</label>
                <select
                  name="gameBackground"
                  value={formData.gameBackground}
                  onChange={handleChange}
                  className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
                >
                  {GAME_BACKGROUNDS.map(bg => (
                    <option key={bg.value} value={bg.value}>{bg.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Background Info */}
            {formData.gameBackground && (
              <div className="bg-[#292524] p-2 border-l-2 border-blue-600 text-xs">
                {(() => {
                  const bg = GAME_BACKGROUNDS.find(b => b.value === formData.gameBackground);
                  return bg ? (
                    <>
                      <span className="text-blue-400">Boost: {bg.boost}</span>
                      <span className="text-[#a8a29e]"> | Skill: {bg.skill}</span>
                      <span className="text-[#78716c]"> | Lore: {bg.lore}</span>
                    </>
                  ) : null;
                })()}
              </div>
            )}

            {/* EQUIPMENT/WEAPON */}
            <div>
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">
                Equipment
              </label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full bg-black border border-[#44403c] p-2 text-white outline-none text-sm"
              >
                {(EQUIPMENT[formData.charClass] || EQUIPMENT.Warrior).map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.damageDice} {item.damageType})
                  </option>
                ))}
              </select>
              {/* Equipment Description */}
              {formData.equipment && (
                <div className="mt-1 text-[10px] text-[#78716c] italic">
                  {(EQUIPMENT[formData.charClass] || EQUIPMENT.Warrior).find(e => e.id === formData.equipment)?.desc}
                </div>
              )}
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

              {/* Body Build & Mount */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[#78716c] text-[10px] font-bold mb-1">BODY BUILD</label>
                  <select
                    name="bodyBuild"
                    value={formData.bodyBuild}
                    onChange={handleChange}
                    className="w-full bg-black border border-[#44403c] p-2 text-white text-sm outline-none"
                  >
                    {BODY_BUILDS.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
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
              </div>
            </div>

            {/* PF2e ABILITY BOOST SYSTEM */}
            <div className="border-t border-[#44403c] pt-4">
              <label className="block text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-3">Ability Scores (PF2e Boosts)</label>

              {/* Final Scores Display */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                {STATS.map(attr => {
                  const val = computedAttrs[attr];
                  const mod = Math.floor((val - 10) / 2);
                  return (
                    <div key={attr} className="text-center bg-black border border-[#44403c] rounded p-2">
                      <span className="block text-[9px] text-[#78716c] font-bold">{attr}</span>
                      <span className="block text-lg text-[#fcd34d] font-bold">{val}</span>
                      <span className={`block text-[10px] font-bold ${mod >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {mod >= 0 ? `+${mod}` : mod}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Ancestry Free Boosts */}
              {getAncestryFreeCount() > 0 && (
                <div className="mb-3 p-3 bg-[#1c1917] border border-[#44403c] rounded">
                  <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">
                    Ancestry Free Boosts ({formData.ancestryFreeBoosts.length}/{getAncestryFreeCount()})
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {STATS.map(stat => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => toggleBoost('ancestryFreeBoosts', stat, getAncestryFreeCount())}
                        className={`px-2 py-1 text-[10px] font-bold rounded border transition ${
                          formData.ancestryFreeBoosts.includes(stat)
                            ? 'bg-amber-700 border-amber-500 text-white'
                            : 'bg-black border-[#44403c] text-stone-400 hover:border-amber-600'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1b: Ancestry Free Flaw */}
              {isAncestryFlawFree() && (
                <div className="mb-3 p-3 bg-[#1c1917] border border-[#44403c] rounded">
                  <div className="text-[10px] text-red-400 font-bold uppercase mb-1">
                    Ancestry Flaw (choose 1)
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {STATS.map(stat => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, ancestryFlaw: prev.ancestryFlaw === stat ? '' : stat }))}
                        className={`px-2 py-1 text-[10px] font-bold rounded border transition ${
                          formData.ancestryFlaw === stat
                            ? 'bg-red-800 border-red-500 text-white'
                            : 'bg-black border-[#44403c] text-stone-400 hover:border-red-600'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Background Boost */}
              <div className="mb-3 p-3 bg-[#1c1917] border border-[#44403c] rounded">
                <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">
                  Background Boosts
                </div>
                {/* Fixed boost (or choice) */}
                {getBgBoostOptions() ? (
                  <div className="mb-2">
                    <span className="text-[9px] text-stone-500 mr-2">Fixed:</span>
                    {getBgBoostOptions().map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bgFixedChoice: opt }))}
                        className={`px-2 py-1 text-[10px] font-bold rounded border transition mr-1 ${
                          formData.bgFixedChoice === opt
                            ? 'bg-blue-700 border-blue-500 text-white'
                            : 'bg-black border-[#44403c] text-stone-400 hover:border-blue-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-2 text-[9px] text-stone-500">
                    Fixed: {GAME_BACKGROUNDS.find(b => b.value === formData.gameBackground)?.boost || '—'}
                  </div>
                )}
                {/* Free boost */}
                <div>
                  <span className="text-[9px] text-stone-500 mr-2">Free:</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {STATS.map(stat => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bgFreeBoost: prev.bgFreeBoost === stat ? '' : stat }))}
                        className={`px-2 py-1 text-[10px] font-bold rounded border transition ${
                          formData.bgFreeBoost === stat
                            ? 'bg-blue-700 border-blue-500 text-white'
                            : 'bg-black border-[#44403c] text-stone-400 hover:border-blue-600'
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Class Key Ability */}
              <div className="mb-3 p-3 bg-[#1c1917] border border-[#44403c] rounded">
                <div className="text-[10px] text-green-400 font-bold uppercase mb-1">
                  Class Key Ability Boost
                </div>
                {getClassKeyOptions() ? (
                  <div className="flex gap-1">
                    {getClassKeyOptions().map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, classKeyChoice: opt }))}
                        className={`px-2 py-1 text-[10px] font-bold rounded border transition ${
                          formData.classKeyChoice === opt
                            ? 'bg-green-700 border-green-500 text-white'
                            : 'bg-black border-[#44403c] text-stone-400 hover:border-green-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-[9px] text-stone-500">
                    Fixed: {(CLASSES.find(c => c.value === formData.charClass) || CLASSES[0]).keyAbility}
                  </div>
                )}
              </div>

              {/* Step 4: Four Free Boosts */}
              <div className="mb-3 p-3 bg-[#1c1917] border border-[#44403c] rounded">
                <div className="text-[10px] text-purple-400 font-bold uppercase mb-1">
                  Free Boosts ({formData.freeBoosts.length}/4) — each to a different score
                </div>
                <div className="flex gap-1 flex-wrap">
                  {STATS.map(stat => (
                    <button
                      key={stat}
                      type="button"
                      onClick={() => toggleBoost('freeBoosts', stat, 4)}
                      disabled={!formData.freeBoosts.includes(stat) && formData.freeBoosts.length >= 4}
                      className={`px-2 py-1 text-[10px] font-bold rounded border transition ${
                        formData.freeBoosts.includes(stat)
                          ? 'bg-purple-700 border-purple-500 text-white'
                          : formData.freeBoosts.length >= 4
                            ? 'bg-black border-[#44403c] text-stone-600 cursor-not-allowed'
                            : 'bg-black border-[#44403c] text-stone-400 hover:border-purple-600'
                      }`}
                    >
                      {stat}
                    </button>
                  ))}
                </div>
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
                  maxLength={500}
                  className="w-full bg-black border border-[#44403c] p-2 text-sm text-white h-16 resize-none focus:border-[#f59e0b] outline-none"
                />
              </div>
            </div>

            {/* RANDOM LEGEND BUTTON */}
            <button
              onClick={summonRandomLegend}
              disabled={loading}
              className="w-full py-3 font-cinzel font-bold text-base uppercase tracking-widest transition-all border border-[#44403c] bg-[#1a1a25] hover:bg-[#2a2a35] hover:border-[#78716c] text-[#a8a29e] mb-3"
            >
              Summon Random Legend
            </button>

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
