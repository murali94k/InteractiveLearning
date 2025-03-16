const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 50;
canvas.height = 50;

let canvasPosition = canvas.getBoundingClientRect();

console.log(Math.floor(window.innerWidth), Math.floor(window.innerHeight), window.devicePixelRatio);

const r = new rive.Rive({
        src: "./Assets/nail.riv",
        // OR the path to a discoverable and public Rive asset
        // src: '/public/example.riv',
        canvas: document.getElementById("canvas1"),
        autoplay: true,
        // artboard: "Arboard", // Optional. If not supplied the default is selected
        stateMachines: "State Machine 1",
    });

function resizeCanvas() {
  canvas.width = 300; //Math.floor(Math.min(window.innerWidth, window.innerHeight)/1.2);
  canvas.height = 300; //Math.floor(Math.min(window.innerWidth, window.innerHeight)/1.2);
  r.resizeDrawingSurfaceToCanvas();
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();