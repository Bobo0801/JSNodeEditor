/**
 * @module Draggable
 * @description This module is used to create draggable elements.
 * TODO: think of moving dragging logic from cursor object to this class
 */

import { get_style_rule_value, cursorHitTest } from "./helpers.js";
import { Resizable } from "./basic.js";
import { actions } from "./core.js";

class Draggable extends Resizable {
  isHit;
  isMovable = true;
  constructor() {
    super();
  }

  moveElement(newCursorPosition, oldCursorPosition) {
    
    const dx = newCursorPosition.x - oldCursorPosition.x;
    const dy = newCursorPosition.y - oldCursorPosition.y;
    this.x += (dx );
    this.y += (dy );
    
  

    this.draw();
  }

  moveT_o(x, y) {
    this.x = x;
    this.y = y;
    this.draw();
  }
}

export { Draggable };
