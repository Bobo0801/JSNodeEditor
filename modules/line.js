class ConnectionLine {
  start;
  end;
  context;
  constructor(start, end, parent) {
    this.start = start;
    this.end = end;
    this.context = parent;
  }

  init() {}

  draw() {
    this.drawCurve();
  }

  drawCurve() {
    this.context.beginPath();
    this.context.moveTo(this.start.x, this.start.y);
    this.context.bezierCurveTo(
      this.CalculateControlPonPoint1().x,
      this.CalculateControlPonPoint1().y,
      this.CalculateControlPonPoint2().x,
      this.CalculateControlPonPoint2().y,
      this.end.x,
      this.end.y
    );
    this.context.stroke();
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

  drawConnections() {
    this.context.strokeStyle = "#0B0D0FFF";
    this.context.lineWidth = 2;
    this.context.beginPath();
    this.context.moveTo(this.start.x, this.start.y);
    this.context.lineTo(this.end.x, this.end.y);
    this.context.stroke();
    this.context.closePath();
  }
}

export { ConnectionLine };
