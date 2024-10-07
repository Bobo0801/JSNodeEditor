/**
 * This module serves as a central manager for the tools, i.e. nodes, editing tools, etc.
 * The Toolbox class is used to create a toolbox with templates. Normally there is only one toolbox, 
 * but for better organization the tools can be grouped in their separate toolboxes
 * The stencil class is used to create stencils that can be placed on the canvas to create different nodes.
 * 
 */


class Toolbox {
  stencils = [];
  constructor() {
    this.stencils = [];
  }
  addStencil(stencil) {
    this.stencils.push(stencil);
  }
}

class Stencil {
  height = 0;
  width;
  nodeType;
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}