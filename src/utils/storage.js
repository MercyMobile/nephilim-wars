/**
 * Safe localStorage wrapper with error handling and validation
 * Prevents crashes from corrupted/malicious data
 */

/**
 * Safely retrieves and parses JSON from localStorage
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Value to return if key doesn't exist or parsing fails
 * @returns {*} - Parsed value or defaultValue
 */
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);

    // Key doesn't exist
    if (item === null) {
      return defaultValue;
    }

    // Try to parse JSON
    const parsed = JSON.parse(item);
    return parsed;

  } catch (error) {
    console.error(`Failed to retrieve ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely stores data as JSON in localStorage
 * @param {string} key - The localStorage key
 * @param {*} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
export function setInStorage(key, value) {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;

  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
    return false;
  }
}

/**
 * Safely removes an item from localStorage
 * @param {string} key - The localStorage key
 * @returns {boolean} - True if successful, false otherwise
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;

  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Validates character data structure
 * @param {*} data - The data to validate
 * @returns {boolean} - True if valid character data
 */
export function isValidCharacterData(data) {
  if (!data || typeof data !== 'object') return false;

  // Required top-level fields
  const requiredFields = ['name', 'lineage', 'sex', 'attributes'];

  for (const field of requiredFields) {
    if (!(field in data)) return false;
  }

  // Validate attributes object exists and has required stats
  if (!data.attributes || typeof data.attributes !== 'object') return false;

  const attributes = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  for (const attr of attributes) {
    if (!(attr in data.attributes)) return false;
    const value = parseInt(data.attributes[attr], 10);
    if (isNaN(value) || value < 3 || value > 30) return false; // Extended max to 30 for racial bonuses
  }

  return true;
}

/**
 * Safely retrieves character data from localStorage
 * @returns {object|null} - Character data or null if invalid/missing
 */
export function getCharacterData() {
  const data = getFromStorage('generatedCharacter', null);

  // Validate the structure
  if (!isValidCharacterData(data)) {
    console.warn('Invalid character data in localStorage, returning null');
    return null;
  }

  return data;
}

/**
 * Safely stores character data to localStorage
 * @param {object} characterData - The character data to store
 * @returns {boolean} - True if successful
 */
export function setCharacterData(characterData) {
  // Validate before saving
  if (!isValidCharacterData(characterData)) {
    console.error('Attempted to save invalid character data');
    return false;
  }

  return setInStorage('generatedCharacter', characterData);
}

// ====== PARTY MANAGEMENT ======

/**
 * Get all saved characters (party roster)
 * @returns {Array} - Array of character objects
 */
export function getPartyRoster() {
  const roster = getFromStorage('partyRoster', []);
  return Array.isArray(roster) ? roster.filter(isValidCharacterData) : [];
}

/**
 * Add a character to the party roster
 * @param {object} character - Character to add
 * @returns {boolean} - True if successful
 */
export function addToPartyRoster(character) {
  if (!isValidCharacterData(character)) {
    console.error('Invalid character data');
    return false;
  }

  const roster = getPartyRoster();

  // Check if character already exists (by name)
  const existingIndex = roster.findIndex(c => c.name === character.name);

  if (existingIndex >= 0) {
    // Update existing character
    roster[existingIndex] = { ...character, id: roster[existingIndex].id || `char-${Date.now()}` };
  } else {
    // Add new character with unique ID
    roster.push({ ...character, id: `char-${Date.now()}` });
  }

  return setInStorage('partyRoster', roster);
}

/**
 * Remove a character from the party roster
 * @param {string} characterId - ID of character to remove
 * @returns {boolean} - True if successful
 */
export function removeFromPartyRoster(characterId) {
  const roster = getPartyRoster();
  const filtered = roster.filter(c => c.id !== characterId);
  return setInStorage('partyRoster', filtered);
}

/**
 * Get active party (characters selected for combat)
 * @returns {Array} - Array of character IDs
 */
export function getActiveParty() {
  const party = getFromStorage('activeParty', []);
  return Array.isArray(party) ? party : [];
}

/**
 * Set active party for combat
 * @param {Array} characterIds - Array of character IDs
 * @returns {boolean} - True if successful
 */
export function setActiveParty(characterIds) {
  if (!Array.isArray(characterIds)) {
    console.error('Active party must be an array');
    return false;
  }

  // Limit to 8 characters
  const limitedParty = characterIds.slice(0, 8);
  return setInStorage('activeParty', limitedParty);
}
