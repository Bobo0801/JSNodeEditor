import {
  get_style_rule_value,
  isIntersect,
  generateUuidv4,
} from "./helpers.js";
import { Canvas } from "./canvas.js";
import { Draggable } from "./draggable.js";
import { Resizable } from "./basic.js";
import { ConnectionLine } from "./line.js";
import { cursor } from "./cursor.js";

// TODO: extend Resizable
class Port {
  id;
  x;
  y;
  r;
  isLeft;
  parent;
  connections = [];
  constructor(position, r, parent, isLeft = false, id = undefined) {
    this.position = position;
    this.r = r;
    this.parent = parent;
    this.ctx = cursor.canvas.context;
    this.id = id === undefined ? generateUuidv4() : id;
    this.isLeft = isLeft;
  }

  draw() {
    this.position.x = this.isLeft
      ? this.parent.x
      : this.parent.x + this.parent.width;

    this.position.y = this.parent.y + this.parent.height / 2;
    this.ctx.beginPath();
    this.ctx.arc(
      this.position.x,
      this.position.y,
      this.r,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.fillStyle = "#3498db";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#2980b9";
    this.ctx.stroke();
    this.ctx.closePath();
  }
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
    this.createPorts();
  }

  draw() {
    const bc =
      this.cssClassName != undefined
        ? get_style_rule_value(this.cssClassName, "background-color")
        : "black";
    this.parent.context.fillStyle = bc;
    this.parent.context.strokeRect(this.x, this.y, this.width, this.height);
    this.parent.context.fillRect(this.x, this.y, this.width, this.height);

    this.ports.forEach((element) => {
      element.draw();
    });
  }

  createPorts() {
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

    const lprt = new Port(
      { x: leftPort.x, y: leftPort.y },
      leftPort.r,
      this,
      true
    );

    const rprt = new Port(
      { x: rightPort.x, y: rightPort.y },
      rightPort.r,
      this
    );

    this.ports.push(lprt);
    this.ports.push(rprt);
  }

  isPortHit(cursorPosition) {
    return this.ports.some((element) =>
      isIntersect(
        { x: element.position.x, y: element.position.y, r: element.r },
        cursorPosition
      )
    );
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
