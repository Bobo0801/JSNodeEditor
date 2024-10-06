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
  constructor(id, parent) {
    super(id, parent);
    this.createDomElement(id, parent);
  }

  /**
   * initialize the canvas object by creating its DOM element
   * @param {string} id unique identifier for the canvas (UUID v4)
   * @param {HTMLElement} parent the element that should host/contain the canvas
   */
  createDomElement(id = 'undefined', parent='undefined') {
    // create div to wrap the canvas
    const divWrapper = el("#editor-container");

    // create canvas element and add it to the wrapper div
    this.canvasElem = document.createElement("canvas");
    this.canvasElem.className = "drawing-canvas";
    this.parent = divWrapper;
    
    divWrapper.appendChild(this.canvasElem);

    // we should set the width and height of the canvas to the width and 
    // height of the parent div after it has been added to the DOM 
    // otherwise the width and height will be 0
    this.canvasElem.width = divWrapper.clientWidth;
    this.canvasElem.height = divWrapper.clientHeight;
    
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
    this.context.clearRect(
      0,
      0,
      this.canvasElem.width / window.canvasScale,
      this.canvasElem.height / window.canvasScale
    );

    this.children.forEach((element) => element.draw());
    this.connections.forEach((element) => element.draw());
  }

  // Export Image ################################################################

  exportAsJpg() {}
  // Save JSON ###################################################################
  saveJson() {}
}

export { Canvas };
