const canvas = document.getElementById('canvas');
// canvas.style.background = 'black';

function updateCanvasSize() {
  canvas.width = window.innerWidth % 2
    ? window.innerWidth - 1
    : window.innerWidth;
  canvas.height = window.innerHeight % 2
    ? window.innerHeight - 1
    : window.innerHeight;
}

updateCanvasSize();
const center = { x: canvas.width / 2, y: canvas.height / 2 };

window.addEventListener('resize', () => {
  updateCanvasSize();
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
});

const gl = canvas.getContext('2d');
gl.imageSmoothingEnabled = false;