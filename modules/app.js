// import { el } from "./helpers";

import { Canvas } from "./canvas.js";
import { Rectangle } from "./block.js";

window.canvasScale = 0.5;

const canvas = new Canvas();

canvas.canvasElem.tabIndex = 1;
// canvas.focus(); 


const rect = new Rectangle(150, 150, 50, 100, canvas, ".block");
rect.init();

canvas.context.scale(canvasScale, canvasScale);

canvas.render();
