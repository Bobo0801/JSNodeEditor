import {
  get_style_rule_value,
  isIntersect,
  generateUuidv4,
} from "./helpers.js";
import { Draggable } from "./draggable.js";

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
    this.id = id === undefined ? generateUuidv4() : id;
    this.isLeft = isLeft;
  }

  draw() {
    this.position.x = this.isLeft
      ? this.parent.x
      : this.parent.x + this.parent.width;

    this.position.y = this.parent.y + this.parent.height / 2;
    this.parent.parent.context.beginPath();
    this.parent.parent.context.arc(
      this.position.x,
      this.position.y,
      this.r,
      0,
      Math.PI * 2,
      false
    );
    this.parent.parent.context.fillStyle = "#3498db";
    this.parent.parent.context.fill();
    this.parent.parent.context.lineWidth = 2;
    this.parent.parent.context.strokeStyle = "#2980b9";
    this.parent.parent.context.stroke();
    this.parent.parent.context.closePath();

    // console.log(`this.position.x: ${this.position.x}, this.position.y: ${this.position.y}, this.r: ${this.r}, this.ctx.fillStyle: ${this.ctx.fillStyle}, this.ctx.lineWidth: ${this.ctx.lineWidth}, this.ctx.strokeStyle: ${this.ctx.strokeStyle}`);
    
  }
}

class Rectangle extends Draggable {
  cssClassName;
  ports = [];
  contentCanvas;
  constructor(x, y, width, height, parent, cssClassName, id = undefined) {
    super();
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.parent = parent;
    this.cssClassName = cssClassName;
    this.id = id === undefined ? generateUuidv4() : id;
    this.init();
  }

  init() {
    if (!this.parent.children.some((element) => element.id === this.id)) {
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
    this.createPorts();
  }

  draw() {
    this.ports.forEach((element) => {
      element.draw();
    });
    const bc =
      this.cssClassName != undefined
        ? get_style_rule_value(this.cssClassName, "background-color")
        : "black";
    this.parent.context.fillStyle = bc;
    this.parent.context.strokeRect(this.x, this.y, this.width, this.height);
    this.parent.context.fillRect(this.x, this.y, this.width, this.height);
  }

  createPorts() {

    // TODO: if you intend to have more than two ports, you should think of a better way to create them
    const leftPort = {
      x: this.x,
      y: this.y + this.height / 2,
      r: this.height * 0.2,
    };

    const rightPort = {
      x: this.x + this.width,
      y: this.y + this.height / 2,
      r: this.height * 0.2,
    };
    if (this.ports.length == 2) {
      // set the position of the ports
      // get left port
      // const lprt = this.ports.find((element) => element.isLeft);
      // lprt.position = { x: leftPort.x, y: leftPort.y };
      // // get right port
      // const rprt = this.ports.find((element) => !element.isLeft);
      // rprt.position = { x: rightPort.x, y: rightPort.y };

      // console.log(this.ports);
      
    } else {

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
  }

  isPortHit(cursorPosition) {
    return this.ports.some((element) =>
      isIntersect(
        { x: element.position.x, y: element.position.y, r: element.r },
        cursorPosition
      )
    );
  }

  getHitPort(cursorPosition) {
    return this.ports.find((element) =>
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
      this.width,
      this.height,
      this.parent,
      this.cssClassName
    );
    copy.mouseIsDown = true; // TODO: this is a hack to make the copy moveable. consider refactoring it to set it in Draggable class
    copy.init();
    return copy;
  }
}

export { Rectangle };
