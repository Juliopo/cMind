/**
 * Point in screen.
 * @constructor
 * @param {Number} x - The x coordinate of the point.
 * @param {Number} y - The y coordinate of the point.
 * @param {Number} y - The radius size of the point.
 * @param {String} y - The hexadecimal color of the point.
 */

class Point {
  constructor(x, y, radius, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = radius || 1;
    this.h = radius || 1;
    this.radius = radius;
    this.fill = fill || '#8B0000';
  }
  /**
   * Draw the point.
   * @param {Node} x - The Context node.
   * @return {undefined}
   */
  draw(ctx) {
    this.drawCircleShape(ctx);
    this.drawInfoText(ctx);
  }
  /**
   * Draw the Circle Shape.
   * @param {Node} x - The Context node.
   * @return {undefined}
   */
  drawCircleShape(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
  }
  /**
   * Draw the coordinates.
   * @param {Node} x - The Context node.
   * @return {undefined}
   */
  drawInfoText(ctx) {
    ctx.beginPath();
    ctx.font = "10px Roboto";
    ctx.fillStyle = "black";
    ctx.fillText(`(x: ${this.x}, y: ${this.y})`, this.x - 15, this.y - 15);
    ctx.fill();
    ctx.closePath();
  }
  /**
   * Draw the coordinates.
   * @param {Number} mx - The mouse x position.
   * @param {Number} my - The mouse y position.
   * @return {Boolean} return true/false if mouse is inside the point
   */
  contains(mx, my) {
    return  (this.x - this.radius <= mx) && (this.x + this.w >= mx) &&
            (this.y - this.radius <= my) && (this.y + this.h >= my);
  }
}

export default Point;
