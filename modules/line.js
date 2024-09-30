class ConnectionLine {
  sourceNode;
  destinationNode;
  parentCanvas;
  constructor(startNode, endNode, parentCanvas) {
    this.sourceNode = startNode;
    this.destinationNode = endNode;
    this.parentCanvas = parentCanvas;
  }

  init() {}

  draw() {       
    this.parentCanvas.context.beginPath();
    this.parentCanvas.context.moveTo(this.sourceNode.position.x, this.sourceNode.position.y);
    this.parentCanvas.context.lineTo(this.destinationNode.position.x, this.destinationNode.position.y);
    this.parentCanvas.context.strokeStyle = "#2c3e50";
    this.parentCanvas.context.lineWidth = 2;
    this.parentCanvas.context.stroke();
    this.parentCanvas.context.closePath();
  }

  drawCurve(tension = 0.5) {
    this.parentCanvas.context.beginPath();
    this.parentCanvas.context.moveTo(this.sourceNode.x, this.sourceNode.y);

    // const dx2 = this.start.x > this.end.x ? this.end.x - this.start.x : this.start.x - this.end.x

    let p1 = {
      x: (this.destinationNode.x + this.sourceNode.x) / 2,
      y: this.sourceNode.y,
    };
    let p2 = {
      x: (this.sourceNode.x - this.destinationNode.x) / 2,
      y: this.destinationNode.y,
    };
    const points = [
      this.sourceNode,
      this.sourceNode,
      this.sourceNode,
      this.destinationNode,
    ];
    this.drawCurve_(points, 0);
  }

  drawCurve_(points, tension = 0.5) {
    this.parentCanvas.context.beginPath();
    this.parentCanvas.context.moveTo(points[0].x, points[0].y);

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

      this.parentCanvas.context.bezierCurveTo(
        cp1x,
        cp1y,
        cp2x,
        cp2y,
        p2.x,
        p2.y
      );
    }
    this.parentCanvas.context.stroke();
  }
}

export { ConnectionLine };
