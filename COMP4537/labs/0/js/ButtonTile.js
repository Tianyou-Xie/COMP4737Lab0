// ButtonTile.js
// A single memory game tile represented by a <button> element.

export class ButtonTile {
  /**
   * Create a new ButtonTile instance.
   * @param {number} order - The order number of this tile (1..N).
   * @param {string} color - Background color in CSS format (e.g., hsl string).
   */
  constructor(order, color) {
    this.order = order;
    this.color = color;

    // Create button DOM element
    this.el = document.createElement("button");
    this.el.className = "memory-btn";
    this.el.style.background = color;
    this.el.textContent = String(order);
    this.el.dataset.order = String(order);

    this.disable(); // Initially disabled
  }

  /** Enable this tile so it can be clicked */
  enable() {
    this.el.disabled = false;
    this.el.classList.remove("disabled");
  }

  /** Disable this tile to prevent clicking */
  disable() {
    this.el.disabled = true;
    this.el.classList.add("disabled");
  }

  /**
   * Show or hide the tile’s order number.
   * @param {boolean} flag - true to reveal, false to hide
   */
  setRevealed(flag) {
    this.el.textContent = flag ? String(this.order) : "";
    this.el.classList.toggle("revealed", flag);
  }

  /**
   * Position the tile at specific coordinates inside the arena.
   * @param {number} top
   * @param {number} left
   */
  setPosition(top, left) {
    this.el.style.top = `${top}px`;
    this.el.style.left = `${left}px`;
  }

  /**
   * Get the current size of this tile (used for layout).
   * @returns {{w: number, h: number}}
   */
  size() {
    return { w: this.el.offsetWidth, h: this.el.offsetHeight };
  }
}
