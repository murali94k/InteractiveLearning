
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const resetButtonElement = document.getElementById('reset-btn');
//const infoButtonElement = document.getElementById('info-btn');

let inputState = null;

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
        onLoad: (_) => {
            r.resizeDrawingSurfaceToCanvas();
            r.resizeToCanvas()
        },
    });


resetButtonElement.onclick = function() {
//    console.log("click", inputs);
  // Play the 'bumpy' state machine
  r.reset({
    stateMachines: "State Machine 1",
    autoplay: true,
  });
  r.play("State Machine 1");
};


//infoButtonElement.onclick = function() {
//    inputState = r.stateMachineInputs("State Machine 1");
//    inputState.forEach(i => {
//                const inputName = i.name;
//                const inputType = i.type;
//                console.log(inputName, inputType, i.value);
//            });
//};

//setButtonElement.onclick = function() {
//    inputState = r.stateMachineInputs("State Machine 1");
//    inputState.forEach(i => {
//                const inputName = i.name;
//                const inputType = i.type;
//                console.log(inputName, inputType, i.value);
//                if((i.name=="MagnetClicked") | (i.name=="NailArea")){
//                    i.value=true;
//                }
//                console.log(inputName, inputType, i.value);
//            });
//
//};


const EventType = {
  Load : "load", // When Rive has successfully loaded in the Rive file
  LoadError : "loaderror", // When Rive cannot load the Rive file
  Play : "play", // When Rive plays an entity or resumes the render loop
  Pause : "pause", // When Rive pauses the render loop and playing entity
  Stop : "stop", // When Rive stops the render loop and playing entity
  Loop : "loop", // (Singular animations only) When Rive loops an animation
  Advance : "advance", // When Rive advances the animation in a frame
  StateChange : "statechange", // When a Rive state change is detected
  RiveEvent : "riveevent", // When a Rive Event gets reported
}

function riveEventHandler(event){
    console.log("EVENT--->",event);

}

r.on(EventType.StateChange , riveEventHandler);


function resizeCanvas() {
  r.resizeDrawingSurfaceToCanvas();
  r.resizeToCanvas()
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();