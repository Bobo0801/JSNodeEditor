import {
  get_style_rule_value,
  isIntersect,
  generateUuidv4,
} from "./helpers.js";
import { Canvas } from "./canvas.js";
import { Draggable } from "./draggable.js";
import { Resizable } from "./basic.js";
import { ConnectionLine } from "./line.js";
import { actions, Operation } from "./cursor.js";

// TODO: extend Resizable
class Port {
  id;
  x;
  y;
  r;
  parent;
  isHit;
  operation = undefined;
  connections = [];
  #mouseIsDown;
  #tempLine;
  constructor(x, y, r, parent, id = undefined) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.parent = parent;
    this.ctx = this.parent.parent.context;
    this.id = id === undefined ? generateUuidv4() : id;
  }

  init() {
    // this.parent.context.globalCompositeOperation='destination-over';
    this.parent.parent.canvasElem.addEventListener(
      "mousemove",
      this.mouseMove.bind(this)
    );
    this.parent.parent.canvasElem.addEventListener(
      "mouseup",
      this.mouseUp.bind(this)
    );
    this.parent.parent.canvasElem.addEventListener(
      "mousedown",
      this.mouseDown.bind(this)
    );
  }

  deinit() {}

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
    this.ctx.fill();
    this.ctx.stroke();

    // draw temp line. after adding the line to canvas lines list it should be drawn from there
    if (this.#tempLine) {
      this.#tempLine.draw();
    }
  }

  mouseDown(e) {
    // set isHit
    this.#mouseIsDown = true;

    // start drawing line here with points start = end = cPos

    if (
      this.parent.parent.operation === undefined &&
      isIntersect(
        { x: this.x, y: this.y, r: this.r },
        this.parent.parent.cursorPosition
      ) &&
      this.parent.parent.operation === undefined
    ) {
      this.operation = new Operation(actions.CONNECT, this.id, undefined);
      // this.#tempLine = new ConnectionLine({ x: this.x, y: this.y}, {x:e.clientX,y:0}, this.parent.parent);
      this.parent.parent.tempLine = new ConnectionLine(
        { x: this.x, y: this.y },
        this.parent.parent.cursorPosition,
        this.parent.parent
      );
      // console.log("from mouseup", this.parent.parent.tempLine.end);
    }
  }

  mouseUp(e) {
    // reset isHit
    this.#mouseIsDown = false;
    this.parent.parent.operation = undefined;
    if (
      isIntersect(
        { x: this.x, y: this.y, r: this.r },
        this.parent.parent.cursorPosition
      ) &&
      this.parent.parent.operation !== undefined &&
      this.parent.parent.operation.action === actions.CONNECT &&
      this.parent.parent.operation.sourceId !== this.id &&
      this.parent.parent.operation.targetId === undefined &&
      this.parent.parent.tempLine !== undefined
    ) {
      this.parent.parent.connections.push(this.parent.parent.tempLine);
      this.parent.parent.tempLine = undefined;

      // reset operation to allow other operations
      this.parent.parent.operation = undefined;
    }
  }

  mouseMove(e) {
    // point if the mouse still down

    if (
      this.#mouseIsDown &&
      this.parent.parent.tempLine !== undefined &&
      this.parent.parent.operation !== undefined &&
      this.parent.parent.operation.action === actions.CONNECT
    ) {
      this.parent.parent.tempLine.end = this.parent.parent.cursorPosition;
    }
  }

  makeCopy(){}
}

class Rectangle extends Draggable {
  cssClassName;
  ports = [];
  constructor(x, y, height, width, parent, cssClassName, id = undefined) {
    super();
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.parent = parent;
    this.cssClassName = cssClassName;
    this.id = id === undefined ? generateUuidv4() : id;
  }

  init() {
    this.zIndex =
      this.parent.children.length > 0
        ? Math.max(...this.parent.children.map((o) => o.zIndex)) + 1
        : 1;
    this.parent.children.forEach((element) => {
      element.isTopMost = false;
    });
    this.isTopMost = true;
    this.parent.children.push(this);
    super.init();
  }

  draw() {
    // TODO: fix why the left port moves the rectangle? there is some sort of margin: left, top about 10px. find out where it comes from
    const bc =
      this.cssClassName != undefined
        ? get_style_rule_value(this.cssClassName, "background-color")
        : "black";
    this.parent.context.fillStyle = bc;
    this.parent.context.strokeRect(this.x, this.y, this.width, this.height);
    this.parent.context.fillRect(this.x, this.y, this.width, this.height);
    this.drawPorts();
  }

  drawPorts() {
    const leftPort = {
      x: this.x,
      y: this.y + this.height / 2,
      r: 10,
    };

    const rightPort = {
      x: this.x + this.width,
      y: this.y + this.height / 2,
      r: 10,
    };

    const lprt = new Port(leftPort.x, leftPort.y, leftPort.r, this);
    lprt.draw();
    lprt.init();
    const rprt = new Port(rightPort.x, rightPort.y, rightPort.r, this);
    rprt.draw();
    rprt.init();
  }

  makeCopy() {
    // super.makeCopy(); // let this for future implementations of generic operation handling
    const copy = new Rectangle(
      this.x + 10,
      this.y + 10,
      this.height,
      this.width,
      this.parent,
      this.cssClassName
    );
    copy.mouseIsDown = true; // TODO: this is a hack to make the copy moveable. consider refactoring it to set it in Draggable class
    // TODO: don't forget to copy the ports
    copy.init();
    return copy.id;
  }
}

export { Rectangle };
