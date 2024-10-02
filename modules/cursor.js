import { cursorHitTest, isIntersect } from "./helpers.js";
import { ConnectionLine } from "./line.js";

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
  load;
  // History variables
  oldPosition;
  newPosition;
  
  constructor(action, source, target) {
    this.action = action;
    this.source = source;
    this.target = target;
    this.state = state.PENDING;
  }
  mouseDown() {
    console.log("mouse down");
  }
  mouseMove() {
    console.log("mouse move");
  }
  mouseUp() {
    console.log("mouse up");
  }
}

const History = {
  operations: [],
  undoStack: [],
  redoStack: [],
  execute(operation) {
    this.operations.push(operation);
    this.undoStack.push(operation);
    this.redoStack = [];
  },
  undo() {
    if (this.undoStack.length > 0) {
      const operation = this.undoStack.pop();
      this.redoStack.push(operation);
      return operation;
    }
    return "undefined";
  },
  redo() {
    if (this.redoStack.length > 0) {
      const operation = this.redoStack.pop();
      this.undoStack.push(operation);
      return operation;
    }
    return "undefined";
  },
};

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
    this.setHitObject();

    // handle operation ----------------------------------------

    const hitPort = this.getHitPort(this.position);

    if (this.hitObject && this.hitObject.isMovable && hitPort.zIndex === -Infinity) {
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
    } else if (hitPort && hitPort.zIndex !== -Infinity) {
      this.operation = new Operation(
        actions.START_CONNECTION,
        hitPort,
        "undefined"
      );
      this.operation.load = new ConnectionLine(
        hitPort.position,
        { x: e.x, y: e.y },
        this.canvas.context
      );
      this.canvas.connections.push(this.operation.load);
    }
    //----------------------------------------------
  },
  mouseMove: function (e) {
    if (this.canvas.connections.length > 0) {
      this.canvas.connections.forEach((element) => {
        // const hit = this.canvas.context.isPointInStroke(element.path, e.x, e.y);
        const hit = this.canvas.context.isPointInPath(element.path, e.x, e.y);
        if (hit) {
          // TODO: implement delete logic here for connections
          
        }

        // console.log("connection hit", hit);
      });
    }

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
        if (this.isDown && this.operation.load !== "undefined") {
          this.operation.load.end = { x: e.x, y: e.y };
          this.operation.load.draw();
        }
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
    if (this.operation && this.operation.state !== state.FINISHED) {
      if (this.operation.action === actions.START_CONNECTION) {
        const targetPort = this.getHitPort(this.position);
        if (targetPort && targetPort.zIndex !== -Infinity) {
          console.log("target port is =>", targetPort);

          console.log(this.canvas.connections);
          if (
            !this.canvas.connections.some(
              (element) =>
                (element.start.x === this.operation.load.start.x &&
                  element.start.y === this.operation.load.start.y &&
                  element.end.x === targetPort.position.x &&
                  element.end.y === targetPort.position.y) ||
                (element.start.x === this.operation.load.end.x &&
                  element.start.y === this.operation.load.end.y &&
                  element.end.x === targetPort.position.x &&
                  element.end.y === targetPort.position.y)
            ) &&
            this.operation.source.isLeft !== targetPort.isLeft
          ) {
            this.operation.load.end = targetPort.position;
          } else {
            this.canvas.connections.pop();
          }
        } else {
          console.log("no target object found", this.operation);
          console.log("connections =>", this.canvas.connections);
          this.canvas.connections.pop();
        }
      }
      this.operation.state = state.FINISHED;
      this.operation.load = "undefined";
    }
    this.hitObject = "undefined";
  },

  topMost: function () {
    return this.hitObjects[this.hitObjects.length - 1]; // TODO: check if this is correct
  },
  getAllPorts: function () {
    return [...this.canvas.children.map((element) => element.ports)].reduce(
      function (prev, curr) {
        return prev.concat(curr);
      }
    );
  },
  getHitPort: function (position) {
    return this.getAllPorts()
      .filter((element) =>
        isIntersect(
          { x: element.position.x, y: element.position.y, r: element.r },
          this.position
        )
      )
      .reduce(
        function (prev, curr) {
          return prev.zIndex > curr.zIndex ? prev : curr;
        },
        { zIndex: -Infinity }
      );
  },
  setHitObject: function () {
    const targetObjects = this.getAllHittedObjects();
    if (targetObjects !== "undefined" && targetObjects.length > 0) {
      this.hitObject = targetObjects[targetObjects.length - 1];
    }
  },

  getAllHittedObjects: function () {
    return this.canvas.children.filter((element) =>
      cursorHitTest(
        element.x,
        element.y,
        element.width,
        element.height,
        this.position.x,
        this.position.y
      )
    );
  },
};

export { Operation, actions, cursor };
