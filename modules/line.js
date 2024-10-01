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
    this.drawConnections();
  }

  drawCurve(tension = 0.5) {
    this.context.beginPath();
    this.context.moveTo(this.start.x, this.start.y);

    // const dx2 = this.start.x > this.end.x ? this.end.x - this.start.x : this.start.x - this.end.x

    let p1 = { x: (this.end.x + this.start.x) / 2, y: this.start.y };
    let p2 = { x: (this.start.x - this.end.x) / 2, y: this.end.y };
    const points = [this.start, this.start, this.start, this.end];
    this.drawCurve_(points, 0);
  }

  drawCurve_(points, tension = 0.5) {
    this.context.beginPath();
    this.context.moveTo(points[0].x, points[0].y);

    var t = tension != null ? tension : 1;
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = i > 0 ? points[i - 1] : points[0];
      var p1 = points[i];
      var p2 = points[i + 1];
      var p3 = i != points.length - 2 ? points[i + 2] : p2;

      var cp1x = p1.x + ((p2.x - p0.x) / 6) * t;
      var cp1y = p1.y + ((p2.y - p0.y) / 6) * t;

      var cp2x = p2.x - ((p3.x - p1.x) / 6) * t;
      var cp2y = p2.y - ((p3.y - p1.y) / 6) * t;

      this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    this.context.stroke();
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
