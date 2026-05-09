import { useMemo, useCallback } from 'react';
import { getTotalBulk, getEncumbranceThreshold, getEncumbranceLevel } from '../utils/encumbrance';

export function useInventory(character, updateCharacter) {
  const inventory = useMemo(() => character?.inventory || { items: [], equipped: {}, gold: 0 }, [character?.inventory]);

  const getEquippedItem = useCallback((slot) => {
    return inventory.equipped?.[slot] || null;
  }, [inventory.equipped]);

  const equipItem = useCallback((itemId, slot) => {
    const items = [...(inventory.items || [])];
    const equipped = { ...(inventory.equipped || {}) };
    const itemIndex = items.findIndex(it => it.id === itemId);
    if (itemIndex === -1) return;

    const item = items[itemIndex];
    items.splice(itemIndex, 1);

    if (equipped[slot]) {
      items.push(equipped[slot]);
    }

    equipped[slot] = item;

    updateCharacter(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items, equipped },
    }));
  }, [inventory.items, inventory.equipped, updateCharacter]);

  const unequipItem = useCallback((slot) => {
    const items = [...(inventory.items || [])];
    const equipped = { ...(inventory.equipped || {}) };

    if (equipped[slot]) {
      items.push(equipped[slot]);
      delete equipped[slot];
    }

    updateCharacter(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items, equipped },
    }));
  }, [inventory.items, inventory.equipped, updateCharacter]);

  const addItem = useCallback((item) => {
    const items = [...(inventory.items || []), item];

    updateCharacter(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items },
    }));
  }, [inventory.items, updateCharacter]);

  const removeItem = useCallback((itemId) => {
    const items = (inventory.items || []).filter(it => it.id !== itemId);

    updateCharacter(prev => ({
      ...prev,
      inventory: { ...prev.inventory, items },
    }));
  }, [inventory.items, updateCharacter]);

  const adjustGold = useCallback((amount) => {
    const gold = Math.max(0, (inventory.gold || 0) + amount);

    updateCharacter(prev => ({
      ...prev,
      inventory: { ...prev.inventory, gold },
    }));
  }, [inventory.gold, updateCharacter]);

  const bulkInfo = useMemo(() => {
    const totalBulk = getTotalBulk(inventory);
    const strMod = Math.floor(((character?.attributes?.STR || 10) - 10) / 2);
    const thresholds = getEncumbranceThreshold(strMod, character?.ancestry?.key === 'Gammadim');
    const level = getEncumbranceLevel(totalBulk, thresholds);
    const maxBulk = thresholds.heavy;

    return { totalBulk, thresholds, level, maxBulk };
  }, [inventory, character]);

  return { getEquippedItem, equipItem, unequipItem, addItem, removeItem, adjustGold, bulkInfo };
}