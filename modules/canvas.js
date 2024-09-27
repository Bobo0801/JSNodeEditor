import { el } from "./helpers.js";
import { Resizable } from "./basic.js";
import { ConnectionLine } from "./line.js";



class Canvas extends Resizable {
  canvasElem;
  context;
  id;
  cursorPosition = {};
  children = [];
  connections = [];
  cursorOperation;
  tempLine;
  constructor(id, parent, width, height) {
    super(id, parent, width, height);
    this.createDomElement(id, parent, width, height);
  }

  /**
   * initialize the canvas object by creating its DOM element
   * @param {string} id the DOM element id
   * @param {HTMLElement} parent the element that should host/contain the canvas
   * @param {Number} width the canvas width
   * @param {Number} height canvas height
   */
  createDomElement(id, parent, width, height) {
    // create div to wrap the canvas
    const divWrapper = document.createElement("div");
    divWrapper.id = id;
    parent.appendChild(divWrapper);

    // create canvas element and add it to the wrapper div
    this.canvasElem = document.createElement("canvas");
    this.canvasElem.width = width;
    this.canvasElem.height = height;
    this.canvasElem.className = "drawingCanvas";

    divWrapper.appendChild(this.canvasElem);

    this.context = this.canvasElem.getContext("2d");
    this.canvasElem.addEventListener(
      "mousemove",
      this.updateCursorPosition.bind(this),
      false
    );
  }

  updateCursorPosition(e) {
    this.cursorPosition = {
      x: e.clientX - this.canvasElem.getBoundingClientRect().left,
      y: e.clientY - this.canvasElem.getBoundingClientRect().top,
    };
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.context.clearRect(
      this.x,
      this.y,
      window.innerWidth,
      window.innerHeight
    );

    this.children.forEach((element) => element.draw());
    this.connections.forEach((element) => element.draw());

    if (this.tempLine !== undefined) {
      // this.tempLine.draw();
    }
  }

  // Export Image ################################################################

  exportAsJpg() {}
  // Save JSON ###################################################################
  saveJson() {}
}

export { Canvas };
