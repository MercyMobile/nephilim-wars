import { getProficiencyBonus } from '../data/levelProgression';

export function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function calculateMaxHP(ancestryHP, classHP, conMod, level) {
  if (level <= 1) return ancestryHP + classHP + conMod;
  return ancestryHP + classHP + conMod + (classHP + conMod) * (level - 1);
}

export function calculateAC(dexMod, armorBonus = 0, shieldBonus = 0, dexCap = 999) {
  const cappedDex = Math.min(dexMod, dexCap);
  return 10 + cappedDex + armorBonus + shieldBonus;
}

export function calculateSave(abilityMod, level, rank = 'trained') {
  return abilityMod + getProficiencyBonus(level, rank);
}

export function calculatePerception(wisMod, level, rank = 'trained') {
  return wisMod + getProficiencyBonus(level, rank);
}

export function calculateInitiative(perceptionBonus, cpPenalty = 0) {
  return perceptionBonus - cpPenalty;
}

export function computeAllStats(character) {
  if (!character) return null;

  const attrs = character.attributes || { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
  const _strMod = getAbilityModifier(attrs.STR);
  const dexMod = getAbilityModifier(attrs.DEX);
  const conMod = getAbilityModifier(attrs.CON);
  const _intMod = getAbilityModifier(attrs.INT);
  const wisMod = getAbilityModifier(attrs.WIS);
  const _chaMod = getAbilityModifier(attrs.CHA);
  const level = character.level || 1;

  const profBonus = getProficiencyBonus(level, 'trained');

  let armorBonus = 0;
  let shieldBonus = 0;
  let dexCap = 999;
  const equipped = character.inventory?.equipped || {};
  if (equipped.armor) {
    armorBonus = equipped.armor.acBonus || 0;
    dexCap = equipped.armor.dexCap != null ? equipped.armor.dexCap : 999;
  }
  if (equipped.shield) {
    shieldBonus = equipped.shield.acBonus || 0;
  }

  const cpRaw = character.soulEconomy?.cp || 0;
  const cpPenalty = cpRaw > 10 ? Math.floor((cpRaw - 10) / 2) : 0;

  const perceptionBonus = calculatePerception(wisMod, level, 'trained');
  const ancestryHP = character.ancestry?.hp || 8;
  const classHP = character.classHP || character.class?.hpPerLevel || 8;

  return {
    ac: calculateAC(dexMod, armorBonus, shieldBonus, dexCap),
    fortitude: calculateSave(conMod, level, 'trained'),
    reflex: calculateSave(dexMod, level, 'trained'),
    will: calculateSave(wisMod, level, 'trained'),
    perception: perceptionBonus,
    initiative: calculateInitiative(perceptionBonus, cpPenalty),
    maxHP: calculateMaxHP(ancestryHP, classHP, conMod, level),
    speed: character.ancestry?.speed || 25,
    proficiencyBonus: profBonus,
  };
}