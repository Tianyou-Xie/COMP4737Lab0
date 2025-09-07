// LayoutManager.js
// Responsible for positioning tiles inside the game arena, avoiding header and bottom overflow.

export class LayoutManager {
  /**
   * Create a LayoutManager for the given arena and header.
   * @param {HTMLElement} arena - The DOM container for tiles
   * @param {HTMLElement} header - The header element to avoid overlapping
   */
  constructor(arena, header) {
    this.arena = arena;
    this.header = header;
  }

  /** @returns {{width: number, height: number}} - Dimensions of arena */
  bounds() {
    const rect = this.arena.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  /**
   * Get a random (top,left) position where a tile can fit,
   * ensuring it does not overlap the header or exceed bottom boundary.
   * @param {import("./ButtonTile.js").ButtonTile} tile
   */
  randomPositionFor(tile) {
    const { width, height } = this.bounds();
    const { w, h } = tile.size();

    const headerHeight = this.header?.offsetHeight || 0; // avoid header
    const maxLeft = Math.max(0, width - w);
    const maxTop = Math.max(0, height - h - headerHeight);

    // Random left and top positions
    const left = Math.floor(Math.random() * (maxLeft + 1));
    const top = Math.floor(Math.random() * (maxTop + 1)) + headerHeight;

    return { left, top };
  }
}
