/**
 * @module helpers
 * Collection of helper functions
 */


// HTML DOM
/**
 * get DOM object with its css selector
 * @param {string} css 
 * @returns 
 */
const el = (css) => document.querySelector(css);

// MATH
/**
 * convert degrees to radians
 * @param {number} dig 
 * @returns angle in radians
 */
const digToRad = (dig) => (dig * Math.PI) / 180;
/**
 * convert radians to degrees
 * @param {number} rad
 * @returns angle in degrees
 */
const radToDig = (rad) => (rad * 180) / Math.PI;

// COORDINATES
/**
 * calculate the distance between two points
 * @param {Object} p1
 * @param {Object} p2
 * @returns distance between p1 and p2
 */
const distance = (p1, p2) =>
  Math.sqrt(Math.pow(p2.x - p1.x) + Math.pow(p2.y - p1.y));
/** 
 * calculate the distance between two x coordinates
 * @param {number} x1
 * @param {number} x2
 * @returns distance between x1 and x2
*/
const xDistance = (x1, x2) => x2 - x1;
/** 
 * calculate the distance between two y coordinates
 * @param {number} y1
 * @param {number} y2
 * @returns distance between y1 and y2
*/
const yDistance = (y1, y2) => y2 - y1;
/** 
 * calculate the angle between two points in radians
 * @param {Object} p1
 * @param {Object} p2
 * @returns angle in radians
*/
const xAngleRad = (p1, p2) =>
  Math.round(Math.atan(yDistance(p1.y, p2.y), xDistance(p1.x, p2.x)));

/** 
 * check if a point is inside a circle
 * @param {Object} circle
 * @param {Object} point
 * @returns true if the point is inside the circle
 * @returns false if the point is outside the circle  
*/
function isIntersect(circle, point) {
  return (
    Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) <
    circle.r
  );
}

// TODO: test and fix this function
/** 
 * check if two circles intersect
 * @param {Object} c1
 * @param {Object} c2
 * @returns true if the circles intersect
 * @returns false if the circles do not intersect
*/
function collisionCircleCircle(c1, c2) {
  let dx = c2.x - c1.x;
  let dy = c2.y - c1.y;
  let rSum = c1.r + c2.r;
  
  return dx * dx + dy * dy <= rSum * rSum;
}

/** 
 * check if a circle intersects a rectangle
 * @param {Object} circle
 * @param {Object} rect
 * @returns true if the circle intersects the rectangle
 * @returns false if the circle does not intersect the rectangle
 * @returns true if the circle is inside the rectangle
*/
function collisionCircleRect(circle, rect) {
  let distX = Math.abs(circle.x - rect.x - rect.w / 2);
  let distY = Math.abs(circle.y - rect.y - rect.h / 2);
  if (distX > rect.w / 2 + circle.r) {
    return false;
  }
  if (distY > rect.h / 2 + circle.r) {
    return false;
  }
  if (distX <= rect.w / 2) {
    return true;
  }
  if (distY <= rect.h / 2) {
    return true;
  }
  let dx = distX - rect.w / 2;
  let dy = distY - rect.h / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}


/**
 * check if two rectangles intersect
 * @param {Object} a
 * @param {Object} b
 * @returns true if the rectangles intersect
 * @returns false if the rectangles do not intersect
 */
function collisionRectRect(a, b) {
  if (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * check if a point is inside a rectangle 
 * @param {number} rectX
 * @param {number} rectY
 * @param {number} rectW
 * @param {number} rectH
 * @param {number} cX
 * @param {number} cY
 * @returns true if the point is inside the rectangle
 * @returns false if the point is outside the rectangle
 */
function cursorHitTest(rectX, rectY, rectW, rectH, cX, cY) {
  return cX < rectX + rectW 
  && cX >= rectX
  && cY < rectY + rectH
  && cY >= rectY;
}

// CSS Helpers

/**
 * get the value of a CSS rule
 * @param {string} selector
 * @param {string} style
 * @returns the value of the CSS rule
 */
function get_style_rule_value(selector, style) {
  for (var i = 0; i < document.styleSheets.length; i++) {
    var mysheet = document.styleSheets[i];

    var myrules = mysheet.cssRules ? mysheet.cssRules : mysheet.rules;

    for (var j = 0; j < myrules.length; j++) {
      if (
        myrules[j].selectorText &&
        myrules[j].selectorText.toLowerCase() == selector.toLowerCase()
      ) {
        return myrules[j].style[style];
      }
    }
  }
}

// UUID
/**
 * generate a UUID v4
 * @returns UUID v4
 */
function generateUuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}


export {
  el,
  digToRad,
  radToDig,
  distance,
  xDistance,
  yDistance,
  xAngleRad,
  get_style_rule_value,
  cursorHitTest,
  isIntersect,
  generateUuidv4,
};
