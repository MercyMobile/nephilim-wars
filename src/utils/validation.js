/**
 * Input validation utilities for Nephilim Wars
 * Prevents malicious input and ensures data integrity
 */

/**
 * Validates and sanitizes character name input
 * @param {string} name - The character name to validate
 * @returns {string} - Sanitized name or empty string if invalid
 */
export function validateCharacterName(name) {
  if (typeof name !== 'string') return '';

  // Remove any HTML/script tags
  const sanitized = name.replace(/<[^>]*>/g, '');

  // Limit to 50 characters
  const truncated = sanitized.slice(0, 50);

  // Only allow letters, numbers, spaces, hyphens, and apostrophes
  const cleaned = truncated.replace(/[^a-zA-Z0-9\s\-']/g, '');

  return cleaned.trim();
}

/**
 * Validates character attribute values (STR, DEX, CON, etc.)
 * @param {number|string} value - The attribute value to validate
 * @param {number} min - Minimum allowed value (default: 3)
 * @param {number} max - Maximum allowed value (default: 20)
 * @returns {number} - Clamped value within valid range
 */
export function validateAttribute(value, min = 3, max = 20) {
  const num = parseInt(value, 10);

  // Return minimum if not a valid number
  if (isNaN(num)) return min;

  // Clamp between min and max
  return Math.max(min, Math.min(max, num));
}

/**
 * Validates custom visuals/description text
 * @param {string} text - The text to validate
 * @param {number} maxLength - Maximum allowed length (default: 500)
 * @returns {string} - Sanitized and truncated text
 */
export function validateDescription(text, maxLength = 500) {
  if (typeof text !== 'string') return '';

  // Remove HTML tags
  const sanitized = text.replace(/<[^>]*>/g, '');

  // Truncate to max length
  return sanitized.slice(0, maxLength);
}

/**
 * Validates dice notation (e.g., "2d6", "1d20+5")
 * @param {string} notation - The dice notation to validate
 * @returns {boolean} - True if valid dice notation
 */
export function validateDiceNotation(notation) {
  if (typeof notation !== 'string') return false;

  // Valid formats: "XdY", "XdY+Z", "XdY-Z"
  // X (dice count): 1-99
  // Y (die size): 2, 3, 4, 6, 8, 10, 12, 20, 100
  // Z (modifier): 0-99
  const dicePattern = /^([1-9][0-9]?)d(2|3|4|6|8|10|12|20|100)([+-][0-9]{1,2})?$/;

  return dicePattern.test(notation);
}

/**
 * Validates HP value
 * @param {number|string} value - The HP value to validate
 * @param {number} max - Maximum HP (optional)
 * @returns {number} - Valid HP value (non-negative)
 */
export function validateHP(value, max = null) {
  const num = parseInt(value, 10);

  if (isNaN(num)) return 0;

  // Can't be negative
  const positive = Math.max(0, num);

  // Cap at max HP if provided
  if (max !== null) {
    return Math.min(positive, max);
  }

  return positive;
}

/**
 * Validates defense/armor class value
 * @param {number|string} value - The defense value to validate
 * @returns {number} - Valid defense value (10-30 range)
 */
export function validateDefense(value) {
  const num = parseInt(value, 10);

  if (isNaN(num)) return 10;

  // Reasonable range for defense in d20 systems
  return Math.max(10, Math.min(30, num));
}

/**
 * Validates lineage selection
 * @param {string} lineage - The lineage to validate
 * @returns {string} - Valid lineage or default
 */
export function validateLineage(lineage) {
  const validLineages = ['Sethite', 'Cainite', 'Nephilim', 'Rephaim', 'Gibborim'];

  if (validLineages.includes(lineage)) {
    return lineage;
  }

  return 'Sethite'; // Default to Sethite if invalid
}

/**
 * Validates sex/gender selection
 * @param {string} sex - The sex to validate
 * @returns {string} - Valid sex or default
 */
export function validateSex(sex) {
  const validOptions = ['male', 'female'];

  if (validOptions.includes(sex)) {
    return sex;
  }

  return 'male'; // Default if invalid
}
