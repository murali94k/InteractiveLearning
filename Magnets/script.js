const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const resetButtonElement = document.getElementById('reset-btn');
const newButtonElement = document.getElementById('new-btn');


let canvasPosition = canvas.getBoundingClientRect();

//
//const canvasWidth =   window.innerWidth;
//const canvasHeight =  window.innerHeight;
//
//canvas.width = canvasWidth; //600 px
//canvas.height = canvasHeight; // 300 px

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