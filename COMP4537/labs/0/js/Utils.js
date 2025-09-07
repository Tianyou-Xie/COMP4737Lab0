// Utils.js
// Utility helper functions for random colors and input parsing.

export class Utils {
  /**
   * Generate a random HSL color string.
   * @returns {string} CSS hsl color
   */
  static randomColor() {
    const hue = Math.floor(Math.random() * 360);
    const sat = 70 + Math.floor(Math.random() * 20);  // 70–89%
    const light = 50 + Math.floor(Math.random() * 10); // 50–59%
    return `hsl(${hue} ${sat}% ${light}%)`;
  }

  /**
   * Parse a count from input value, ensuring it's between 3–7 inclusive.
   * Returns valid number or null if invalid.
   * @param {string} inputValue - User input string
   * @returns {number|null}
   */
  static parseCount(inputValue) {
    const n = Number(inputValue);
    return Number.isInteger(n) && n >= 3 && n <= 7 ? n : null;
  }
}
