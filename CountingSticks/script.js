const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const nextButtonElement = document.getElementById('next-btn');
const newButtonElement = document.getElementById('new-btn');


let canvasPosition = canvas.getBoundingClientRect();

console.log(canvasPosition)

canvas.width = 450; //600 px
canvas.height = 300; // 300 px

const spriteSheetLeft = "../Resources/leftHand.png";
const spriteSheetRight = "../Resources/rightHand.png";
let audio = new Audio('audio_file.mp3');
const spriteRows = 11;
const spriteColumns = 5;
const spriteWidth = 3000/spriteColumns; // sheet width in px / columns
const spriteHeight = 6581/spriteRows; // sheet height in px / rows
const leftHandImage = new Image();
leftHandImage.src = spriteSheetLeft
const rightHandImage = new Image();
rightHandImage.src = spriteSheetRight
const frameRate = 10; // motion after 10 frames
const maxAnimationStage = 6; // 1-Open left hand | 2-close left hand | 3-Open Right hand | 4- Close Right hand | 5- Clap both hands | 6- show result
const maxSticksCount = 9;

let animationStage = 0;
let currentFrame = 0;

// handle touch and mouse clicks

// MOUSE Clicks
const mouse = {
    x: 0,
    y: 0,
    click: false,
    clickType: "DEFAULT",
    disable: false
};

canvas.addEventListener('touchstart', function(event){
        if(event.touches.length == 1){
        mouse.x = event.touches[0].clientX - canvasPosition.left;
        mouse.y = event.touches[0].clientY - canvasPosition.top;
		if(! nextButtonElement.disabled){
		    mouse.disable=true;
			mouse.click = true;
			}
		}
});
canvas.addEventListener('mouseup', function(event){
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        console.log(event.x, event.y);
        if(! nextButtonElement.disabled){
               if( (mouse.x>0) && (mouse.x<canvas.width/2)
                && (mouse.y>0) && (mouse.y< canvas.height) ){
                animationStage = 1; // left hand clicked
             }
            if( (mouse.x>canvas.width/2) && (mouse.x<canvas.width)
                && (mouse.y>0) && (mouse.y< canvas.height) ){
                animationStage = 2; // right hand clicked
             }
	   }
});

function isClicked(){

         return 0;
    }


// Generate random integer number from 0 to max-1
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


class Game{
    constructor(){
        this.leftMotionIndex = 0;
        this.rightMotionIndex = 0;
        this.leftRowIndex = getRandomInt(maxSticksCount-1); // left hand can have sticks from 1 to maxSticksCount-1 so that right will have at-least 1
        this.rightRowIndex = getRandomInt(maxSticksCount - 1 - this.leftRowIndex);
        this.totalSticks = 1 + this.leftRowIndex + this.rightRowIndex;
        currentFrame = 0;
    }

    newGame(){
        this.leftMotionIndex = 0;
        this.rightMotionIndex = 0;
        this.leftRowIndex = getRandomInt(maxSticksCount-1); // left hand can have sticks from 1 to maxSticksCount-1 so that right will have at-least 1
        this.rightRowIndex = getRandomInt(maxSticksCount - 1 - this.leftRowIndex);
        this.totalSticks = this.leftRowIndex + this.rightRowIndex;
        currentFrame = 0;
        animationStage = 0;

        //Enable buttons
        nextButtonElement.disabled = false; // enable button
        nextButtonElement.innerHTML = "Next"; // disable button
    }
    updateGame(){
        switch(animationStage){
            case 1: // Open left hand motion
                this.leftMotionIndex = Math.min(this.leftMotionIndex + 1, spriteColumns-1);
                if(this.leftMotionIndex == spriteColumns-1){ // animation completed
                    nextButtonElement.disabled = false;
                }
                else{ // animation running
                    nextButtonElement.disabled = true;
                }
                break;
            case 2: // Close left hand motion
                this.leftMotionIndex = Math.max(this.leftMotionIndex - 1, 0);
                if(this.leftMotionIndex == 0)// left hand fully closed
                {
                    animationStage = 3; // move to next animation stage automatically
                }
                nextButtonElement.disabled = true;
                break;
            case 3: // Open right hand motion
                this.rightMotionIndex = Math.min(this.rightMotionIndex + 1, spriteColumns-1);
                if(this.rightMotionIndex == spriteColumns-1){ // animation completed
                    nextButtonElement.disabled = false;
                }
                break;
            case 4: // Close right hand motion
                this.rightMotionIndex = Math.max(this.rightMotionIndex - 1, 0);
                if(this.rightMotionIndex == 0)// right hand fully closed
                {
                    animationStage = 5; // move to next animation stage automatically
                }
                nextButtonElement.disabled = true;
                break;
            case 5: // Clap hand motion
                this.leftRowIndex = 10;
                this.rightRowIndex = 10;
                this.leftMotionIndex = Math.min(this.leftMotionIndex + 1, spriteColumns-1);
                this.rightMotionIndex = Math.min(this.rightMotionIndex + 1, spriteColumns-1);
                if(this.rightMotionIndex == spriteColumns-1)// animation completed
                {
                    nextButtonElement.disabled = false;
                    nextButtonElement.innerHTML = "Show Hand"
                }
                break;
            case 6: // Show the answer
                nextButtonElement.disabled = true; // disable button
                // Reverse the clap motion
                this.leftMotionIndex = Math.max(this.leftMotionIndex - 1, 0);
                this.rightMotionIndex = Math.max(this.rightMotionIndex - 1, 0); // remove this hand after reverse clap
                if(this.leftMotionIndex == 0)// finished the clap reverse
                {
                    this.rightMotionIndex = spriteColumns-1;
                    this.rightRowIndex = 0;
                    // Show the final answer in left hand
                    this.leftRowIndex = this.totalSticks;
                    this.leftMotionIndex = spriteColumns-1;
                    animationStage = 10; // random high number to end animation
                }

        }
    }
    drawGame(){
        // ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(leftHandImage, this.leftMotionIndex*spriteWidth-10, this.leftRowIndex*spriteHeight, spriteWidth, spriteHeight, 0, 0, canvas.width/2, canvas.height);
        ctx.drawImage(rightHandImage,  this.rightMotionIndex*spriteWidth-10, this.rightRowIndex*spriteHeight, spriteWidth, spriteHeight, canvas.width/2-8, 25, canvas.width/2, canvas.height-25);
    }

}

game = new Game();

newButtonElement.addEventListener("click", ()=>{
    game.newGame();
});

nextButtonElement.addEventListener("click", ()=>{
    animationStage = Math.min(animationStage + 1, maxAnimationStage);
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