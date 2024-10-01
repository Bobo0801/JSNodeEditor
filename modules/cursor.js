import { cursorHitTest } from "./helpers.js";

const actions = {
  IDLE: "idle",
  MOVE: "move",
  COPY: "copy",
  START_CONNECTION: "start_connection",
  EXTEND_CONNECTION: "extend_connection",
  FINISH_CONNECTION: "finish_connection",
  // RESIZE: 'resize',
  // DELETE: 'delete',
  // ADD: 'add',
  // DISCONNECT: 'disconnect',
  // SELECT: 'select',
  // DESELECT: 'deselect',
};

const state = {
  PENDING: "pending",
  EXECUTING: "executing",
  FINISHED: "finished",
};

const result = {
  SUCCESS: "success",
  FAILURE: "failure",
};

class Operation {
  action;
  source;
  target;
  state;
  callback = undefined;
  constructor(action, source, target) {
    this.action = action;
    this.source = source;
    this.target = target;
    this.state = state.PENDING;
  }
  exec() {
    if (callback === undefined) {
      console.log(
        "callback not implemented for this operation",
        this.action,
        this.source,
        this.target
      );
      return;
    }
    if (callback() === true) {
      this.state = state.FINISHED;
      return result.SUCCESS;
    } else {
      this.state = state.FINISHED;
      console.log("operation failed", this.action, this.source, this.target);
      return result.FAILURE;
    }
  }
}

const cursor = {
  position: { x: 0, y: 0 },
  canvas: undefined,
  operation: undefined,
  isDown: false,
  tempPosition: { x: 0, y: 0 },
  hitObject: "undefined",
  updateCursorPosition(e) {
    if (this.canvas === undefined) {
      console.log("canvas not set for cursor");
      return;
    }
    this.position.x =
      e.clientX - this.canvas.canvasElem.getBoundingClientRect().left;
    this.position.y =
      e.clientY - this.canvas.canvasElem.getBoundingClientRect().top;
  },

  initCanvas: function (canvas) {
    this.canvas = canvas;
    this.canvas.canvasElem.addEventListener(
      "mousedown",
      this.mouseDown.bind(this),
      false
    );
    this.canvas.canvasElem.addEventListener(
      "mousemove",
      this.mouseMove.bind(this),
      false
    );
    this.canvas.canvasElem.addEventListener(
      "mouseup",
      this.mouseUp.bind(this),
      false
    );
  },
  mouseDown: function (e) {
    this.isDown = true;
    this.tempPosition = { x: e.x, y: e.y };
    // set hitObject
    const targetObjects = this.canvas.children.filter((element) =>
      cursorHitTest(
        element.x,
        element.y,
        element.width,
        element.height,
        this.position.x,
        this.position.y
      )
    );

    if (targetObjects !== "undefined" && targetObjects.length > 0) {
      this.hitObject = targetObjects[targetObjects.length - 1];
    }

    // handle operation ----------------------------------------
    if (this.hitObject === "undefined") {
      console.log("hit object is undefined");
      return;
    }
    if (this.hitObject.isMovable && !this.hitObject.isPortHit(this.position)) {
      if (e.altKey) {
        this.operation = new Operation(
          actions.COPY,
          this.hitObject,
          "undefined"
        );
      } else {
        this.operation = new Operation(
          actions.MOVE,
          this.hitObject,
          "undefined"
        );
      }
    } else if (this.hitObject.isPortHit(this.position)) {
      this.operation = new Operation(
        actions.START_CONNECTION,
        this.hitObject,
        "undefined"
      );
    }
    //----------------------------------------------
  },
  mouseMove: function (e) {
    if (
      this.operation === undefined ||
      this.operation.state === state.FINISHED
    ) {
      return;
    }

    switch (this.operation.action) {
      case actions.MOVE:
        if (this.isDown) {
          const pos = { x: e.x, y: e.y };         
          this.operation.source.moveElement(pos, this.tempPosition);
          this.tempPosition = { x: e.x, y: e.y };
        }
        break;
      case actions.COPY:
        if (this.operation.state === state.PENDING) {
          this.tempPosition = { x: e.x, y: e.y };

          this.operation.state = state.FINISHED;
          const copy = this.hitObject.makeCopy({ x: e.x, y: e.y });
          this.operation = new Operation(actions.MOVE, copy, "undefined");
        }
        break;
      case actions.START_CONNECTION:
        break;
      case actions.EXTEND_CONNECTION:
        break;
      case actions.FINISH_CONNECTION:
        break;
      default:
        break;
    }
  },
  mouseUp: function (e) {
    this.isDown = false;

    if (this.operation !== "undefined") {
      this.operation.state = state.FINISHED;
    }
    this.hitObject = "undefined";
  },

  topMost: function () {
    return this.hitObjects[this.hitObjects.length - 1]; // TODO: check if this is correct
  },
};

export { Operation, actions, cursor };
