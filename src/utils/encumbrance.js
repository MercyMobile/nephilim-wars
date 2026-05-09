export function getItemBulk(item) {
  return item?.bulk ?? 0;
}

export function getTotalBulk(inventory) {
  if (!inventory) return 0;
  let total = 0;
  const items = inventory.items || [];
  for (const item of items) {
    total += getItemBulk(item) * (item.quantity || 1);
  }
  const equipped = inventory.equipped || {};
  for (const slot of Object.values(equipped)) {
    if (slot) total += getItemBulk(slot);
  }
  return total;
}

export function getEncumbranceThreshold(strModifier, hasPowerfulBuild = false) {
  let mult = hasPowerfulBuild ? 2 : 1;
  const effectiveStr = strModifier;
  const light = Math.max(1, Math.floor(effectiveStr / 2) + 3) * mult;
  const medium = Math.max(1, (effectiveStr + 6)) * mult;
  const heavy = Math.max(1, (effectiveStr * 2 + 9)) * mult;
  return { light: Math.max(1, light), medium: Math.max(1, medium), heavy: Math.max(1, heavy) };
}

export function getEncumbranceLevel(totalBulk, thresholds) {
  if (!thresholds) return 'none';
  if (totalBulk >= thresholds.heavy) return 'heavy';
  if (totalBulk >= thresholds.medium) return 'medium';
  if (totalBulk >= thresholds.light) return 'light';
  return 'none';
}

export function getEncumbrancePenalty(level) {
  switch (level) {
    case 'medium':
      return { speedPenalty: -10, checkPenalty: -1 };
    case 'heavy':
      return { speedPenalty: -20, checkPenalty: -2 };
    default:
      return { speedPenalty: 0, checkPenalty: 0 };
  }
}