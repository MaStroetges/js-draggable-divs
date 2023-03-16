// Import stylesheets
import './style.css';

class containerItem {
  constructor(topValue = 0, height = 1) {
    this.topValue = topValue;
    this.height = height;
  }
}

class ClickedElement {
  constructor(element = null, type = -1, drag = false, startX = 0, startY = 0) {
    this.element = element;
    this.type = type;
    this.drag = drag;
    this.startX = startX;
    this.startY = startY;
    if (element != null) {
      this.dataIndex = element.getAttribute('data-index');
      this.startTop = parseInt(element.style.top);
      this.startBottom = parseInt(element.style.bottom);
    } else {
      this.dataIndex = -1;
      this.startTop = 0;
      this.startBottom = 0;
    }
    this.dragDistX = 0;
    this.dragDistY = 0;
    this.snapTop = 0;
    this.snapHeight = 0;
  }
}

// Write Javascript code!
const wrapper = document.getElementById('wrapper');
const max = 24;
const wrapperScale = wrapper.clientHeight / max;
const containers = [new containerItem(6, 3), new containerItem(10, 5)];
// const containerHeight = 3;
// const containerHeightPx = containerHeight * wrapperScale;

let lastPressedElement = new ClickedElement(null, 0);
const template = document.getElementById('wrapperTemplate');

containers.forEach((container, index) => {
  const templateClone = template.childNodes[1].cloneNode(true);

  console.log(template.childNodes[1]);

  const insetTop = container.topValue * wrapperScale;
  const insetBottom =
    (max - container.height - container.topValue) * wrapperScale;
  setInset(templateClone, insetTop, insetBottom);
  templateClone.setAttribute('data-index', index);

  wrapper.appendChild(templateClone);

  // const containerBox = document.createElement('div');
  // containerBox.classList.add('box');

  // const item = document.createElement('div');
  // item.classList.add('item');
  // containerBox.appendChild(item);

  // const insetTop = container.topValue * wrapperScale;
  // const insetBottom =
  //   (max - container.height - container.topValue) * wrapperScale;

  // containerBox.setAttribute('style', '');
  // containerBox.setAttribute('draggable', 'false');
  // setInset(containerBox, insetTop, insetBottom);
  // containerBox.setAttribute('data-index', index);

  // wrapper.appendChild(containerBox);
});

template.remove();

document.addEventListener('mousemove', mouse_move);
document.addEventListener('mousedown', mouse_down);
document.addEventListener('mouseup', mouse_up);

document.addEventListener('touchmove', mouse_move);
document.addEventListener('touchstart', mouse_down);
document.addEventListener('touchend', mouse_up);

function mouse_move(event) {
  const elementHover = getMouseOverBox(event.clientX, event.clientY);

  switch (elementHover.type) {
    case 1:
      document.body.style.cursor = 'n-resize';
      break;
    case 2:
      document.body.style.cursor = 'move';
      break;
    case 3:
      document.body.style.cursor = 'n-resize';
      break;
    default:
      document.body.style.cursor = 'default';
  }

  if (lastPressedElement.element != null) {
    lastPressedElement.drag = true;

    lastPressedElement.dragDistX = event.clientX - lastPressedElement.startX;
    lastPressedElement.dragDistY = event.clientY - lastPressedElement.startY;

    const insetTop = lastPressedElement.startTop + lastPressedElement.dragDistY;

    let insetTopSnap = lastPressedElement.startTop;
    let insetBottomSnap = lastPressedElement.startBottom;

    if (lastPressedElement.type == 1 || lastPressedElement.type == 2) {
      insetTopSnap = Math.round(snapToIncrement(insetTop));
      if (insetTopSnap < 0) {
        insetTopSnap = 0;
      }
    }
    if (lastPressedElement.type == 2) {
      const maxPx = max * wrapperScale;
      const containerHeightPx =
        containers[lastPressedElement.dataIndex].height * wrapperScale;
      insetBottomSnap = Math.round(maxPx - containerHeightPx - insetTopSnap);
    }
    if (lastPressedElement.type == 3) {
      const insetBottom =
        lastPressedElement.startBottom - lastPressedElement.dragDistY;
      insetBottomSnap = Math.round(snapToIncrement(insetBottom));
      if (insetBottomSnap < 0) {
        insetBottomSnap = 0;
      }
      console.log(insetBottomSnap);
    }

    lastPressedElement.snapTop = Math.round(insetTopSnap / wrapperScale);
    lastPressedElement.snapHeight = Math.round(
      max - (insetTopSnap + insetBottomSnap) / wrapperScale
    );

    if (lastPressedElement.snapHeight < 1) {
      lastPressedElement.snapHeight = 1;
      return;
    }

    if (insetTopSnap >= 0 && insetBottomSnap >= 0) {
      setInset(lastPressedElement.element, insetTopSnap, insetBottomSnap);
    }
  }
}

function mouse_down(event) {
  console.log('Mouse down');
  const elementHover = getMouseOverBox(event.clientX, event.clientY);

  if (elementHover.element == null) return;

  lastPressedElement = elementHover;
}

function mouse_up(event) {
  console.log('Mouse up');
  console.log(lastPressedElement);

  if (containers[lastPressedElement.dataIndex] != null) {
    if (lastPressedElement.drag == true) {
      containers[lastPressedElement.dataIndex].topValue = Math.round(
        lastPressedElement.snapTop
      );
      containers[lastPressedElement.dataIndex].height = Math.round(
        lastPressedElement.snapHeight
      );
    } else {
      alert('click !');
    }
  }

  lastPressedElement = new ClickedElement(null, 0);
}

function getMouseOverBox(mouseX, mouseY) {
  const boxes = wrapper.getElementsByClassName('box');

  for (var i = 0; i < boxes.length; i++) {
    const boxRect = boxes[i].getBoundingClientRect();
    const boxHeightPx =
      containers[boxes[i].getAttribute('data-index')].height * wrapperScale;
    if (between(mouseX, boxRect.x, boxRect.right)) {
      if (inRange(mouseY, boxRect.y, 3)) {
        return new ClickedElement(boxes[i], 1, false, mouseX, mouseY);
      } else if (inRange(mouseY, boxRect.y + boxHeightPx, 3)) {
        return new ClickedElement(boxes[i], 3, false, mouseX, mouseY);
      } else if (between(mouseY, boxRect.y, boxRect.y + boxRect.height)) {
        return new ClickedElement(boxes[i], 2, false, mouseX, mouseY);
      }
    }
  }

  return new ClickedElement();
}

function between(x, min, max) {
  return x >= min && x <= max;
}

function inRange(x, y, tolerance) {
  return x >= y - tolerance && x <= y + tolerance;
}

function setInset(Element, Top, Bottom, Left = 0, Right = 0) {
  Element.style.top = Top + 'px';
  Element.style.bottom = Bottom + 'px';
  Element.style.left = Left + 'px';
  Element.style.right = Right + 'px';
}

function snapToIncrement(value) {
  const valueOffset = value + wrapperScale / 2;
  const valueSnap = valueOffset - (valueOffset % wrapperScale);

  return valueSnap;
}
