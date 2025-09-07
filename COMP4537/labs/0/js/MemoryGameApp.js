// js/MemoryGameApp.js
// Disclosure: Parts of this project were created with assistance from ChatGPT.

import { MESSAGES } from "../lang/messages/en/user.js";
import { Utils } from "./Utils.js";
import { LayoutManager } from "./layoutManager.js";
import { ButtonTile } from "./ButtonTile.js";

/**
 * Main class controlling the Memory Game logic and UI.
 */
export class MemoryGameApp {
  /**
   * Initialize game elements, bind events, and set initial status.
   */
  constructor() {
    this.arena = document.getElementById("arena");
    this.status = document.getElementById("status");
    this.countInput = document.getElementById("countInput");
    this.startBtn = document.getElementById("startBtn");
    this.countLabel = document.getElementById("countLabel");

    this.countLabel.textContent = MESSAGES.LABEL_HOW_MANY;
    this.startBtn.textContent = MESSAGES.BTN_GO;
    this.countInput.setAttribute("placeholder", MESSAGES.PLACEHOLDER_RANGE);
    this.setStatus(MESSAGES.STATUS_READY);

    // Pass the arena and header to LayoutManager for positioning tiles
    this.layout = new LayoutManager(this.arena, document.querySelector(".app-header"));

    this.tiles = [];
    this.clickIndex = 0;
    this._timeouts = [];
    this._scrambleCount = 0;
    this._isScrambling = false;

    // Bind button and input events
    this.startBtn.addEventListener("click", () => this.start());
    this.countInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.startBtn.click();
    });
  }

  /**
   * Update the status text displayed to the player.
   * @param {string} msg - Message to display.
   */
  setStatus(msg) {
    this.status.textContent = msg;
  }

  /**
   * Reset game state and arena to prepare for a new round.
   */
  reset() {
    // Clear any pending timeouts
    for (const t of this._timeouts) clearTimeout(t);
    this._timeouts = [];

    this._scrambleCount = 0;
    this._isScrambling = false;
    this.clickIndex = 0;
    this.tiles = [];

    // Clear arena and reset layout styles
    this.arena.innerHTML = "";
    this.arena.style.display = "";
    this.arena.style.flexWrap = "";
    this.arena.style.justifyContent = "";
    this.arena.style.alignItems = "";
    this.arena.style.gap = "";
  }

  /**
   * Create a set of ButtonTile instances with random colors.
   * @param {number} n - Number of tiles to create.
   */
  createTiles(n) {
    this.tiles = [];
    for (let i = 1; i <= n; i++) {
      const tile = new ButtonTile(i, Utils.randomColor());
      this.tiles.push(tile);
    }
  }

  /**
   * Prepare arena for the memorize stage:
   * - Use flexbox layout to center tiles horizontally and vertically
   * - Allow multiple lines if needed
   * - Show tile numbers
   */
  prepareForMemorize() {
    this.arena.innerHTML = "";
    this.arena.style.display = "flex";
    this.arena.style.flexWrap = "wrap";
    this.arena.style.justifyContent = "center";
    this.arena.style.alignItems = "center";
    this.arena.style.alignContent = "center"; // vertical center for multi-line
    this.arena.style.gap = "8px";

    for (const tile of this.tiles) {
      tile.el.style.position = "static"; // disable absolute positioning for flex layout
      tile.setRevealed(true);
      this.arena.appendChild(tile.el);
    }
  }

  /**
   * Make all tiles clickable and reset click index to 1.
   */
  makeClickable() {
    this.clickIndex = 1;
    for (const t of this.tiles) {
      t.enable();
      t.el.addEventListener("click", this._onTileClick);
    }
  }

  /**
   * Disable all tiles to prevent further clicks.
   */
  freezeClickable() {
    for (const t of this.tiles) {
      t.disable();
      t.el.removeEventListener("click", this._onTileClick);
    }
  }

  /**
   * Handle tile click events.
   * Checks if the correct tile was clicked and updates game state.
   * @param {MouseEvent} ev
   */
  _onTileClick = (ev) => {
    if (this._isScrambling) return;

    const order = Number(ev.currentTarget.dataset.order);

    if (order === this.clickIndex) {
      const tile = this.tiles.find((t) => t.order === order);
      tile.setRevealed(true);
      this.clickIndex++;

      // If all tiles clicked in order, show success
      if (this.clickIndex > this.tiles.length) {
        this.setStatus(MESSAGES.STATUS_EXCELLENT);
        this.freezeClickable();
      }
    } else {
      // Wrong click, reveal all tiles and freeze
      this.setStatus(MESSAGES.STATUS_WRONG);
      this.tiles.forEach((t) => t.setRevealed(true));
      this.freezeClickable();
    }
  };

  /**
   * Start the recall stage: hide all tiles and allow player to click in order.
   */
  startRecallPhase() {
    for (const t of this.tiles) t.setRevealed(false);
    this.makeClickable();
    this.setStatus(MESSAGES.STATUS_CLICK_NOW);
  }

  /**
   * Scramble the tiles using absolute positioning.
   * @param {number} i - Current scramble iteration
   * @param {number} total - Total number of scrambles
   */
  doOneScramble(i, total) {
    this._isScrambling = true;
    this.setStatus(MESSAGES.STATUS_SCRAMBLING(i, total));

    for (const tile of this.tiles) {
      tile.el.style.position = "absolute"; // enable absolute positioning
      const pos = this.layout.randomPositionFor(tile); // safe positions inside arena
      tile.setPosition(pos.top, pos.left);
    }
  }

  /**
   * Run the scrambling sequence for a given number of times.
   * @param {number} times - Number of scrambles
   * @param {number} intervalMs - Time interval between scrambles in ms
   */
  runScrambles(times, intervalMs) {
    const loop = () => {
      this._scrambleCount++;
      this.doOneScramble(this._scrambleCount, times);

      if (this._scrambleCount < times) {
        this._timeouts.push(setTimeout(loop, intervalMs));
      } else {
        // Finish scrambling and start recall phase
        this._timeouts.push(
          setTimeout(() => {
            this._isScrambling = false;
            this.startRecallPhase();
          }, intervalMs)
        );
      }
    };
    loop();
  }

  /**
   * Start a new game round:
   * - Parse tile count
   * - Reset previous game
   * - Create tiles and display memorize stage
   * - Start scramble stage after a short delay
   */
  start() {
    const n = Utils.parseCount(this.countInput.value);
    if (!n) return this.setStatus(MESSAGES.ERROR_RANGE);

    this.reset();
    this.createTiles(n);
    this.prepareForMemorize(); // show tiles in flexbox layout
    this.setStatus(MESSAGES.STATUS_MEMORIZE(n));

    setTimeout(() => {
      this.runScrambles(n, 2000);
    }, n * 1000);
  }

  /**
   * Set initial game status when the page loads.
   */
  run() {
    this.setStatus(MESSAGES.STATUS_READY);
  }
}
