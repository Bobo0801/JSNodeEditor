import { el } from "./helpers.js";
import { Resizable } from "./basic.js";
import { cursor } from "./cursor.js";

class Canvas extends Resizable {
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
    if (cursor.canvas === undefined) {
      cursor.initCanvas(this);
    }

    this.canvasElem.addEventListener(
      "mousemove",
      cursor.updateCursorPosition.bind(cursor),
      false
    );

    this.canvasElem.addEventListener(
      "mousewheel",
      this.onmousewheel.bind(this),
      false
    );
  }

  drawConnections() {
    this.connections.forEach((element) => element.draw());
  }

  drawNode() {
    this.children.forEach((element) => element.draw());
  }

  onmousewheel(event) {
    var mousex = event.clientX - this.canvasElem.offsetLeft;
    var mousey = event.clientY - this.canvasElem.offsetTop;
    var wheel = event.wheelDelta / 120; //n or -n

    //according to Chris comment
    var zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);

    this.context.translate(this.x, this.y);
    this.context.scale(zoom, zoom);
    this.context.translate(
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
    console.log(window.canvasScale)
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    // this.context.setTransform()
    this.context.clearRect(
      this.x,
      this.y,
      window.innerWidth / window.canvasScale,
      window.innerHeight / window.canvasScale
    );

    this.children.forEach((element) => element.draw());
    this.connections.forEach((element) => element.draw());

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
