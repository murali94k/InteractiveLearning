const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


// Input Initialization
const resetButtonElement = document.getElementById('reset-btn');
const qTurnButtonElement = document.getElementById('quarter-btn');
const hTurnButtonElement = document.getElementById('half-btn');
const textButtonElement = document.getElementById('text-btn');



// Canvas size
let canvasPosition = canvas.getBoundingClientRect();
canvas.width = 900;
canvas.height = 480;


// Initializing Variables
const colorPallet = ["#ffffff","#DDA853","#85c1e9","#73c6b6","#e2f311"];
const palletSize = colorPallet.length;
const columns = 4;
const rows = 4;
const boxWidth = 70;
const boxHeight = 70;

const gridLeftX = 0;
const gridLeftY = boxWidth;// top margin space to rotate
const gridRightX = boxWidth*columns + 1*boxWidth;
const gridRightY = boxWidth; // top margin space to rotate

let qTurnClicked = 0;
let rotationSpeed = 2;
let turnAngle = -90;


// MOUSE Clicks
const mouse = {
    x: 0,
    y: 0,
    click: false,
    enable: true
};
canvas.addEventListener('touched', function(event){
        if(event.touches.length == 1){
            mouse.x = event.touches[0].clientX - canvasPosition.left;
            mouse.y = event.touches[0].clientY - canvasPosition.top;
            console.log("touch Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
            mouse.click = true;
        }
});
['mousedown'].forEach( event =>
    canvas.addEventListener(event, function(event){
    if(mouse.enable){
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        console.log("clicking Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
        mouse.click = true;
    }
    if (event.detail > 1) {
        event.preventDefault();
    }
}));



// Box that fits in Grid
class Box{
    constructor(id, startX, startY){
        this.id = id;
        this.clickCount = 0;
        this.fillColor = colorPallet[this.clickCount];
        this.x = startX;
        this.y = startY;
        this.clicked = false;
    }
    isClicked(mouseX, mouseY){
        if( (mouseX>this.x) && (mouseX<(this.x+boxWidth))
         && (mouseY>this.y) && (mouseY < (this.y+boxHeight)) ){
            this.clickCount = (this.clickCount+1)%palletSize
            this.fillColor = colorPallet[this.clickCount];
            qTurnClicked = 0; // once input grids are modified remove solution grid
            turnAngle = -90;
            textButtonElement.innerHTML = "---";
            return true;
         }
        return false;
    }
}


// Grid to fit Boxes in
class Grid{
    constructor(x, y){
        this.startX = x;
        this.startY = y;
        this.boxes = [];
        this.resetGrid();
    }
    resetGrid(){
        let x = this.startX;
        let y = this.startY;
        for(let i=0; i<rows; i++){
            this.boxes[i] = [];
            x = this.startX;
            for(let j=0; j<columns; j++){
                this.boxes[i][j] = new Box(i*columns+j, x, y);
                x += boxWidth;
            }
            y += boxHeight;
        }
    }
    updateGrid(){
        if(mouse.click == true){
            mouse.click = false;
           for(let i=0; i<rows; i++){
                for(let j=0; j<columns; j++){
                    const clicked = this.boxes[i][j].isClicked(mouse.x, mouse.y);
                }//outer loop
           }//inner loop
        }//if
    }
    drawGrid(translatePosX=0, translatePosY=0){
        for(let i=0; i<rows; i++){
            for(let j=0; j<columns; j++){
                 ctx.beginPath();
                 ctx.rect(this.boxes[i][j].x-translatePosX, this.boxes[i][j].y-translatePosY, boxWidth, boxHeight);
                 ctx.fillStyle = this.boxes[i][j].fillColor;
                 ctx.strokeStyle = "black";
                 ctx.fill();
                 ctx.stroke();
                 ctx.closePath();
                }//inner loop
           }//outer loop
    }
}// class


// Game Class

class Game{
    constructor(){
        this.resetGame();
    }
    resetGame(){
        textButtonElement.innerHTML = "---";
        qTurnClicked = 0;
        turnAngle = -90;
        mouse.enable = true;
        this.gridLeft = new Grid(gridLeftX, gridLeftY);
        this.gridRight = new Grid(gridRightX, gridRightY);
    }
    updateGame(){
        this.gridLeft.updateGrid();// checks for the tail clicks
        if(qTurnClicked){// copy the leftGrid box colors
            turnAngle = Math.min(turnAngle + rotationSpeed , qTurnClicked*90);
            for(let i=0; i<rows; i++){
                for(let j=0; j<columns; j++){
                    this.gridRight.boxes[i][j].fillColor = this.gridLeft.boxes[i][j].fillColor;
                }
            }
        }
    }
    drawGame(){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        this.gridLeft.drawGrid();
        if(qTurnClicked){
            //Rotate canvas around right grid center
            let translatePosX = gridRightX + (columns*boxWidth)/2;
            let translatePosY = gridRightY + (rows*boxHeight)/2;
            ctx.translate(translatePosX, translatePosY);
            ctx.rotate((Math.max(turnAngle,0)*Math.PI)/180);

            //Draw right Grids
            this.gridRight.drawGrid(translatePosX, translatePosY);

            //Rotate Back the canvas around right grid center
            ctx.rotate(-(Math.max(turnAngle,0)*Math.PI)/180);
            ctx.translate(-translatePosX, -translatePosY);
        }
    }
}

resetButtonElement.addEventListener("click", ()=>{
    game.resetGame();
})

qTurnButtonElement.addEventListener("click", ()=>{
    qTurnClicked = qTurnClicked+1;
    textButtonElement.innerHTML = "Rotation: "+((qTurnClicked)%4)*90+"&#176";

})

hTurnButtonElement.addEventListener("click", ()=>{
    qTurnClicked = qTurnClicked+2;
    textButtonElement.innerHTML = "Rotation: "+((qTurnClicked)%4)*90+"&#176";

})

let game = new Game();

function animate(){
    game.updateGame();
    game.drawGame();
    requestAnimationFrame(animate);
}
animate();