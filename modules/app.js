// import { el } from "./helpers";

import { Canvas } from "./canvas.js";
import { Rectangle } from "./block.js";
import { cursor } from "./cursor.js";

window.canvasScale = 1;

const canvas = new Canvas();

// canvas.canvasElem.tabIndex = 1;
// canvas.focus(); 
if (cursor.canvas === undefined) {
  cursor.initCanvas(canvas);
}

const rect = new Rectangle(150, 150, 50, 100, canvas, ".block");
// rect.init();


