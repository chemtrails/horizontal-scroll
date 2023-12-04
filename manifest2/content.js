const se = document.scrollingElement;
const mousePosition = { x: 0, y: 0 };

let step = 100;
let negativeStep = -step;
let scrollable = se;
let smooth = false;
let scrollBehavior = 'instant';

main();

browser.storage.onChanged.addListener((changes) => {
  if (changes.step) {
    step = changes.step.newValue;
    negativeStep = -step;
  }

  if (changes.smooth) {
    smooth = changes.smooth.newValue;
    setScrollBehavior();
  }
});

document.addEventListener('mouseover', e => {
  if (e.shiftKey !== false) return;
  scrollable = getScrollable(e.target);
});

document.addEventListener('wheel', e => {
  if (e.shiftKey !== true) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const target = e.ctrlKey === false ? scrollable : se;

  target.scrollBy({
    left: e.deltaY > 0 ? step : negativeStep,
    behavior: scrollBehavior
  });
}, {
  passive: false,
  capture: true
});

document.addEventListener('mousemove', e => {
  if (e.shiftKey !== true) return;
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
});

document.addEventListener('keyup', e => {
  if (e.key !== 'Shift') return;
  scrollable = getScrollable(document.elementFromPoint(mousePosition.x, mousePosition.y));
});

async function main() {
  const res = await browser.storage.local.get(['step', 'smooth']);

  if (res.step) {
    step = res.step;
    negativeStep = -step;
  }

  if (res.smooth) {
    smooth = res.smooth;
    setScrollBehavior();
  }
}

function getScrollable(el) {
  if (el === se) return se;

  try {
    const overflowX = window.getComputedStyle(el).getPropertyValue('overflow-x');

    return (overflowX !== 'visible' && overflowX !== 'clip') && (el.scrollWidth > el.offsetWidth)
      ? el
      : getScrollable(el.parentElement);

  } catch (e) {
    return se;
  }
}

function setScrollBehavior() {
  scrollBehavior = smooth === true ? 'smooth' : 'instant';
}