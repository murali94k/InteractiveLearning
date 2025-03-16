const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

let canvasPosition = canvas.getBoundingClientRect();

console.log(Math.floor(window.innerWidth), Math.floor(window.innerHeight), window.devicePixelRatio);


canvas.width = Math.floor(Math.min(window.innerWidth, window.innerHeight))* window.devicePixelRatio;
canvas.height = Math.floor(Math.min(window.innerWidth, window.innerHeight))*window.devicePixelRatio;

const r = new rive.Rive({
        src: "./Assets/nail.riv",
        // OR the path to a discoverable and public Rive asset
        // src: '/public/example.riv',
        canvas: document.getElementById("canvas1"),
        autoplay: true,
        // artboard: "Arboard", // Optional. If not supplied the default is selected
        stateMachines: "State Machine 1",
        onLoad: () => {
          r.resizeDrawingSurfaceToCanvas();
        },

    });

function resizeCanvas() {
  canvas.width = Math.floor(Math.min(window.innerWidth, window.innerHeight))*window.devicePixelRatio;
  canvas.height = Math.floor(Math.min(window.innerWidth, window.innerHeight))*window.devicePixelRatio;
  r.resizeDrawingSurfaceToCanvas();
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();