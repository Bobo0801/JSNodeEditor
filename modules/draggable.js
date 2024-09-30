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
    this.mouseIsDown = false;
    this.parent.operation = undefined;
  }

  mouseDown(e) {
    if (e.altKey && this.isHit && this.topMost()) {
      // copy the object
      this.mouseDown = true;
      this.#cursorTempPos = { x: e.x, y: e.y };
      this.parent.operation = {
        action: actions.COPY,
        sourceId: this.id,
        targetId: undefined,
      };
    } else if (
      this.parent.operation === undefined &&
      this.isHit &&
      this.topMost()
    ) {
      this.mouseIsDown = true;
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
    this.isHit = cursorHitTest(
      this.x,
      this.y,
      this.width,
      this.height,
      e.x,
      e.y
    );
    if (
      this.parent.operation === undefined ||
      (this.parent.operation !== undefined &&
        this.parent.operation.action !== actions.MOVE &&
        this.parent.operation.sourceId !== this.id)
    ) {
      return;
    }

    if (this.parent.operation.action === actions.COPY) {
      const newObjId = this.makeCopy();
      // TODO: this part is duplicate from mouseDown. consider refactoring it to a function
      this.parent.operation = {
        action: actions.MOVE,
        sourceId: newObjId,
        targetId: undefined,
      };
      // this.mouseIsDown = true;
      this.#cursorTempPos = { x: e.x, y: e.y };
      //////////////////////////
    }
    // drag
    else if (
      this.mouseIsDown &&
      this.#cursorTempPos !== undefined &&
      (this.#cursorTempPos.x !== e.x || this.#cursorTempPos.y !== e.y) &&
      this.parent.operation.action === actions.MOVE
    ) {
      const dx = e.x - this.#cursorTempPos.x;
      const dy = e.y - this.#cursorTempPos.y;
      this.x += dx;
      this.y += dy;
      this.draw();
    }

    this.#cursorTempPos = { x: e.x, y: e.y };
  }
  // should be implemented in the child class to set its own properties
  makeCopy() {}

  topMost() {
    const hitElements = this.parent.children.filter(
      (o) => o.id !== this.id && o.isHit && o.zIndex > this.zIndex
    );
    return hitElements.length === 0;
  }
}

export { Draggable };
