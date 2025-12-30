// combatRules.js

/**
 * Calculates the result of an attack based on Nephilim Wars Core Rules.
 * @param {object} action - The action being performed (e.g., Bronze Sword).
 * @param {object} attacker - The character attacking.
 * @param {object} defender - The character being attacked.
 * @param {number} d20Roll - The raw dice roll (1-20).
 */
export const resolveAttack = (action, attacker, defender, d20Roll) => {
  const result = {
    isHit: false,
    isCrit: false,
    isFumble: false,
    damage: 0,
    log: []
  };

  // 1. Handle Criticals & Fumbles (Core Rules)
  if (d20Roll === 20) {
    result.isCrit = true;
    result.log.push("CRITICAL HIT! (Natural 20)");
  } else if (d20Roll === 1) {
    result.isFumble = true;
    result.log.push("FUMBLE! (Natural 1)");
    return result; // Auto miss
  }

  // 2. Calculate To-Hit (Core Rules: d20 + Bonus vs Defense)
  // Corruption Penalty: If CP > 10, initiative is lower, but we treat attacks normal unless specified
  const totalToHit = d20Roll + (action.toHitBonus || 0);
  
  // 3. Determine Hit
  // If it's a Crit, it hits automatically regardless of AC
  if (result.isCrit || totalToHit >= defender.defense) {
    result.isHit = true;
    
    // 4. Calculate Damage
    // Parse dice notation (e.g., "2d8")
    const [numDice, diceType] = action.damageDice.split('d').map(Number);
    let diceDamage = 0;
    
    // Roll damage dice (Double dice for Crit)
    const multiplier = result.isCrit ? 2 : 1;
    for (let i = 0; i < numDice * multiplier; i++) {
      diceDamage += Math.ceil(Math.random() * diceType);
    }

    const totalDamage = diceDamage + (action.damageBonus || 0);
    result.damage = totalDamage;
    
    result.log.push(`Hit! Rolled ${totalToHit} vs AC ${defender.defense}`);
    result.log.push(`Deals ${totalDamage} ${action.damageType} damage (${diceDamage} dice + ${action.damageBonus} bonus)`);
  } else {
    result.log.push(`Miss. Rolled ${totalToHit} vs AC ${defender.defense}`);
  }

  return result;
};