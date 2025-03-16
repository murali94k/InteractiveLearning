const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

let canvasPosition = canvas.getBoundingClientRect();

console.log(window.innerWidth/2)

const canvasWidth =  Math.min(window.innerWidth/2, window.innerHeight/2) ;
const canvasHeight =  Math.min(window.innerWidth/2, window.innerHeight/2)

canvas.width = canvasWidth; //500 px
canvas.height = canvasHeight; // 500 px

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