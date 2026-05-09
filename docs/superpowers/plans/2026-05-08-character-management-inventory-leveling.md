# Character Management, Inventory & Leveling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full inventory management, PF2e-style level progression (1-20), and a mobile-first tabbed Character Hub UI to Nephilim Wars.

**Architecture:** Single integrated CharacterHub component replaces both CharacterSheet.jsx and CreatorScreen.jsx. Data files in `src/data/` hold all game rules as static JS objects. Custom hooks (`useCharacter`, `useLevelUp`, `useInventory`) manage state and persist to localStorage. Six tabbed panels (Profile, Stats, Level, Inventory, Soul, Actions) provide the UI.

**Tech Stack:** React 19, Vite (rolldown), Tailwind CSS 3, no TypeScript, no test framework (manual verification).

---

## Phase 1: Data Foundation

### Task 1: Create Ancestry Data File

**Files:**
- Create: `src/data/ancestries.js`

- [ ] **Step 1: Create ancestries.js with all 11 ancestries**

Create `src/data/ancestries.js` containing the full `ANCESTRIES` export object with all 11 ancestries (Sethite, Cainite, Wanderer, Nephilim, Rephaim, Anakim, Gibborim, Horim, Elioud, Sorcerer, Gammadim). Each ancestry must include: name, description, hp, size, speed, abilityBoosts (array, 'Free' for player choice), abilityFlaw (null if none, string if fixed, 'Free' for player choice), startingRP, startingCP, traits (array of strings), heritages (array of objects with name and description), feats (object keyed by level 1/5/9/13/17, each value is array of feat objects with name and description), languages (array), heightRange (object with male/female arrays), and visuals (string for image prompt). Use the data from the manual (NEPHILIM_WARS_GAME_SYSTEM.md) and CharacterGenerator.jsx.

- [ ] **Step 2: Verify ancestries.js loads without errors**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds or no import errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/data/ancestries.js
git commit -m "feat: add ancestries data file with all 11 lineages"
```

### Task 2: Create Class Data File

**Files:**
- Create: `src/data/classes.js`

- [ ] **Step 1: Create classes.js with all 7 classes**

Create `src/data/classes.js` containing the full `CLASSES` export object with all 7 classes (Warrior, Gibbor, Hunter, Magi, Priest, Artisan, Scribe). Each class must include: name, description, keyAbility (string, or 'STR or DEX' for Warrior), hpPerLevel (number: Warrior 10, Gibbor 12, Hunter 8, Magi 6, Priest 8, Artisan 8, Scribe 6), startingGold (number from manual), armorProficiencies (array), weaponProficiencies (array), startingEquipmentOptions (array of objects with id/name/damageDice/damageType/properties from existing EQUIPMENT data in CharacterGenerator.jsx), and features (object keyed by level 1-20, each value is array of feature objects with name, description, actionCost). Use the manual and existing CharacterGenerator.jsx EQUIPMENT object as source.

- [ ] **Step 2: Verify classes.js loads without errors**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/classes.js
git commit -m "feat: add classes data file with all 7 classes and level features"
```

### Task 3: Create Equipment Data File

**Files:**
- Create: `src/data/equipment.js`

- [ ] **Step 1: Create equipment.js with all weapons, armor, and gear**

Create `src/data/equipment.js` exporting `WEAPONS`, `ARMOR`, `SHIELDS`, `GEAR`, and `CLASS_STARTING_PACKS`. WEAPONS is an array of objects from the manual's Bronze Age Weapons table (name, category 'melee'/'ranged', damageDice, damageType, properties array, price, bulk). ARMOR from the Bronze Age Armor table (name, acBonus, dexCap, strength, checkPenalty, speedPenalty, price, bulk, traits). SHIELDS (Bronze Shield: +2 AC, 10gp, 1 bulk). GEAR is an array of adventuring gear. CLASS_STARTING_PACKS maps class name to starting gold and equipment choice arrays. Include soulTag ('righteous'|'corrupt'|'neutral') on relevant items (Watcher-Carved Staff = corrupt, Blessed Bronze Staff = righteous, etc.).

- [ ] **Step 2: Verify equipment.js loads without errors**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/equipment.js
git commit -m "feat: add equipment data file with weapons, armor, and gear"
```

### Task 4: Create Backgrounds, Soul Tiers, and Level Progression Data Files

**Files:**
- Create: `src/data/backgrounds.js`
- Create: `src/data/soulTiers.js`
- Create: `src/data/levelProgression.js`

- [ ] **Step 1: Create backgrounds.js**

Export `BACKGROUNDS` array with all 20 backgrounds from the manual (Watcher's Apprentice, Tribal Elder, Bronze Smith, Temple Servant, Giant's Thrall, Wandering Prophet, Merchant of Enoch, Beast Tamer, Star Reader, Herb Cutter, Survivor of the Flood Plains, Nephilim Offspring, Keeper of the Scrolls, Hunter of Abominations, Penitent Cultist, Desert Nomad, River Fisher, Stone Mason, Tribal Scout, Sacred Dancer). Each has: value, label, boost (string, may contain ' or '), skill, lore, description, equipment (array of strings).

- [ ] **Step 2: Create soulTiers.js**

Export `SOUL_TIERS` array with tier objects: { name, minScore, maxScore, effects (object with description, divineMiracles, watcherMagic, initiativeModifier, saveBonus, rpCostMultiplier) }. Tiers: Blessed (+10+), Righteous (+3 to +9), Neutral (-2 to +2), Tainted (-3 to -9), Corrupted (-10 to -19), Forsaken (-20 and below). Also export `getSoulTier(rp, cp)` function that returns the matching tier object.

- [ ] **Step 3: Create levelProgression.js**

Export `LEVEL_PROGRESSION` object: array of 20 level objects, each with { level, xpToReach (1000 × (level-1)), hpGain (described as "classHitDie + CON mod"), abilityBoosts (boolean), ancestryFeat (boolean), skillTraining (boolean), proficiencyIncrease (boolean), classFeatureLevel (boolean) }. Also export `XP_TABLE` as a lookup object. Also export `getProficiencyBonus(level, rank)` where rank is 'untrained'|'trained'|'expert'|'master'|'legendary' — returns 0 for untrained, level+2 for trained, level+4 for expert, level+6 for master, level+8 for legendary.

- [ ] **Step 4: Verify all three files load without errors**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/backgrounds.js src/data/soulTiers.js src/data/levelProgression.js
git commit -m "feat: add backgrounds, soul tiers, and level progression data files"
```

---

## Phase 2: Utility Functions

### Task 5: Create Character Rules, Encumbrance, and Soul Economy Utilities

**Files:**
- Create: `src/utils/characterRules.js`
- Create: `src/utils/encumbrance.js`
- Create: `src/utils/soulEconomy.js`

- [ ] **Step 1: Create characterRules.js**

Export these functions:
- `getAbilityModifier(score)` — returns Math.floor((score - 10) / 2)
- `calculateMaxHP(ancestryHP, classHP, conMod, level)` — ancestryHP + classHP + conMod + (classHP + conMod) × (level - 1)
- `calculateAC(dexMod, armorBonus, shieldBonus, proficiencyBonus)` — 10 + dexMod (capped by armor dexCap) + armorBonus + shieldBonus + proficiencyBonus
- `calculateSave(abilityMod, level, rank)` — uses getProficiencyBonus from levelProgression.js
- `calculatePerception(wisMod, level, rank)` — same pattern
- `calculateInitiative(perceptionBonus, cpPenalty)` — perceptionBonus - cpPenalty
- `getStartingEquipment(className)` — returns the class's starting equipment options from classes.js
- `computeAllStats(character)` — takes a full character object, returns computed { ac, fortitude, reflex, will, perception, initiative, maxHP, speed, proficiencyBonus }

- [ ] **Step 2: Create encumbrance.js**

Export these functions:
- `getItemBulk(item)` — returns item.bulk (0 for negligible, 0.1 for Light, 1+ for standard)
- `getTotalBulk(inventory)` — sums all carried items' bulk (quantity × item.bulk) + equipped items' bulk
- `getEncumbranceThreshold(strModifier, hasPowerfulBuild)` — returns { light: number, medium: number, heavy: number } based on PF2e rules (Light = strMod/2 + 3, Medium = strMod + 6, Heavy = strMod×2 + 9, ×2 if PowerfulBuild)
- `getEncumbranceLevel(totalBulk, thresholds)` — returns 'none'|'light'|'medium'|'heavy'
- `getEncumbrancePenalty(level)` — returns { speedPenalty, checkPenalty } (none={0,0}, medium={-10,-1}, heavy={-20,-2})

- [ ] **Step 3: Create soulEconomy.js**

Import `SOUL_TIERS` from data/soulTiers.js. Export:
- `getNetRighteousness(rp, cp)` — returns rp - cp
- `getSoulTier(rp, cp)` — returns the matching tier object from SOUL_TIERS
- `canSpendRP(character, amount)` — returns true if character.soulEconomy.rp >= amount
- `canSpendCP(character, amount)` — always returns true (gaining CP is not optional per manual)
- `spendRP(character, amount, reason)` — returns updated soulEconomy object with RP reduced and log entry
- `gainRP(character, amount, reason)` — returns updated soulEconomy object
- `gainCP(character, amount, reason)` — returns updated soulEconomy object with CP increased and log entry
- `getSoulTierEffects(rp, cp)` — returns the effects object from the matching tier

- [ ] **Step 4: Verify utility files**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/utils/characterRules.js src/utils/encumbrance.js src/utils/soulEconomy.js
git commit -m "feat: add character rules, encumbrance, and soul economy utility functions"
```

---

## Phase 3: State Management Hooks

### Task 6: Create useCharacter, useLevelUp, and useInventory Hooks

**Files:**
- Create: `src/hooks/useCharacter.js`
- Create: `src/hooks/useLevelUp.js`
- Create: `src/hooks/useInventory.js`
- Modify: `src/utils/storage.js` (add getCompleteCharacter, setCompleteCharacter)

- [ ] **Step 1: Extend storage.js with new functions**

Add to `src/utils/storage.js`:
- `getCompleteCharacter()` — calls `getFromStorage('completeCharacter', null)` and validates with a new `isValidCompleteCharacter` function
- `setCompleteCharacter(data)` — calls `setInStorage('completeCharacter', data)`
- `isValidCompleteCharacter(data)` — validates the extended character structure (must have id, name, ancestry, class, level, attributes, inventory, soulEconomy, skills)

- [ ] **Step 2: Create useCharacter.js**

```js
// src/hooks/useCharacter.js
import { useState, useCallback } from 'react';
import { getCompleteCharacter, setCompleteCharacter } from '../utils/storage';
import { computeAllStats } from '../utils/characterRules';
import { getNetRighteousness, getSoulTier } from '../utils/soulEconomy';

const INITIAL_CHARACTER = null; // Will be populated from storage or creation flow

export function useCharacter() {
  const [character, setCharacter] = useState(() => {
    const saved = getCompleteCharacter();
    return saved;
  });

  const updateCharacter = useCallback((updates) => {
    setCharacter(prev => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      setCompleteCharacter(next);
      return next;
    });
  }, []);

  const createCharacter = useCallback((newChar) => {
    const withStats = {
      ...newChar,
      ...computeAllStats(newChar),
    };
    setCharacter(withStats);
    setCompleteCharacter(withStats);
    return withStats;
  }, []);

  const computedStats = character ? computeAllStats(character) : null;
  const soulTier = character ? getSoulTier(character.soulEconomy?.rp || 0, character.soulEconomy?.cp || 0) : null;

  return {
    character,
    computedStats,
    soulTier,
    updateCharacter,
    createCharacter,
  };
}
```

- [ ] **Step 3: Create useLevelUp.js**

```js
// src/hooks/useLevelUp.js
import { useCallback } from 'react';
import { LEVEL_PROGRESSION } from '../data/levelProgression';
import { CLASSES } from '../data/classes';
import { ANCESTRIES } from '../data/ancestries';

export function useLevelUp(character, updateCharacter) {
  const canLevelUp = useCallback(() => {
    if (!character) return false;
    const currentLevel = character.level || 1;
    if (currentLevel >= 20) return false;
    const nextLevelReq = LEVEL_PROGRESSION[currentLevel]; // XP needed for next level
    return (character.xp || 0) >= nextLevelReq?.xpToReach;
  }, [character]);

  const applyLevelUp = useCallback((levelUpChoices) => {
    if (!character) return null;
    const newLevel = (character.level || 1) + 1;
    const classData = CLASSES.find(c => c.value === character.class) || CLASSES[0];
    const ancestryData = ANCESTRIES[character.ancestry?.name] || ANCESTRIES.Sethite;
    
    // Apply HP gain
    const conMod = Math.floor(((character.attributes?.CON || 10) - 10) / 2);
    const hpGain = classData.hpPerLevel + conMod;
    
    const updated = {
      ...character,
      level: newLevel,
      maxHp: (character.maxHp || 0) + hpGain,
      hp: (character.hp || 0) + hpGain,
      ...(levelUpChoices.abilityBoosts ? { attributes: applyAbilityBoosts(character.attributes, levelUpChoices.abilityBoosts) } : {}),
      ...(levelUpChoices.ancestryFeat ? { ancestry: { ...character.ancestry, feats: [...(character.ancestry?.feats || []), levelUpChoices.ancestryFeat] } } : {}),
      ...(levelUpChoices.skillTraining ? { skills: { ...(character.skills || {}), [levelUpChoices.skillTraining]: 'trained' } } : {}),
    };
    
    updateCharacter(updated);
    return updated;
  }, [character, updateCharacter]);

  const getLevelUpOptions = useCallback((targetLevel) => {
    const progression = LEVEL_PROGRESSION[targetLevel - 1];
    if (!progression) return null;
    
    return {
      abilityBoosts: progression.abilityBoosts,
      ancestryFeat: progression.ancestryFeat,
      skillTraining: progression.skillTraining,
      classFeature: progression.classFeatureLevel,
    };
  }, []);

  return { canLevelUp, applyLevelUp, getLevelUpOptions };
}

function applyAbilityBoosts(attrs, boosts) {
  const updated = { ...attrs };
  boosts.forEach(stat => {
    if (updated[stat] !== undefined) {
      updated[stat] = updated[stat] >= 18 ? updated[stat] + 1 : updated[stat] + 2;
    }
  });
  return updated;
}
```

- [ ] **Step 4: Create useInventory.js**

```js
// src/hooks/useInventory.js
import { useCallback } from 'react';
import { getTotalBulk, getEncumbranceThreshold, getEncumbranceLevel } from '../utils/encumbrance';
import { EQUIPMENT_SLOTS } from '../data/equipment';

export function useInventory(character, updateCharacter) {
  const inventory = character?.inventory || { gold: 0, items: [], equipped: {} };

  const getEquippedItem = useCallback((slot) => {
    return inventory.equipped?.[slot] || null;
  }, [inventory]);

  const equipItem = useCallback((itemId, slot) => {
    const item = inventory.items.find(i => i.id === itemId);
    if (!item) return;
    
    const currentEquipped = { ...(inventory.equipped || {}) };
    // If something is already in that slot, unequip it back to items
    if (currentEquipped[slot]) {
      inventory.items.push(currentEquipped[slot]);
    }
    // Remove item from backpack and place in slot
    const newItems = inventory.items.filter(i => i.id !== itemId);
    currentEquipped[slot] = item;
    
    updateCharacter({
      ...character,
      inventory: { ...inventory, items: newItems, equipped: currentEquipped },
    });
  }, [character, inventory, updateCharacter]);

  const unequipItem = useCallback((slot) => {
    const currentEquipped = { ...(inventory.equipped || {}) };
    const item = currentEquipped[slot];
    if (!item) return;
    
    delete currentEquipped[slot];
    const newItems = [...(inventory.items || []), item];
    
    updateCharacter({
      ...character,
      inventory: { ...inventory, items: newItems, equipped: currentEquipped },
    });
  }, [character, inventory, updateCharacter]);

  const addItem = useCallback((item) => {
    const newItems = [...(inventory.items || []), item];
    updateCharacter({
      ...character,
      inventory: { ...inventory, items: newItems },
    });
  }, [character, inventory, updateCharacter]);

  const removeItem = useCallback((itemId) => {
    const newItems = (inventory.items || []).filter(i => i.id !== itemId);
    updateCharacter({
      ...character,
      inventory: { ...inventory, items: newItems },
    });
  }, [character, inventory, updateCharacter]);

  const adjustGold = useCallback((amount) => {
    updateCharacter({
      ...character,
      inventory: { ...inventory, gold: Math.max(0, (inventory.gold || 0) + amount) },
    });
  }, [character, inventory, updateCharacter]);

  const bulkInfo = (() => {
    const strMod = Math.floor(((character?.attributes?.STR || 10) - 10) / 2);
    const hasPowerfulBuild = ['Nephilim', 'Gibborim'].includes(character?.ancestry?.name);
    const totalBulk = getTotalBulk(inventory);
    const thresholds = getEncumbranceThreshold(strMod, hasPowerfulBuild);
    const level = getEncumbranceLevel(totalBulk, thresholds);
    return { totalBulk, thresholds, level, maxBulk: thresholds.heavy };
  })();

  return {
    inventory,
    getEquippedItem,
    equipItem,
    unequipItem,
    addItem,
    removeItem,
    adjustGold,
    bulkInfo,
  };
}
```

- [ ] **Step 5: Verify hooks compile**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds (hooks are not yet imported from any component, so they should compile fine as dead code).

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useCharacter.js src/hooks/useLevelUp.js src/hooks/useInventory.js src/utils/storage.js
git commit -m "feat: add character state management hooks and storage extensions"
```

---

## Phase 4: Character Hub UI

### Task 7: Create CharacterHub Container and ProfileTab

**Files:**
- Create: `src/components/CharacterHub/CharacterHub.jsx`
- Create: `src/components/CharacterHub/ProfileTab.jsx`

- [ ] **Step 1: Create CharacterHub.jsx**

A mobile-first tab container component. Uses `useCharacter` hook. Has bottom tab bar on mobile (`<768px`), side tabs on desktop. Tabs: Profile, Stats, Level, Inventory, Soul, Actions. Renders the active tab component. On creation mode (no character yet), renders the ProfileTab in creation mode.

The component should:
- Import and use `useCharacter`, `useLevelUp`, `useInventory` hooks
- Manage `activeTab` state defaulting to 'profile'
- Show a bottom navigation bar on mobile, side navigation on desktop (using responsive Tailwind classes)
- Pass character data and hooks down to tab components
- Match the existing app's dark theme (bg-[#0c0a09], amber/gold accents, Cinzel headings, EB Garamond body)

- [ ] **Step 2: Create ProfileTab.jsx**

The Profile tab shows: character portrait (large), name, ancestry + heritage, class + level, background, and a header with RP/CP badges. In creation mode, it shows the character creation flow (race select, class select, background select, ability score allocation, name input, portrait generation) adapted from the existing CharacterGenerator.jsx logic but integrated into the hub.

It should:
- Display portrait with hover grayscale effect (matching existing CharacterSheet.jsx)
- Show ancestry traits as badges
- Show class features list
- RP/CP display with colored badges (blue for RP, red for CP)
- "Edit" button to enter creation/edit mode
- "Level Up" button (shown when XP threshold is met)
- Creation mode adapts the RACES, CLASSES, GAME_BACKGROUNDS data and PF2e boost computation from CharacterGenerator.jsx

- [ ] **Step 3: Verify components render**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build 2>&1 | Select-Object -First 20`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/CharacterHub/CharacterHub.jsx src/components/CharacterHub/ProfileTab.jsx
git commit -m "feat: add CharacterHub container and ProfileTab"
```

### Task 8: Create StatsTab and ProgressBar

**Files:**
- Create: `src/components/CharacterHub/StatsTab.jsx`
- Create: `src/components/CharacterHub/ProgressBar.jsx`

- [ ] **Step 1: Create ProgressBar.jsx**

A reusable progress bar component with props: `value`, `max`, `color` (Tailwind color class), `label`, `showValue` (boolean). Used for HP bars, XP bars, encumbrance bars. Renders a horizontal bar with fill percentage, label, and current/max values.

- [ ] **Step 2: Create StatsTab.jsx**

The Stats tab displays:
- 6 ability scores in a responsive grid (3×2 on mobile, 6-column on desktop) showing score, modifier badge, and ability name
- Vitals section: HP (with ProgressBar), AC, Initiative, Speed
- Saving Throws: Fortitude, Reflex, Will (with proficiency badges)
- Perception score
- Proficiency bonus display
- All values are computed from character data using `computeAllStats`

Uses StatBlock subcomponent for each ability score display (colored modifier badge matching existing CharacterSheet style).

- [ ] **Step 3: Verify build**

```bash
cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/CharacterHub/StatsTab.jsx src/components/CharacterHub/ProgressBar.jsx
git commit -m "feat: add StatsTab and ProgressBar components"
```

### Task 9: Create LevelTab and LevelUpWizard

**Files:**
- Create: `src/components/CharacterHub/LevelTab.jsx`
- Create: `src/components/CharacterHub/LevelUpWizard.jsx`

- [ ] **Step 1: Create LevelTab.jsx**

The Level tab shows:
- Visual progression tree: vertical path of 20 nodes, current level glows gold (`text-amber-400`, `shadow-[0_0_15px_rgba(245,158,11,0.5)]`), future levels dim (`text-stone-600`), past levels solid (`text-amber-500`)
- Each node shows: level number, class feature name (if any at that level), ancestry feat slot (if any)
- Clicking a future level node shows a tooltip/panel with what you'd gain at that level
- XP bar at top using ProgressBar component
- "Level Up" button (gold gradient, pulsing animation when available) that opens the LevelUpWizard modal
- Current level summary panel showing: level, XP, next level XP, proficiency bonus

- [ ] **Step 2: Create LevelUpWizard.jsx**

A step-by-step modal/wizard component for leveling up. Steps (each on its own page):
1. **Overview**: Show what level you're advancing to, XP threshold, and a summary of gains
2. **Ancestry Feat** (if level grants one): Show available ancestry feats for this level, let user pick one
3. **Ability Boosts** (if level grants them): Let user select 4 different ability scores to boost (+2 each, or +1 if 18+)
4. **Skill Training** (if level grants one): Let user select a skill to become trained in
5. **Class Feature** (if level grants one): Show the class feature gained (display-only, no choice needed)
6. **Confirm**: Review all choices, show before/after stat comparison, confirm button

The wizard should use the `useLevelUp` hook for validation and application. It should have Previous/Next navigation and prevent advancing without required selections.

- [ ] **Step 3: Verify build**

```bash
cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/CharacterHub/LevelTab.jsx src/components/CharacterHub/LevelUpWizard.jsx
git commit -m "feat: add LevelTab progression tree and LevelUpWizard"
```

### Task 10: Create InventoryTab, EquipmentSlots, and ItemCard

**Files:**
- Create: `src/components/CharacterHub/InventoryTab.jsx`
- Create: `src/components/CharacterHub/EquipmentSlots.jsx`
- Create: `src/components/CharacterHub/ItemCard.jsx`

- [ ] **Step 1: Create ItemCard.jsx**

A small card component for inventory items. Props: `item` (InventoryItem object), `onEquip` (function), `onDrop` (function), `onView` (function), `compact` (boolean for grid vs list view). Shows item name, quantity badge, bulk indicator, and soulTag glow (blue border for righteous, red for corrupt, default stone for neutral). On mobile, it's a compact list item. On desktop, it's a card with more detail.

- [ ] **Step 2: Create EquipmentSlots.jsx**

A visual equipment diagram showing a stylized character silhouette in the center with 9 equipment slots radiating outward: weapon (right hand), armor (torso), shield (left hand), head (top), body (chest), hands (gloves area), feet (boots area), ring (left ring finger), amulet (neck). Uses an SVG or div-based layout.

Each slot shows:
- Empty: Dotted border outline with slot label and a "+" icon
- Equipped: Item name, small icon, tap/click to view details or unequip
- Items with `soulTag === 'corrupt'` get a subtle red pulse/glow
- Items with `soulTag === 'righteous'` get a subtle blue pulse/glow

On mobile (<640px), collapses to a simple list of slots with equipped item names instead of the diagram.

Uses `useInventory` hook for equip/unequip operations.

- [ ] **Step 3: Create InventoryTab.jsx**

The Inventory tab shows:
- **Top section**: Equipment slot diagram (EquipmentSlots component)
- **Gold counter**: Prominent gold display with +/- buttons (matching the existing gold/amber color theme)
- **Encumbrance bar**: ProgressBar showing current bulk vs. max, colored green/yellow/red based on encumbrance level, with penalty text
- **Backpack grid**: Responsive grid of ItemCard components for all items in `inventory.items`
- **Filter row**: Category filter buttons (All, Weapons, Armor, Consumables, Gear, Treasure)
- **Add item button**: Opens a searchable dropdown/popover of all equipment from `equipment.js` data file to add to inventory

The tab uses `useInventory` hook for all item operations and `bulkInfo` for encumbrance display.

- [ ] **Step 4: Verify build**

```bash
cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build
```

- [ ] **Step 5: Commit**

```bash
git add src/components/CharacterHub/InventoryTab.jsx src/components/CharacterHub/EquipmentSlots.jsx src/components/CharacterHub/ItemCard.jsx
git commit -m "feat: add InventoryTab with equipment slots and item cards"
```

### Task 11: Create SoulTab

**Files:**
- Create: `src/components/CharacterHub/SoulTab.jsx`

- [ ] **Step 1: Create SoulTab.jsx**

The Soul tab shows:
- **Main display**: Large RP and CP counters side by side, RP in blue theme (`bg-blue-900/30 border-blue-600`), CP in red theme (`bg-red-900/30 border-red-800`)
- **Net Righteousness score**: Computed RP - CP, displayed prominently with tier name and tier effects
- **Tier indicator**: Colored badge showing current tier (Blessed=gold, Righteous=blue, Neutral=stone, Tainted=orange, Corrupted=red, Forsaken=dark red)
- **Spending log**: Scrollable list of recent RP/CP transactions with timestamp, type (RP gain/spend, CP gain), reason, and amount
- **RP/CP adjustment buttons**: +/- buttons for manual RP and CP tracking (for GM use), with confirmation dialog for large changes
- **Ability thresholds**: List of class features/feats that require specific RP thresholds, shown as locked/unlocked based on current RP
- **Soul economy rules reference**: Collapsible section explaining RP/CP mechanics

Uses `getNetRighteousness`, `getSoulTier`, `getSoulTierEffects` from `soulEconomy.js`.

- [ ] **Step 2: Verify build**

```bash
cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CharacterHub/SoulTab.jsx
git commit -m "feat: add SoulTab for RP/CP tracking and tier display"
```

### Task 12: Create ActionsTab and StatBlock

**Files:**
- Create: `src/components/CharacterHub/ActionsTab.jsx`
- Create: `src/components/CharacterHub/StatBlock.jsx`

- [ ] **Step 1: Create StatBlock.jsx**

A reusable component for displaying a single ability score or stat. Props: `label` (string), `value` (number), `modifier` (number string like "+3"), `color` (string, default 'amber'). Used in StatsTab for each of the 6 ability scores. Displays:
- Large centered number (the score)
- Small modifier badge in top-right corner
- Label below in small uppercase tracking-wider text
- Background: `bg-white/5 border border-[#333]` matching existing style
- Hover: `hover:bg-white/10 transition-colors`

- [ ] **Step 2: Create ActionsTab.jsx**

The Actions tab shows:
- **Combat Actions**: List of equipped weapon actions and class feature actions, adapted from the existing ActionDeck.jsx pattern. Each action shows: name, type icon (melee sword, ranged bow, spell book, miracle halo), action cost (1-3 AP icons), damage dice and type, to-hit bonus.
- **Available Spells/Miracles**: Based on class and level, show available spell/miracle lists. Magi see Forbidden Sorcery spells with CP risk indicators. Priests see Divine Miracles with RP cost indicators.
- **Ancestry Feats**: Active ancestry feats with their effects.
- Each action card uses the existing amber/stone color theme and can be clicked to expand for details.

- [ ] **Step 3: Verify build**

```bash
cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/CharacterHub/ActionsTab.jsx src/components/CharacterHub/StatBlock.jsx
git commit -m "feat: add ActionsTab and StatBlock components"
```

---

## Phase 5: Integration

### Task 13: Integrate CharacterHub into App.jsx and Update Navigation

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add CharacterHub import and route in App.jsx**

In `src/App.jsx`:
1. Add import: `import CharacterHub from './components/CharacterHub/CharacterHub';`
2. Add a new navigation button: `<NavButton label="📜 Character" isActive={currentView === 'character'} onClick={() => setCurrentView('character')} />`
3. Add the view rendering: `{currentView === 'character' && <CharacterHub />}` in the content area
4. Keep the existing "Create Character" button that navigates to the generator, but add the "Character" button that opens CharacterHub for the current character

- [ ] **Step 2: Update the "Create Character" flow to save to the new format**

In the `handleCharacterReady` function, after calling `setCharacterData` and `addToPartyRoster`, also save using `setCompleteCharacter` with the full character data format including inventory, soulEconomy, skills, and level fields.

- [ ] **Step 3: Verify the app loads and both navigation paths work**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite dev`
Open browser, verify: "Character" nav button appears, CharacterHub loads without errors, existing navigation still works.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: integrate CharacterHub into app navigation"
```

### Task 14: Update combatTypes.js and Ensure Backward Compatibility

**Files:**
- Modify: `src/types/combatTypes.js`

- [ ] **Step 1: Add inventory and level fields to Combatant**

Add these optional fields to the `Combatant` interface/comment in `src/types/combatTypes.js`:
```js
// Level & Soul Economy (extended)
level: number,
soulTier: string,

// Inventory (extended)
inventory: {
  gold: number,
  items: InventoryItem[],
  equipped: object,
},
```

Also add an `InventoryItem` type comment:
```js
// InventoryItem type
// { id, name, category, quantity, bulk, description, level, price, damageDice, damageType, properties, soulTag, source }
```

These are comments/documentation only since the project doesn't use TypeScript — they serve as type hints for developers.

- [ ] **Step 2: Verify all existing functionality still works**

Run: `cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars && npx vite build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/combatTypes.js
git commit -m "docs: add inventory and level fields to Combatant type comments"
```

### Task 15: Final Verification and Build

**Files:**
- All modified/created files

- [ ] **Step 1: Run full build verification**

```bash
cd C:\Users\velez\OneDrive\Desktop\AI_Tools\Nephilim-Wars
npx vite build
```
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run linter**

```bash
npx eslint src/data src/hooks src/utils/characterRules.js src/utils/encumbrance.js src/utils/soulEconomy.js src/components/CharacterHub
```
Expected: No critical errors. Warnings are acceptable.

- [ ] **Step 3: Manual browser testing checklist**

Open `npx vite dev` and verify:
1. Navigation: "Character" button visible and clickable
2. CharacterHub renders with 6 tabs (Profile, Stats, Level, Inventory, Soul, Actions)
3. Profile tab shows character data
4. Stats tab shows computed ability scores and derived stats
5. Level tab shows progression tree
6. Inventory tab shows equipment slots and backpack grid
7. Soul tab shows RP/CP counters and tier
8. Actions tab shows combat actions
9. Bottom tab bar visible on narrow viewport, side tabs on wide viewport
10. Existing features (Combat, Dice, Scribe, etc.) still work

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete character management hub with inventory, leveling, and soul economy"
```