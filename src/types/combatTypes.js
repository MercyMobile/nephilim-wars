// src/types/combatTypes.js
// PF2e-Compliant Combat Types for Nephilim Wars

export type DamageType = 'physical' | 'slashing' | 'piercing' | 'bludgeoning' | 'fire' | 'cold' | 'lightning' | 'radiant' | 'necrotic' | 'force' | 'poison' | 'psychic' | 'thunder' | 'spiritual';

export type DegreeOfSuccess = 'criticalSuccess' | 'success' | 'failure' | 'criticalFailure';

// A single ability, spell, or weapon swing
export interface CombatAction {
  id: string;
  name: string;
  description?: string;
  type: 'melee' | 'ranged' | 'miracle' | 'spell';
  cost: number; // Actions required (PF2e 3-action economy: 1, 2, or 3)

  // The Math
  toHitBonus: number;
  damageDice: string; // "2d8"
  damageBonus: number;
  damageType: DamageType;

  // PF2e Weapon Traits
  traits?: string[]; // e.g., ["sweep", "reach 10", "forceful", "deadly d10"]

  // Visuals (The Juice)
  animation?: 'slash' | 'smite' | 'fireball';
  soundEffect?: 'clash' | 'chant' | 'roar';
}

// The Entity (Player or Monster)
export interface Combatant {
  id: string;
  name: string;
  portrait: string; // URL to image
  isPlayer: boolean;

  // PF2e Identity
  level?: number;
  size?: 'Small' | 'Medium' | 'Large' | 'Huge';
  speed?: number; // feet

  // Vitals
  hp: number;
  maxHp: number;
  defense: number; // Armor Class (PF2e AC)
  initiativeBonus: number;

  // PF2e Saves
  fortitude?: number;
  reflex?: number;
  will?: number;
  perception?: number;

  // PF2e Action Economy
  actionsPerTurn: number; // Default 3
  actionsRemaining?: number;

  // Soul Economy
  rp?: number; // Righteousness Points
  cp?: number; // Corruption Points

  // Attributes
  attributes?: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };

  // State
  statusEffects: string[]; // e.g. ["stunned", "blessed", "frightened"]

  // What can they do?
  actions: CombatAction[];

  // PF2e Special Abilities
  specialAbilities?: string[];
}

// The Log Entry (for the scrolling text)
export interface LogEntry {
  id: number;
  timestamp: number;
  sourceName: string;
  message: string;
  type: 'info' | 'attack' | 'damage' | 'heal' | 'criticalHit' | 'criticalFailure';
  value?: number; // The roll result
  isCrit?: boolean;
  degreeOfSuccess?: DegreeOfSuccess;
}
