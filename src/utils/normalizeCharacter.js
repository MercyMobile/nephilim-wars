import { ANCESTRIES } from '../data/ancestries';
import { CLASSES } from '../data/classes';
import { getSoulTier } from '../data/soulTiers';

export function normalizeCharacter(generatorChar) {
  if (!generatorChar || typeof generatorChar !== 'object') return null;

  const ancestryData = ANCESTRIES[generatorChar.lineage] || null;
  const classData = CLASSES.find(c => c.value === generatorChar.class) || null;

  const rp = generatorChar.rp ?? 0;
  const cp = generatorChar.cp ?? 0;
  const soulTier = getSoulTier(rp, cp);

  return {
    id: generatorChar.id || `char-${Date.now()}`,
    name: generatorChar.name || 'Unknown',
    isPlayer: true,
    portrait: generatorChar.portrait || '',
    level: generatorChar.level || 1,
    ancestry: ancestryData ? {
      name: ancestryData.name,
      key: generatorChar.lineage,
      hp: ancestryData.hp,
      size: ancestryData.size,
      speed: ancestryData.speed,
      startingRP: ancestryData.startingRP,
      startingCP: ancestryData.startingCP,
      traits: ancestryData.traits || [],
      abilityBoosts: ancestryData.abilityBoosts || [],
      abilityFlaw: ancestryData.abilityFlaw || null,
    } : null,
    class: classData ? {
      value: classData.value,
      label: classData.label,
      keyAbility: classData.keyAbility,
      hpPerLevel: classData.hpPerLevel,
      startingGold: classData.startingGold || 0,
    } : null,
    classHP: generatorChar.classHP || classData?.hpPerLevel || 8,
    attributes: generatorChar.attributes || { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    hp: generatorChar.hp ?? generatorChar.maxHp ?? 10,
    maxHp: generatorChar.maxHp ?? generatorChar.hp ?? 10,
    defense: generatorChar.defense ?? 10,
    fortitude: generatorChar.fortitude ?? 0,
    reflex: generatorChar.reflex ?? 0,
    will: generatorChar.will ?? 0,
    perception: generatorChar.perception ?? 0,
    initiativeBonus: generatorChar.initiativeBonus ?? 0,
    speed: generatorChar.speed ?? ancestryData?.speed ?? 25,
    size: generatorChar.size ?? ancestryData?.size ?? 'Medium',
    keyAbility: generatorChar.keyAbility ?? classData?.keyAbility ?? 'STR',
    soulEconomy: {
      rp,
      cp,
      maxRp: Math.max(rp, 10),
      maxCp: Math.max(cp, 10),
      spendingLog: [],
    },
    soulTier: soulTier.name,
    inventory: {
      gold: classData?.startingGold ?? 0,
      items: generatorChar.actions
        ? generatorChar.actions.map(a => ({
            id: a.id,
            name: a.name,
            category: a.type === 'spell' ? 'spell' : 'melee',
            quantity: 1,
            bulk: 0.1,
            damageDice: a.damageDice,
            damageType: a.damageType,
            soulTag: 'neutral',
          }))
        : [],
      equipped: {},
    },
    actionsPerTurn: 3,
    statusEffects: [],
    actions: generatorChar.actions || [],
    gameBackground: generatorChar.gameBackground || '',
    sex: generatorChar.sex || '',
    height: generatorChar.height || '',
    skinTone: generatorChar.skinTone || '',
    eyeColor: generatorChar.eyeColor || '',
    hairColor: generatorChar.hairColor || '',
    hairLength: generatorChar.hairLength || '',
    distinguishingFeature: generatorChar.distinguishingFeature || '',
    accessory: generatorChar.accessory || '',
  };
}