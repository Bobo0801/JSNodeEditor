/**
 * @module line
 *
 * This module is used to create connections between nodes
 * The ConnectionLine class is used to create a connection line between two nodes.
 */

/**
 * @class ConnectionLine
 * @description This class is used to create a connection line between two nodes.
 * The connection line is drawn using bezier curves.
 * The start and end points are the two nodes that are connected.
 * The parent is the canvas object.
 * The path is the path of the connection line.
 */
class ConnectionLine {
  start;
  end;
  parent;
  path;
  constructor(start, end, parent) {
    this.start = start;
    this.end = end;
    this.parent = parent;
    this.path = new Path2D();
  }

  init() {}

  /**
   * @function draw
   * @description This function is used to draw the connection line on the canvas.
   */
  draw() {
    this.drawCurve();
  }

  /**
   * @function drawCurve
   * @description This function is used to draw the connection line using bezier curves.
   * The control points are calculated using the start and end points.
   * The control points are calculated such that the curve is smooth.
   * The curve is drawn using the calculated control points.
   * The curve is drawn using the stroke style and line width of the parent canvas.
   * @returns {void}
   */
  drawCurve() {
    this.path = new Path2D();
    this.parent.context.strokeStyle = "#1C2D3EFF";
    this.parent.context.lineWidth = 4;
    this.path.moveTo(this.start.x, this.start.y);
    this.path.bezierCurveTo(
      this.CalculateControlPonPoint1().x,
      this.CalculateControlPonPoint1().y,
      this.CalculateControlPonPoint2().x,
      this.CalculateControlPonPoint2().y,
      this.end.x,
      this.end.y
    );
    this.parent.context.stroke(this.path);
    this.parent.context.strokeStyle = "#000000FF";
    this.parent.context.lineWidth = 2;
  }

  /**
   * calculate the first control point for the bezier curve
   * @returns {Object} {x: number, y: number}
   */
  CalculateControlPonPoint1() {
    const x =
      this.start.x < this.end.x
        ? this.start.x + this.start.x * 0.15
        : this.start.x - this.start.x * 0.15;
    const y = this.start.y;
    return { x: x, y: y };
  }


  /**
   * calculate the second control point for the bezier curve
   * @returns {Object} {x: number, y: number}
   */

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
