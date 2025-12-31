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

  // Required fields
  const requiredFields = ['name', 'lineage', 'sex', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  for (const field of requiredFields) {
    if (!(field in data)) return false;
  }

  // Validate attribute ranges
  const attributes = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  for (const attr of attributes) {
    const value = parseInt(data[attr], 10);
    if (isNaN(value) || value < 3 || value > 20) return false;
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
