// combatRules.js
// PF2e-Compliant Combat Resolution for Nephilim Wars

/**
 * Determines the degree of success using PF2e rules.
 * - Critical Success: Beat DC by 10+ OR natural 20 upgrades success to crit
 * - Success: Meet or beat DC
 * - Failure: Below DC
 * - Critical Failure: Fail by 10+ OR natural 1 downgrades failure to crit fail
 */
export const getDegreeOfSuccess = (totalRoll, dc, d20Roll) => {
  const difference = totalRoll - dc;

  let degree;
  if (difference >= 10) {
    degree = 'criticalSuccess';
  } else if (difference >= 0) {
    degree = 'success';
  } else if (difference > -10) {
    degree = 'failure';
  } else {
    degree = 'criticalFailure';
  }

  // Natural 20 upgrades one step
  if (d20Roll === 20) {
    if (degree === 'success') degree = 'criticalSuccess';
    else if (degree === 'failure') degree = 'success';
    else if (degree === 'criticalFailure') degree = 'failure';
  }

  // Natural 1 downgrades one step
  if (d20Roll === 1) {
    if (degree === 'criticalSuccess') degree = 'success';
    else if (degree === 'success') degree = 'failure';
    else if (degree === 'failure') degree = 'criticalFailure';
  }

  return degree;
};

/**
 * Calculates the result of an attack based on PF2e Degrees of Success.
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
    degreeOfSuccess: 'failure',
    log: []
  };

  // 1. Calculate total attack roll
  const totalToHit = d20Roll + (action.toHitBonus || 0);

  // 2. Determine degree of success (PF2e: compare to AC as DC)
  const degree = getDegreeOfSuccess(totalToHit, defender.defense, d20Roll);
  result.degreeOfSuccess = degree;

  // 3. Resolve based on degree
  switch (degree) {
    case 'criticalSuccess': {
      result.isHit = true;
      result.isCrit = true;
      result.log.push("CRITICAL HIT!");

      // Parse dice notation (e.g., "2d8")
      const [numDice, diceType] = action.damageDice.split('d').map(Number);
      let diceDamage = 0;

      // PF2e: Double ALL damage on crit (dice + bonuses)
      for (let i = 0; i < numDice; i++) {
        diceDamage += Math.ceil(Math.random() * diceType);
      }
      const baseDamage = diceDamage + (action.damageBonus || 0);
      const totalDamage = baseDamage * 2; // PF2e doubles total damage on crit
      result.damage = totalDamage;

      result.log.push(`Rolled ${totalToHit} vs AC ${defender.defense} (beat by ${totalToHit - defender.defense})`);
      result.log.push(`Deals ${totalDamage} ${action.damageType} damage (${baseDamage} x2 crit)`);
      break;
    }

    case 'success': {
      result.isHit = true;
      result.log.push("Hit!");

      const [numDice, diceType] = action.damageDice.split('d').map(Number);
      let diceDamage = 0;
      for (let i = 0; i < numDice; i++) {
        diceDamage += Math.ceil(Math.random() * diceType);
      }
      const totalDamage = diceDamage + (action.damageBonus || 0);
      result.damage = totalDamage;

      result.log.push(`Rolled ${totalToHit} vs AC ${defender.defense}`);
      result.log.push(`Deals ${totalDamage} ${action.damageType} damage (${diceDamage} dice + ${action.damageBonus || 0} bonus)`);
      break;
    }

    case 'failure': {
      result.log.push(`Miss. Rolled ${totalToHit} vs AC ${defender.defense}`);
      break;
    }

    case 'criticalFailure': {
      result.isFumble = true;
      result.log.push(`FUMBLE! Rolled ${totalToHit} vs AC ${defender.defense} (missed by ${defender.defense - totalToHit})`);
      break;
    }
  }

  return result;
};

/**
 * PF2e 3-Action Economy constants.
 * Each combatant gets 3 actions per turn.
 */
export const ACTIONS_PER_TURN = 3;

/**
 * Calculate initiative bonus (PF2e: based on Perception, with CP penalty).
 * @param {object} combatant - The combatant.
 * @returns {number} Initiative modifier.
 */
export const getInitiativeBonus = (combatant) => {
  // PF2e initiative is typically Perception-based
  // Use WIS modifier as Perception proxy, with DEX as fallback
  const wisMod = combatant.attributes
    ? Math.floor(((combatant.attributes.WIS || 10) - 10) / 2)
    : 0;
  const baseInit = combatant.initiativeBonus !== undefined
    ? combatant.initiativeBonus
    : wisMod;

  // CP penalty to initiative (manual: CP > 10 reduces initiative)
  const cpPenalty = combatant.cp && combatant.cp > 10
    ? Math.floor((combatant.cp - 10) / 2)
    : 0;

  return baseInit - cpPenalty;
};
