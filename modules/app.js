// import { el } from "./helpers";

import { Canvas } from "./canvas.js";
import { Rectangle } from "./block.js";
import { cursor } from "./core.js";

window.canvasScale = 1;

// add root canvas to the document. This could be done by loading a file in the future
const canvas = new Canvas();
if (cursor.canvas === undefined) {
  cursor.initCanvas(canvas);
}

cursor.initStencils();


