// HTML DOM
const el = (css) => document.querySelector(css);

// MATH
const digToRad = (dig) => (dig * Math.PI) / 180;
const radToDig = (rad) => (rad * 180) / Math.PI;

// COORDINATES
const distance = (p1, p2) =>
  Math.sqrt(Math.pow(p2.x - p1.x) + Math.pow(p2.y - p1.y));
const xDistance = (x1, x2) => x2 - x1;
const yDistance = (y1, y2) => y2 - y1;
const xAngleRad = (p1, p2) =>
  Math.round(Math.atan(yDistance(p1.y, p2.y), xDistance(p1.x, p2.x)));

function isIntersect(circle, point) {
  return (
    Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) <
    circle.r
  );
}

// TODO: test and fix this function
function collisionCircleCircle(c1, c2) {
  let dx = c2.x - c1.x;
  let dy = c2.y - c1.y;
  let rSum = c1.r + c2.r;
  
  return dx * dx + dy * dy <= rSum * rSum;
}

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

function cursorHitTest(rectX, rectY, rectW, rectH, cX, cY) {
  return cX < rectX + rectW 
  && cX >= rectX
  && cY < rectY + rectH
  && cY >= rectY;
}

// CSS Helpers

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
