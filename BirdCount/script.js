const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Setting Buttons
const nextButtonElement = document.getElementById('next-btn');
const newButtonElement = document.getElementById('new-btn');
const answerButtonElement = document.getElementById('answer-btn');

// Setting Images
const backgroundImage = new Image();
backgroundImage.src = "../Resources/birdBackground.png";
const birdImage = new Image();
birdImage.src = "../Resources/birdFlyingIn.png";

// Setting Canvas
let canvasPosition = canvas.getBoundingClientRect();
const canvasWidth = 700;
const canvasHeight = 400;
canvas.width = canvasWidth; //600 px
canvas.height = canvasHeight; // 300 px

// Initializing Variables
const spriteRows = 1;
const spriteColumns = 7;
const cameraWidth = canvasWidth/2;
const cameraHeight = canvasHeight/2;
const spriteCellWidth = 4191/spriteColumns; // sheet width in px / columns
const spriteCellHeight = 824/spriteRows; // sheet height in px / rows
const backgroundWidth = 3000 ;
const backgroundHeight = 5000;
const frameRate = 10; // motion after 10 frames
const backgroundSpeed = 10;
const birdSpreadX = 50;
const birdSpreadY = 70;



let backgroundX = 0;
let cameraX = 0;
let cameraY = canvasHeight;
let spriteColumnIndex = 0;
let spriteRowIndex = 0;
let currentFrame = 0;
let backgroundRowIndex = 0; // 0 for sky and 1 for wall image in background
let backgroundColumnIndex = 0;

// Generate random integer number from 0 to max-1
function getRandomInt(min, max) {
  return min+Math.floor(Math.random() * max);
}


class Game{
    constructor(){

    }

    newGame(){

    }
    updateGame(){
        backgroundX = (backgroundX + backgroundSpeed) % (backgroundWidth-canvasWidth);
        cameraX = cameraX + backgroundSpeed*0.5;
        cameraY = cameraY - backgroundSpeed*0.5;
        spriteColumnIndex = (spriteColumnIndex+1)%5;
    }
    drawGame(){
        // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(backgroundImage, backgroundX, 0, 4*canvas.width, 4*canvas.height, 0,0, canvas.width, canvas.height);// moving background image
        for(let i=0; i<5; i++){
            ctx.drawImage(birdImage, (spriteColumnIndex+i)%5*spriteCellWidth, 0, spriteCellWidth, spriteCellHeight,
            cameraX+i*birdSpreadX, cameraY+i*birdSpreadY, cameraWidth/2, cameraHeight/2);
        }
    }

}

game = new Game();

newButtonElement.addEventListener("click", ()=>{

});

nextButtonElement.addEventListener("click", ()=>{

});


function animate(){
    // Reduces the frame rate of the game
    if (currentFrame == 0){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.updateGame();
        game.drawGame();
    }

    currentFrame = (currentFrame + 1)%frameRate;
    requestAnimationFrame(animate);
}

animate();