// src/types/combatTypes.js
// PF2e-Compliant Combat Types for Nephilim Wars

/** @typedef {'physical'|'slashing'|'piercing'|'bludgeoning'|'fire'|'cold'|'lightning'|'radiant'|'necrotic'|'force'|'poison'|'psychic'|'thunder'|'spiritual'} DamageType */
/** @typedef {'criticalSuccess'|'success'|'failure'|'criticalFailure'} DegreeOfSuccess */

/**
 * A single ability, spell, or weapon swing.
 * @typedef {Object} CombatAction
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {'melee'|'ranged'|'miracle'|'spell'} type
 * @property {number} cost - Actions required (PF2e 3-action economy: 1, 2, or 3)
 * @property {number} toHitBonus
 * @property {string} damageDice - e.g. "2d8"
 * @property {number} damageBonus
 * @property {DamageType} damageType
 * @property {string[]} [traits] - e.g., ["sweep", "reach 10", "forceful", "deadly d10"]
 * @property {'slash'|'smite'|'fireball'} [animation]
 * @property {'clash'|'chant'|'roar'} [soundEffect]
 */

/**
 * InventoryItem for Character Hub.
 * @typedef {Object} InventoryItem
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} [quantity]
 * @property {number} [bulk]
 * @property {string} [description]
 * @property {number} [level]
 * @property {number} [price]
 * @property {string} [damageDice]
 * @property {string} [damageType]
 * @property {Object} [properties]
 * @property {string} [soulTag]
 * @property {string} [source]
 */

/**
 * The Entity (Player or Monster).
 * @typedef {Object} Combatant
 * @property {string} id
 * @property {string} name
 * @property {string} portrait - URL to image
 * @property {boolean} isPlayer
 * @property {number} [level]
 * @property {'Small'|'Medium'|'Large'|'Huge'} [size]
 * @property {number} [speed] - feet
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} defense - Armor Class (PF2e AC)
 * @property {number} initiativeBonus
 * @property {number} [fortitude]
 * @property {number} [reflex]
 * @property {number} [will]
 * @property {number} [perception]
 * @property {number} actionsPerTurn - Default 3
 * @property {number} [actionsRemaining]
 * @property {number} [rp] - Righteousness Points
 * @property {number} [cp] - Corruption Points
 * @property {string} [soulTier] - 'Blessed'|'Righteous'|'Neutral'|'Tainted'|'Corrupted'|'Forsaken'
 * @property {Object} [inventory] - { gold: number, items: InventoryItem[], equipped: Record<string, InventoryItem|null> }
 * @property {Object} [attributes] - { STR, DEX, CON, INT, WIS, CHA }
 * @property {string[]} statusEffects - e.g. ["stunned", "blessed", "frightened"]
 * @property {CombatAction[]} actions
 * @property {string[]} [specialAbilities]
 */

/**
 * The Log Entry (for the scrolling text).
 * @typedef {Object} LogEntry
 * @property {number} id
 * @property {number} timestamp
 * @property {string} sourceName
 * @property {string} message
 * @property {'info'|'attack'|'damage'|'heal'|'criticalHit'|'criticalFailure'} type
 * @property {number} [value]
 * @property {boolean} [isCrit]
 * @property {DegreeOfSuccess} [degreeOfSuccess]
 */