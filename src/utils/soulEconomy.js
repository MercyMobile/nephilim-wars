import { getSoulTier } from '../data/soulTiers';

export { getSoulTier };

export function getNetRighteousness(rp, cp) {
  return (rp || 0) - (cp || 0);
}

export function canSpendRP(character, amount) {
  return (character?.soulEconomy?.rp || 0) >= amount;
}

export function spendRP(character, amount, reason) {
  const se = character?.soulEconomy || { rp: 0, cp: 0, spendingLog: [] };
  return {
    ...se,
    rp: Math.max(0, se.rp - amount),
    spendingLog: [...(se.spendingLog || []), { type: 'rp', amount, reason, timestamp: Date.now() }],
  };
}

export function gainRP(character, amount, reason) {
  const se = character?.soulEconomy || { rp: 0, cp: 0, spendingLog: [] };
  return {
    ...se,
    rp: se.rp + amount,
    spendingLog: [...(se.spendingLog || []), { type: 'rp', amount, reason, timestamp: Date.now() }],
  };
}

export function gainCP(character, amount, reason) {
  const se = character?.soulEconomy || { rp: 0, cp: 0, spendingLog: [] };
  return {
    ...se,
    cp: se.cp + amount,
    spendingLog: [...(se.spendingLog || []), { type: 'cp', amount, reason, timestamp: Date.now() }],
  };
}

export function getSoulTierEffects(rp, cp) {
  const tier = getSoulTier(rp, cp);
  return tier ? tier.effects : null;
}