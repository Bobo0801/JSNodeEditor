class ConnectionLine {
  start;
  end;
  context;
  path;
  constructor(start, end, parent) {
    this.start = start;
    this.end = end;
    this.context = parent;
    this.path = new Path2D();
  }

  init() {}

  draw() {
    this.drawCurve();
  }

  drawCurve() {
    this.path = new Path2D();
    this.context.strokeStyle = "#1C2D3EFF";
    this.context.lineWidth = 4;
    this.path.moveTo(this.start.x, this.start.y);
    this.path.bezierCurveTo(
      this.CalculateControlPonPoint1().x,
      this.CalculateControlPonPoint1().y,
      this.CalculateControlPonPoint2().x,
      this.CalculateControlPonPoint2().y,
      this.end.x,
      this.end.y
    );
    this.context.stroke(this.path);
    this.context.strokeStyle = "#000000FF";
    this.context.lineWidth = 2;
  }

  CalculateControlPonPoint1() {
    const x =
      this.start.x < this.end.x
        ? this.start.x + this.start.x * 0.15
        : this.start.x - this.start.x * 0.15;
    const y = this.start.y;
    return { x: x, y: y };
  }

  CalculateControlPonPoint2() {
    const x =
      this.start.x < this.end.x
        ? this.end.x - this.end.x * 0.15
        : this.end.x + this.end.x * 0.15;
    const y = this.end.y;
    return { x: x, y: y };
  }
}

export { ConnectionLine };
