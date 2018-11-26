/* global document, window */
import Parallelogram from './Parallelogram';

const app = init();


/**
 * Init the application.
 * @returns {object} Get the object with all app functionalities.
 */
function init() {
  const canvasSelector = document.getElementById('canvas-app');
  const resetButton = document.getElementById('app-reset');
  const paralleloGramToggleButton = document.getElementById('app-parallelogram');
  const ellipseToggleButton = document.getElementById('app-ellipse');
  const toggleParallelogramLock = document.getElementById('app-lockParallelogram');
  let s = new Parallelogram(canvasSelector);

  resetButton.addEventListener('click', () => app.resetProgram());
  paralleloGramToggleButton.addEventListener('click', () => s.toggleParallelogram());
  ellipseToggleButton.addEventListener('click', () => s.toggleEllipseInscribed());
  toggleParallelogramLock.addEventListener('click', () => s.togglePointsLockedToParallelogram());

  return {
    resetProgram: () => {
      s.beforeGetsDestroyed();
      s = null;
      s = new Parallelogram(canvasSelector);
    },
    toggleParallelogram: () => {
      s.toggleParallelogram();
    },
    toggleEllipseInscribed: () => {
      s.toggleEllipseInscribed();
    },
    togglePointsLockedToParallelogram: () => {
      s.togglePointsLockedToParallelogram();
    }
  }
}

// this is the hot module replacement.
if (window.module) {
  window.module.hot.accept();
}
