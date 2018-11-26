/* global requestAnimationFrame */
import Point from './Point';

/**
 * Parallelogram shape.
 * @constructor
 * @param {Node} Canvas - The canvas node.
 */
class Parallelogram {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.shouldRedraw = true; // when set to true, the canvas will redraw everything
    this.shapes = [];  // the collection of points to be drawn
    this.dragging = false; // Keep track of when we are dragging
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
    this.animationControl;
    this.mouseDownListener = null;
    this.mousemoveListener = null;
    this.mouseupListener = null;
    this.dblclickListener = null;
    this.selectstartLisntener = null;
    this.shouldDrawParallelogram = true;
    this.shouldDrawEllipseInscribed = true;
    this.arePointsLockedToParallelogram = true;

    //fixes a problem where double clicking causes text to get selected on the canvas
    this.selectstartLisntener = canvas.addEventListener('selectstart', (e) => {e.preventDefault(); return false; }, false);
    this.listenPointDragging();
    this.listenMouseUp();
    this.ListenPointCreation();

    this.selectionColor = 'gold';
    this.selectionWidth = 2;
    this.animationControl = requestAnimationFrame(this.draw.bind(this));
  }

  listenPointDragging() {
    this.listenMouseDown();
    this.listenMouseMove();
  }
  /**
   * Execute before the instance gets destroyed to remove all listeners created
   * @return {undefined}
   */
  beforeGetsDestroyed() {
    this.clear();
    this.canvas.removeEventListener('mousedown', this.mouseDownListener);
    this.canvas.removeEventListener('mouseup', this.mouseupListener);
    this.canvas.removeEventListener('mousemove', this.mousemoveListener);
    this.canvas.removeEventListener('dblclick', this.dblclickListener);
  }
  /**
   * Listen for mouseDown on canvas
   * @return {undefined}
   */
  listenMouseDown() {
    this.mouseDownListener = this.canvas.addEventListener('mousedown', (e) => {
      const mouse = this.getMouseCoordinates(e);
      const mx = mouse.x;
      const my = mouse.y;
      const shapes = this.shapes;

      for (let i = 0; i < shapes.length; i++) {
        if (shapes[i].contains(mx, my)) {
          // Keep track of where in the object we clicked
          // so we can move it smoothly (see mousemove)
          this.dragoffx = mx - shapes[i].x;
          this.dragoffy = my - shapes[i].y;
          this.dragging = true;
          this.selection = shapes[i];
          this.shouldRedraw = true;
          return;
        }
      }
      // havent returned means we have failed to select anything.
      // If there was an object selected, we deselect it
      if (this.selection) {
        this.selection = null;
        this.shouldRedraw = true; // Need to clear the old selection border
      }
    }, true);
  }
  /**
   * Listen for mouseUp on canvas for stop dragging
   * @return {undefined}
   */
  listenMouseUp() {
    this.mouseupListener = this.canvas.addEventListener('mouseup', () => {
      this.dragging = false;
    }, true);
  }
  /**
   * Check if the Parallelogram is created
   * @return {undefined}
   */
  isParallelogramDone() {
    return this.shapes.length > 3;
  }
  /**
   * Check if the Parallelogram is not created yet
   * @return {undefined}
   */
  isParallelogramNotDone() {
    return this.shapes.length < 3;
  }
  /**
   * Check if the user already created the 3 points to create the parallelogram
   * @return {undefined}
   */
  areParallelogramPointsCreated() {
    return this.shapes.length === 3;
  }
  /**
   * Listen for mouse move on the canvas
   * @return {undefined}
   */
  listenMouseMove() {
    this.mousemoveListener = this.canvas.addEventListener('mousemove', (e) => {
      if (this.dragging) {
        const mouse = this.getMouseCoordinates(e);
        // We don't want to drag the object by its top-left corner, we want to drag it
        // from where we clicked. Thats why we saved the offset and use it here
        this.selection.x = mouse.x - this.dragoffx;
        this.selection.y = mouse.y - this.dragoffy;

        if (this.isParallelogramDone()) {
          if (this.arePointsLockedToParallelogram) {
            this.shapes[3].x = this.calculateLastPoint().x;
            this.shapes[3].y = this.calculateLastPoint().y;
          }
        }

        this.shouldRedraw = true;
      }
    }, true);
  }
  /**
   * Listen for the double click to create the new points
   * @return {undefined}
   */
  ListenPointCreation() {
    this.dblclickListener = this.canvas.addEventListener('dblclick', (e) => {
      const mouse = this.getMouseCoordinates(e);

      if (this.isParallelogramNotDone()) {
        this.addPoint(new Point(mouse.x, mouse.y, 5.5, '#8B0000'));
      }

      if (this.areParallelogramPointsCreated()) {
        this.addPoint(new Point(this.calculateLastPoint().x, this.calculateLastPoint().y, 5.5, 'grey'))
      }

    }, true);
  }
  /**
   * Calculate the last 4 point to Parallelogram be created
   * @return {x: number, y: Number} {x, y} The coordinates of the new generated point
   */
  calculateLastPoint() {
    return {
      x: this.shapes[0].x + (this.shapes[2].x - this.shapes[1].x),
      y: this.shapes[0].y + (this.shapes[2].y - this.shapes[1].y)
    }
  }
  /**
   * Add a new point into the shapes array
   * @return {undefined}
   */
  addPoint(shape) {
    this.shapes.push(shape);
    this.shouldRedraw = true;
  }
  /**
   * Draw a line stroke on when the user selects a point with the mouse
   * @return {undefined}
   */
  drawSelectionStroke(ctx, selection) {
    ctx.beginPath();
    ctx.strokeStyle = this.selectionColor;
    ctx.lineWidth = this.selectionWidth;
    ctx.arc(selection.x, selection.y, selection.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
  /**
   * Clear the canvas node
   * @return {undefined}
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  /**
   * Toggle Parallelogram stroke lines
   * @return {undefined}
   */
  toggleParallelogram() {
    this.shouldDrawParallelogram = !this.shouldDrawParallelogram;
    this.shouldRedraw = true;
  }
  /**
   * Toggle Ellipse inscribed stroke line
   * @return {undefined}
   */
  toggleEllipseInscribed() {
    this.shouldDrawEllipseInscribed = !this.shouldDrawEllipseInscribed;
    this.shouldRedraw = true;
  }
  /**
   * Look or unlock the parallelogram point calculation
   * @return {undefined}
   */
  togglePointsLockedToParallelogram() {
    if (this.isParallelogramDone()) {
      this.arePointsLockedToParallelogram = !this.arePointsLockedToParallelogram;
      this.shapes[3].x = this.calculateLastPoint().x;
      this.shapes[3].y = this.calculateLastPoint().y;
      this.shouldRedraw = true;
    }
  }
  /**
   * Draw the instructions on how create the points in the screen.
   * @param {Node} Canvas - The canvas node.
   * @return {undefined}
   */
  drawEmptyInstruction(ctx) {
    ctx.beginPath();
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    ctx.fillText('Double click to create a point', this.width / 2, this.height / 2);
    ctx.fill();
    ctx.closePath();
  }
  /**
   * Execute the whole Parallelogram logic and render it.
   * @return {undefined}
   */
  draw() {
    if (this.shouldRedraw) {
      const ctx = this.ctx;
      const shapes = this.shapes;
      this.clear();

      if (!shapes.length) {
        this.drawEmptyInstruction(ctx);
      }

      shapes.forEach((shape) => {
        if (shape.x < this.width || shape.y < this.height || shape.x + shape.w > 0 || shape.y + shape.h > 0) {
          shape.draw(ctx);
        }
      });

      if (this.selection) {
        this.drawSelectionStroke(ctx, this.selection);
      }

      if (this.isParallelogramDone()) {
        if (this.shouldDrawParallelogram) {
          this.drawParallelogramLines();
        }

        if (this.shouldDrawEllipseInscribed) {
          this.drawEllipseInscribed();
        }
      }

      this.shouldRedraw = false;
    }

    requestAnimationFrame(this.draw.bind(this));
  }
  /**
   * Draw each line from all the points created
   * @return {undefined}
   */
  drawParallelogramLines() {
    const ctx = this.ctx;
    const shapes = this.shapes;
    const shapesLength = shapes.length;

    ctx.beginPath();
    ctx.strokeStyle = '#3575D2';
    ctx.lineWidth = 2;

    for (let i = 0; i < shapesLength; i++) {
      if (i === shapesLength - 1) {
        ctx.moveTo(shapes[i].x, shapes[i].y);
        ctx.lineTo(shapes[0].x, shapes[0].y);
      } else {
        ctx.moveTo(shapes[i].x, shapes[i].y);
        ctx.lineTo(shapes[i + 1].x, shapes[i + 1].y);
      }
    }

    ctx.stroke();
    ctx.closePath();
  }
  /**
   * Draw each bezierCurve from the area of the Parallelogram
   * @return {undefined}
   */
  drawEllipseInscribed() {
    const ctx = this.ctx;
    const shapes = this.shapes;
    const shape1MiddleXPoint = shapes[0].x + ((shapes[1].x - shapes[0].x) * 0.5);
    const shape1MiddleYPoint = shapes[0].y + ((shapes[1].y - shapes[0].y) * 0.5);
    const shape2MiddleXPoint = shapes[1].x + ((shapes[2].x - shapes[1].x) * 0.5);
    const shape2MiddleYPoint = shapes[1].y + ((shapes[2].y - shapes[1].y) * 0.5);
    const shape3MiddleXPoint = shapes[2].x + ((shapes[3].x - shapes[2].x) * 0.5);
    const shape3MiddleYPoint = shapes[2].y + ((shapes[3].y - shapes[2].y) * 0.5);
    const shape4MiddleXPoint = shapes[3].x + ((shapes[0].x - shapes[3].x) * 0.5);
    const shape4MiddleYPoint = shapes[3].y + ((shapes[0].y - shapes[3].y) * 0.5);

    ctx.beginPath();
    ctx.strokeStyle = 'gold';
    ctx.lineWidth = 1;
    ctx.moveTo(shape1MiddleXPoint, shape1MiddleYPoint);
    ctx.bezierCurveTo(shapes[1].x, shapes[1].y, shape2MiddleXPoint, shape2MiddleYPoint, shape2MiddleXPoint, shape2MiddleYPoint);
    ctx.moveTo(shape2MiddleXPoint, shape2MiddleYPoint);
    ctx.bezierCurveTo(shapes[2].x, shapes[2].y, shape3MiddleXPoint, shape3MiddleYPoint, shape3MiddleXPoint, shape3MiddleYPoint);
    ctx.moveTo(shape3MiddleXPoint, shape3MiddleYPoint);
    ctx.bezierCurveTo(shapes[3].x, shapes[3].y, shape4MiddleXPoint, shape4MiddleYPoint, shape4MiddleXPoint, shape4MiddleYPoint);
    ctx.moveTo(shape4MiddleXPoint, shape4MiddleYPoint);
    ctx.bezierCurveTo(shapes[0].x, shapes[0].y, shape1MiddleXPoint, shape1MiddleYPoint, shape1MiddleXPoint, shape1MiddleYPoint);
    ctx.stroke();
    ctx.closePath();
  }
  /**
   * Draw each bezierCurve from the area of the Parallelogram
   * @params {Node} e - The event node from the mouse event.
   * @return {x: Number, y: Number} - {x, y} The coordinates x and y from the Canvas
   */
  getMouseCoordinates(e) {
    let rect = this.canvas.getBoundingClientRect();

    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
}

export default Parallelogram;
