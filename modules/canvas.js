import { el } from "./helpers.js";
import { Resizable } from "./basic.js";

class Canvas extends Resizable {
  x;
  y;
  canvasElem;
  context;
  children = [];
  connections = [];
  parentNode;
  paused = false;
  constructor(id, parent) {
    super(id, parent);
    // this.createDomElement(id, parent);
  }

  /**
   * initialize the canvas object by creating its DOM element
   * @param {string} id unique identifier for the canvas (UUID v4)
   * @param {HTMLElement} parent the element that should host/contain the canvas
   */
  createDomElement(id = "undefined", parent = "undefined") {
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

    this.canvasElem.tabIndex = 1;

    this.context.scale(canvasScale, canvasScale);

    // TODO: investigate why this is necessary. we call init in block constructor
    this.children.forEach((element) => element.init());
    this.connections.forEach((element) => element.init());
    this.drawConnections();
    this.paused = false;
    this.render();
  }

  drawConnections() {
    this.connections.forEach((element) => {
      // console.log(element);
      
      element.draw();
    });
  }

  drawNodes() {
    this.children.forEach((element) => element.draw());
  }

  render() {
    if (this.paused) return;
    this.context.clearRect(
      0,
      0,
      this.canvasElem.width / window.canvasScale,
      this.canvasElem.height / window.canvasScale
    );
    requestAnimationFrame(this.render.bind(this));
    
    this.drawNodes();
    this.drawConnections();
  }

  // Export Image ################################################################

  exportAsJpg() {}
  // Save JSON ###################################################################
  saveJson() {}
}

export { Canvas };
