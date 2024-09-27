import { get_style_rule_value, cursorHitTest } from "./helpers.js";
import { Resizable } from "./basic.js";
import { actions } from "./cursor.js";

class Draggable extends Resizable {
  isHit;
  #mouseIsDown;
  #cursorTempPos;
  constructor() {
    super();
  }

  init() {
    super.deinit();
    this.parent.canvasElem.addEventListener(
      "mousedown",
      this.mouseDown.bind(this)
    );
    this.parent.canvasElem.addEventListener("mousemove", this.move.bind(this));
    this.parent.canvasElem.addEventListener("mouseup", this.mouseUp.bind(this));
  }

  mouseUp(e) {
    this.#mouseIsDown = false;
    this.parent.operation = undefined;    
  }

  mouseDown(e) {
    
    if (this.parent.operation === undefined &&
      this.isHit &&
      this.topMost()

    ) {
      this.#mouseIsDown = true;
      this.#cursorTempPos = { x: e.x, y: e.y };
      this.parent.operation = {
        action: actions.MOVE,
        sourceId: this.id,
        targetId: undefined,
      };
    }
  }

  deinit() {
    this.removeEventLinstener("mousedown");
    this.removeEventLinstener("mouseup");
    this.removeEventLinstener("mousemove");
  }

  move(e) {
    if (
      this.parent.operation !== undefined &&
      this.parent.operation.action !== actions.MOVE &&
      this.parent.operation.sourceId !== this.id
    ) {
      return;
    }

    this.isHit = cursorHitTest(
      this.x,
      this.y,
      this.width,
      this.height,
      e.x,
      e.y
    );

    
    // drag
    if (
      // TODO: fix the issue with draging two overlaped elements
      // this.isTopMost &&

      this.#mouseIsDown &&

      
      this.#cursorTempPos !== undefined &&
      (this.#cursorTempPos.x !== e.x || this.#cursorTempPos.y !== e.y)
    ) {
      // TODO: calculate clear offset without removing other objects
      // or may be clear the whole canvas is better
      // this.parent.context.clearRect(this.x, this.y, this.width, this.height);
      const dx = e.x - this.#cursorTempPos.x;
      const dy = e.y - this.#cursorTempPos.y;
      this.x += dx;
      this.y += dy;
      this.draw();
    }

    this.#cursorTempPos = { x: e.x, y: e.y };
  }

  topMost() {
    const hitElements = this.parent.children.filter(
      (o) =>
        o.id !== this.id &&
        o.isHit &&
        o.zIndex > this.zIndex 
    );
    return hitElements.length === 0;
  }
}

export { Draggable };
