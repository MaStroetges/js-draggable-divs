// Import stylesheets
import './style.css';

// Write Javascript code!
const wrapper = document.getElementById('wrapper');
const max = 24;
const wrapperScale = wrapper.clientHeight / 24;
const containers = [0, 12, 18];
const containerHeight = 2;
const containerHeightPx = 2 * wrapperScale;

class ClickedElement {
  constructor(element, type) {
    this.element = element;
    this.type = type;
    this.drag;
  }
}

let lastPressedElement = new ClickedElement(null, 0);

containers.forEach((container) => {
  const containerBox = document.createElement('div');
  containerBox.classList.add('box');

  const item = document.createElement('div');
  item.classList.add('item');
  // console.log(container)
  containerBox.appendChild(item);

  const insetTop = container * wrapperScale;
  const insetBottom = (max - containerHeight - container) * wrapperScale;

  console.log(insetBottom);

  containerBox.setAttribute(
    'style',
    'inset: ' + insetTop + 'px 5px ' + insetBottom + 'px 5px'
  );
  wrapper.appendChild(containerBox);
});

document.addEventListener('mousemove', mouse_move);
document.addEventListener('mousedown', mouse_down);
document.addEventListener('mouseup', mouse_up);

function mouse_move(event) {
  const elementHover = getMouseOverBox(event.clientX, event.clientY);

  if (elementHover.element != null) {
    document.body.style.cursor = 'n-resize';
  } else {
    document.body.style.cursor = 'default';
  }
}

function mouse_down(event) {
  const elementHover = getMouseOverBox(event.clientX, event.clientY);

  if (elementHover.element == null) return;

  lastPressedElement = elementHover;

  console.log(lastPressedElement);
}

function mouse_up(event) {
  lastPressedElement = new ClickedElement(null, 0);
  console.log(lastPressedElement);
}

function getMouseOverBox(mouseX, mouseY) {
  const boxes = wrapper.getElementsByClassName('box');

  for (var i = 0; i < boxes.length; i++) {
    const boxRect = boxes[i].getBoundingClientRect();
    if (between(mouseX, boxRect.x, boxRect.right)) {
      if (inRange(mouseY, boxRect.y, 3)) {
        return new ClickedElement(boxes[i], 1);
      } else if (inRange(mouseY, boxRect.y + containerHeightPx, 3)) {
        return new ClickedElement(boxes[i], 3);
      } else if (between(mouseY, boxRect.y, boxRect.y + boxRect.height)) {
        return new ClickedElement(boxes[i], 2);
      }
    }
  }

  return new ClickedElement(null, -1);
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function inRange(x, y, tolerance) {
  return x >= y - tolerance && x <= y + tolerance;
}

function setCursor() {}
