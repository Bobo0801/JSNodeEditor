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
  position = { x: 0, y: 0 };
  r;
  parent;
  isHit;
  connections = [];
  #mouseIsDown;
  #tempLine;
  constructor(position, r, parent, id = undefined) {
    this.position = position;
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
    this.ctx.arc(
      this.position.x,
      this.position.y,
      this.r,
      0,
      2 * Math.PI,
      true
    );
    this.ctx.fillStyle = "#3498db";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#2980b9";
    this.ctx.stroke();
    this.ctx.closePath();

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
        { x: this.position.x, y: this.position.y, r: this.r },
        this.parent.parent.cursorPosition
      ) &&
      this.parent.parent.operation === undefined
    ) {
      this.parent.parent.operation = new Operation(
        actions.CONNECT,
        this.id,
        "undefined"
      );
      // this.#tempLine = new ConnectionLine({ x: this.x, y: this.y}, {x:e.clientX,y:0}, this.parent.parent);
      const tempNode = new Port(
        this.parent.parent.cursorPosition,
        10,
        this.parent,
        "virtual Port"
      );
      this.parent.parent.tempLine = new ConnectionLine(
        this,
        tempNode,
        this.parent.parent
      );

      console.log("from down", this.parent.parent.operation);
    }
  }

  
  mouseUp(e) {
    // reset isHit
    this.#mouseIsDown = false;

    // console.log(this, this.parent.parent.operation);

    console.log(isIntersect(
      { x: this.position.x, y: this.position.y, r: this.r },
      this.parent.parent.cursorPosition
    ) ,
    this.parent.parent.operation !== undefined ,
    this.parent.parent.operation.action === actions.CONNECT ,
    this.parent.parent.operation.sourceId !== this.id ,
    // this.parent.parent.operation.targetId === undefined ,
    this.parent.parent.tempLine !== undefined);

    if (
      isIntersect(
        { x: this.position.x, y: this.position.y, r: this.r },
        this.parent.parent.cursorPosition
      )  &&
      this.parent.parent.operation !== undefined &&
      this.parent.parent.operation.action === actions.CONNECT &&
      this.parent.parent.operation.sourceId !== this.id &&
      // this.parent.parent.operation.targetId === undefined &&
      this.parent.parent.tempLine !== undefined
    ) {
      console.log("Hi");

      this.parent.parent.tempLine.destinationNode = this;
      this.parent.parent.connections.push(this.parent.parent.tempLine);
      console.log(this.parent.parent.connections);
      
      this.parent.parent.tempLine = undefined;

      // reset operation to allow other operations
      this.parent.parent.operation = undefined;
    }
    if (
      this.parent.parent.operation !== undefined &&
      this.parent.parent.operation.action === actions.CONNECT
    ) {
      this.parent.parent.operation = undefined;
    }

    this.parent.parent.tempLine = undefined;
  }

  mouseMove(e) {
    // point if the mouse still down
console.log(isIntersect(
  { x: this.position.x, y: this.position.y, r: this.r },
  this.parent.parent.cursorPosition
));

    if (
      this.#mouseIsDown &&
      this.parent.parent.tempLine !== undefined &&
      this.parent.parent.operation !== undefined &&
      this.parent.parent.operation.action === actions.CONNECT
    ) {
      this.parent.parent.tempLine.destinationNode.position =
        this.parent.parent.cursorPosition;
    }
  }

  makeCopy() {}
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

    const lprt = new Port({ x: leftPort.x, y: leftPort.y }, leftPort.r, this);
    lprt.draw();
    lprt.init();
    const rprt = new Port(
      { x: rightPort.x, y: rightPort.y },
      rightPort.r,
      this
    );
    rprt.draw();
    rprt.init();
  }
}

export { Rectangle };
