import { cursorHitTest, isIntersect } from "./helpers.js";
import { ConnectionLine } from "./line.js";

const actions = {
  IDLE: "idle",
  MOVE: "move",
  COPY: "copy",
  START_CONNECTION: "start_connection",
  DELETE: "delete",
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
  #oldPosition;
  #newPosition;
  logNewPosition = [];
  logOldPosition = [];
  constructor(action, source, target) {
    this.action = action;
    this.source = source;
    this.target = target;
    this.state = state.PENDING;
  }

  set oldPosition(pos) {
    this.#oldPosition = pos;
    this.logOldPosition.push(pos);
  }
  get oldPosition() {
    return this.#oldPosition;
  }

  set newPosition(pos) {
    this.#newPosition = pos;
    this.logNewPosition.push(pos);
  }
  get newPosition() {
    return this.#newPosition;
  }
}

class MoveOperation extends Operation {
  constructor(source, target) {
    super(actions.MOVE, source, target);
    this.oldPosition = { x: source.x, y: source.y };
    this.newPosition = "undefined";
  }
  execute() {
    this.newPosition = { x: this.source.x, y: this.source.y };
    history.execute(this);
  }
  undo() {
    this.source.moveElement(this.oldPosition, this.newPosition);
  }
  redo() {
    this.source.moveElement(this.newPosition, this.oldPosition);
  }
}

class CopyOperation extends Operation {
  constructor(source, target) {
    super(actions.COPY, source, target);
    this.oldPosition = { x: source.x, y: source.y };
    this.newPosition = "undefined";
  }
  execute() {
    history.execute(this);
  }
  undo() {
    
    cursor.canvas.children.pop();
  }
  redo() {
    cursor.canvas.children.push(this.load);
  }
}

class ConnectionOperation extends Operation {
  constructor(source, target) {
    super(actions.START_CONNECTION, source, target);
    this.load = "undefined";
  }
  execute() {
    history.execute(structuredClone(this));
  }
  undo() {
    cursor.canvas.connections.pop();
  }
  redo() {
    cursor.canvas.connections.push(this.load);
  }
}

class DeleteOperation extends Operation {
  constructor(source, target) {
    super(actions.DELETE, source, target);
  }
  execute() {
    cursor.canvas.children.pop();
    history.execute(this);
  }
  undo() {
    cursor.canvas.children.push(this.source);
  }
  redo() {
    cursor.canvas.children.pop();
  }
}

const history = {
  operations: [],
  undoStack: [],
  redoStack: [],
  execute(operation) {
    this.operations.push(operation);
    // operation.execute();
    this.undoStack.push(operation);
    this.redoStack = [];
  },
  undo() {
    if (this.undoStack.length > 0) {
      const operation = this.undoStack.pop();
      operation.undo();
      this.redoStack.push(operation);
      return operation;
    }
    return "undefined";
  },
  redo() {
    if (this.redoStack.length > 0) {
      const operation = this.redoStack.pop();
      operation.redo();
      this.undoStack.push(operation);
      return operation;
    }
    return "undefined";
  },
  onkeydown(e) {
    if (e.ctrlKey && e.key === "z") {
      this.undo();
    } else if (e.ctrlKey && e.key === "y") {
      this.redo();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      const so = cursor.selectedObject;
      if (so !== "undefined") {
        const operation = new DeleteOperation(so, "undefined");
        operation.execute();
      }
    }

  }
};

const cursor = {
  position: { x: 0, y: 0 },
  canvas: undefined,
  operation: undefined,
  isDown: false,
  tempPosition: { x: 0, y: 0 },
  hitObject: "undefined",
  selectedObject: "undefined",

  originx: 0,
  originy: 0,

  getCursorPostionInCanvas(e) {
    return {
      x:
        (e.clientX - this.canvas.canvasElem.getBoundingClientRect().left - 1) /
        window.canvasScale,
      y:
        (e.clientY - this.canvas.canvasElem.getBoundingClientRect().top - 1) /
        window.canvasScale,
    };
  },

  updateCursorPosition(e) {
    if (this.canvas === undefined) {
      return;
    }
    this.position = this.getCursorPostionInCanvas(e);
  },

  initCanvas(canvas) {
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
    this.canvas.canvasElem.addEventListener(
      "keydown",
      history.onkeydown.bind(history),
      false
    );

    this.canvas.canvasElem.addEventListener(
      "mousemove",
      this.updateCursorPosition.bind(this),
      false
    );

    this.canvas.canvasElem.addEventListener(
      "mousewheel",
      this.onmousewheel.bind(this),
      false
    );
  },
  mouseDown: function (e) {
    this.isDown = true;
    this.tempPosition = this.getCursorPostionInCanvas(e);

    // set hitObject
    const hitPort = this.getHitPort(this.position);
    if (this.setHitObject() || hitPort) {
      // handle operation ----------------------------------------
      this.selectedObject = this.hitObject;
      if (
        this.hitObject &&
        this.hitObject.isMovable &&
        hitPort.zIndex === -Infinity
      ) {
        if (e.altKey) {
          this.operation = new CopyOperation(this.hitObject, "undefined");
        } else {
          this.operation = new MoveOperation(this.hitObject, "undefined");
          // this.operation.oldPosition = this.tempPosition;
        }
      } else if (hitPort && hitPort.zIndex !== -Infinity) {
        this.operation = new ConnectionOperation(hitPort, "undefined");
        this.operation.load = new ConnectionLine(
          hitPort.position,
          this.getCursorPostionInCanvas(e),
          this.canvas.context
        );
        this.canvas.connections.push(this.operation.load);
      }
    }else{
      this.selectedObject = "undefined";
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
          const pos = this.getCursorPostionInCanvas(e);
          this.operation.source.moveElement(pos, this.tempPosition);
          this.tempPosition = this.getCursorPostionInCanvas(e);
        }
        break;
      case actions.COPY:
        if (this.operation.state === state.PENDING) {
          this.tempPosition = this.getCursorPostionInCanvas(e);

          this.operation.state = state.FINISHED;
          const copy = this.hitObject.makeCopy(
            this.getCursorPostionInCanvas(e)
          );
          this.operation.load = copy;
          this.selectedObject = copy;
          history.execute(this.operation);
          this.operation = new MoveOperation(copy, "undefined");
        }
        break;
      case actions.START_CONNECTION:
        if (this.isDown && this.operation.load !== "undefined") {
          this.operation.load.end = {
            x: this.position.x,
            y: this.position.y,
          };
          this.operation.load.draw();
        }
        break;
      default:
        break;
    }
  },
  mouseUp: function (e) {
    this.isDown = false;
    if (this.operation && this.operation.state !== state.FINISHED) {
      switch (this.operation.action) {
        case actions.MOVE:
        case actions.COPY:
          this.operation.state = state.FINISHED;
          this.operation.execute();
          break;
        case actions.START_CONNECTION:
          const targetPort = this.getHitPort(this.position);
          if (targetPort && targetPort.zIndex !== -Infinity) {
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
              history.execute(this.operation);
            } else {
              this.canvas.connections.pop();
            }
          } else {
            this.canvas.connections.pop();
          }

          this.operation.state = state.FINISHED;
          // this.operation.load = "undefined";
          break;
        default:
          break;
      }
      this.hitObject = "undefined";
    }
  },
  onmousewheel: function (event) {
    if (event.ctrlKey) {
     event.preventDefault();
      var mousex = event.clientX - this.offsetLeft;
      var mousey = event.clientY - this.offsetTop;
      var wheel = event.wheelDelta / 120; //n or -n

      var zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);

      this.canvas.context.translate(this.x, this.y);
      this.canvas.context.scale(zoom, zoom);
      this.canvas.context.translate(
        -(
          mousex / window.canvasScale +
          this.originx -
          mousex / (window.canvasScale * zoom)
        ),
        -(
          mousey / window.canvasScale +
          this.originy -
          mousey / (window.canvasScale * zoom)
        )
      );

      this.originx =
        mousex / window.canvasScale +
        this.originx -
        mousex / (window.canvasScale * zoom);
      this.originy =
        mousey / window.canvasScale +
        this.originy -
        mousey / (window.canvasScale * zoom);
      window.canvasScale *= zoom;
    }
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

    return targetObjects.length > 0;
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
export { Operation, actions, cursor, history };
