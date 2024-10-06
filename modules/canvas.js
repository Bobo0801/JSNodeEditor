import { el } from "./helpers.js";
import { Resizable } from "./basic.js";
import { cursor } from "./cursor.js";

class Canvas extends Resizable {
  x;
  y;
  canvasElem;
  context;
  children = [];
  connections = [];
  tempLine;
  scaleFactor = 1.0;
  offsetX = 0;
  offsetY = 0;
  originx = 0;
  originy = 0;
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
    const divWrapper = el("#editorContainer");
    // divWrapper.id = id;
    parent.appendChild(divWrapper);

    // create canvas element and add it to the wrapper div
    this.canvasElem = document.createElement("canvas");
    this.canvasElem.width = width;
    this.canvasElem.height = height;
    divWrapper.x = this.x;
    divWrapper.y = this.y;
    this.canvasElem.className = "drawingCanvas";

    divWrapper.appendChild(this.canvasElem);

    this.context = this.canvasElem.getContext("2d");
    if (cursor.canvas === undefined) {
      cursor.initCanvas(this);
    }
  }

  drawConnections() {
    this.connections.forEach((element) => element.draw());
  }

  drawNode() {
    this.children.forEach((element) => element.draw());
  }

 

  render() {
    requestAnimationFrame(this.render.bind(this));
    // this.context.setTransform()
    this.context.clearRect(
      0,
      0,
      this.canvasElem.width / window.canvasScale,
      this.canvasElem.height  / window.canvasScale
    );

    this.connections.forEach((element) => element.draw());
    this.children.forEach((element) => element.draw());

    if (this.tempLine !== undefined) {
      this.tempLine.destinationNode.position = this.cursorPosition;
      this.tempLine.draw();
    }
  }

  // Export Image ################################################################

  exportAsJpg() {}
  // Save JSON ###################################################################
  saveJson() {}
}

export { Canvas };
