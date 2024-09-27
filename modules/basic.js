//TODO: think of generic structure that also suppots circle and other shapes
class Basic {
  id; // guid or unique identifier
  x;
  y;
  width;
  height;
  parent;
  zIndex;
  isTopMost;
  constructor() {
  }

  init() {}
  deinit() {}
}

class Resizable extends Basic {
  ratio = 1.0;
  constructor(x, y, height, width, ratio = 1) {
    super(x, y, height, width, ratio);
    this.ratio = ratio;
  }
}

export { Resizable };
