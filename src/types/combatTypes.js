// src/types/combatTypes.ts

export type DamageType = 'physical' | 'fire' | 'radiant' | 'spiritual';

// A single ability, spell, or weapon swing
export interface CombatAction {
  id: string;
  name: string;
  description?: string;
  type: 'melee' | 'ranged' | 'miracle' | 'spell';
  cost: number; // Action Points (AP) or CP cost
  
  // The Math
  toHitBonus: number; 
  damageDice: string; // "2d8"
  damageBonus: number;
  damageType: DamageType;
  
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
  
  // Vitals
  hp: number;
  maxHp: number;
  defense: number; // Armor Class
  initiativeBonus: number;
  
  // State
  statusEffects: string[]; // e.g. ["stunned", "blessed"]
  
  // What can they do?
  actions: CombatAction[];
}

// The Log Entry (for the scrolling text)
export interface LogEntry {
  id: number;
  timestamp: number;
  sourceName: string;
  message: string;
  type: 'info' | 'attack' | 'damage' | 'heal';
  value?: number; // The roll result
  isCrit?: boolean;
}