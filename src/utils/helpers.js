/**
 * Formats time in seconds to display format
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
export const formatTime = seconds => {
  return `${Math.floor(seconds)}s`;
};

/**
 * Calculates percentage based on current and total values
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @returns {number} - Percentage (0-100)
 */
export const calculatePercentage = (current, total) => {
  if (total === 0) return 0;
  return Math.max(0, Math.min(100, (current / total) * 100));
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generates a unique ID
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = obj => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if two arrays are equal
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {boolean} - True if arrays are equal
 */
export const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
};
