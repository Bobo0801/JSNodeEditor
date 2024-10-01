import { get_style_rule_value, cursorHitTest } from "./helpers.js";
import { Resizable } from "./basic.js";
import { actions } from "./cursor.js";

class Draggable extends Resizable {
  isHit;
  isMovable = true;
  constructor() {
    super();
  }

  moveElement(newCursorPosition, oldCursorPosition) {
    const dx = newCursorPosition.x - oldCursorPosition.x;
    const dy = newCursorPosition.y - oldCursorPosition.y;
    this.x += dx;
    this.y += dy;
    this.draw();
  }
}

export { Draggable };
