const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const newButtonElement = document.getElementById('new-btn');
const cardRadioElement = document.getElementById('card');
const cubeRadioElement = document.getElementById('cube');
const triangleRadioElement = document.getElementById('triangle');


let canvasPosition = canvas.getBoundingClientRect();
const canvasWidth =  window.innerWidth/1.5;
const canvasHeight =  window.innerHeight/1.2

canvas.width = canvasWidth; //600 px
canvas.height = canvasHeight; // 300 px
const paddingWidth = 50;

// Card Variables
const cardWidth = canvasWidth/4;
const cardHeight = canvasWidth/2.5;
const fontSize = canvasWidth/5;
const fontSizeSmall = fontSize/4;

//Cube Variables
const cubeSideLength = Math.min(canvasHeight/20,canvasWidth/29);

//Variables
let screen = "card";


// Generate random integer number from 0 to max-1
function getRandomInt(min, max) {
  return Math.floor(Math.random() * max)+min;
}

// Number Card
class Card{
    constructor(value){
        this.textColor = "#0b5345";
        this.backgroundColor = "#ebdef0";
        this.value = value;
        this.x = canvasWidth/2-cardWidth/2;
        this.y = canvasHeight/2-cardHeight/2;
        this.textX = canvasWidth/2;
        this.textY = canvasHeight/2;
        this.textTX = this.x+fontSizeSmall;
        this.textTY = this.y+fontSizeSmall;
        this.textBX = this.x+cardWidth-fontSizeSmall;
        this.textBY = this.y+cardHeight-fontSizeSmall;
    }
    newCard(value = this.value){
        this.value = value+"";
    }
    drawCard(){
        // draw card at the center
         ctx.beginPath();
         ctx.roundRect(this.x, this.y, cardWidth, cardHeight, 15);
         ctx.fillStyle = this.backgroundColor;
         ctx.lineWidth = 5;
         ctx.strokeStyle = "#000000";// black border
         ctx.fill();
         ctx.stroke();
         ctx.closePath();

        // Card Number
         ctx.font = fontSize+"px serif";
         ctx.fillStyle = this.textColor;
         ctx.textBaseline = "middle";
         ctx.textAlign = "center";
         ctx.fillText(this.value, this.textX, this.textY);
         ctx.font = (fontSizeSmall)+"px serif";
         ctx.fillText(this.value, this.textTX, this.textTY);
         ctx.fillText(this.value, this.textBX, this.textBY);
    }

}



// Cubes
class Cube{
    constructor(value){
        this.value = value;
        this.x = cubeSideLength;
        this.y = canvasHeight-canvasHeight/10;
        this.cubeColors = [["#ebdef0", "#4a235a", "#a569bd" ],
        ["#d1f2eb", "#0b5345", "#16a085" ]] // top, right, left
    }
    newCube(value=this.value){
        this.value = value;
    }
    drawCube(x, y, colorIndex=0){
        class Point {
          constructor(x, y) {
            this.x = x;
            this.y = y;
          }
        }
        let vertices = [new Point(x, y)];
         for (let a = 0; a < 6; a++) {
            vertices.push(new Point(x + Math.cos(((a * 60) - 30) * Math.PI / 180) * cubeSideLength, y + Math.sin(((a * 60) - 30) * Math.PI / 180) * cubeSideLength));
         }
         //top face
         ctx.fillStyle = this.cubeColors[colorIndex][0];
         ctx.beginPath();
         ctx.moveTo(vertices[0].x, vertices[0].y);
         ctx.lineTo(vertices[5].x, vertices[5].y);
         ctx.lineTo(vertices[6].x, vertices[6].y);
         ctx.lineTo(vertices[1].x, vertices[1].y);
         ctx.lineTo(vertices[0].x, vertices[0].y);
         ctx.fill();

         // right face
         ctx.fillStyle = this.cubeColors[colorIndex][1];;
         ctx.beginPath();
         ctx.moveTo(vertices[0].x, vertices[0].y);
         ctx.lineTo(vertices[1].x, vertices[1].y);
         ctx.lineTo(vertices[2].x, vertices[2].y);
         ctx.lineTo(vertices[3].x, vertices[3].y);
         ctx.lineTo(vertices[0].x, vertices[0].y);
         ctx.fill();

         // left face
         ctx.fillStyle = this.cubeColors[colorIndex][2];
         ctx.beginPath();
         ctx.moveTo(vertices[0].x, vertices[0].y);
         ctx.lineTo(vertices[3].x, vertices[3].y);
         ctx.lineTo(vertices[4].x, vertices[4].y);
         ctx.lineTo(vertices[5].x, vertices[5].y);
         ctx.lineTo(vertices[0].x, vertices[0].y);
         ctx.fill();
        }
    drawMultipleCubes(){
        const tens = Math.floor(this.value/10);
        const ones = this.value%10;
        console.log("Tens ",tens," ones ",ones);
        // draw tens cube tower
        for(let i=0; i<tens; i++){
            for(let j=0; j<10; j++){
                this.drawCube(this.x+i*(cubeSideLength+4*cubeSideLength/2), this.y-j*(cubeSideLength+4), 0);
            }
        }
        // draw ones cube
        for(let i=0; i<ones; i++){
            this.drawCube(this.x+i*(cubeSideLength+4*cubeSideLength/2), this.y-12*(cubeSideLength+4), 1);
        }
    }

}


class Game{
    constructor(){
        this.newGame();
    }
    newGame(){
        this.value = getRandomInt(0,99);
        this.card = new Card(this.value);
        this.cube = new Cube(this.value);
//        this.trinagle = new Triangle(this.value);

        this.card.newCard();
        this.cube.newCube();
//        this.triangle.newTriangle();

    }
    updateGame(){

    }
    drawGame(){
       if(screen == "card"){
            this.card.drawCard();
        }
        else if(screen == "cube"){
            this.cube.drawMultipleCubes();
        }
//        else{
//            this.triangle,drawTriangle();
//        }
    }

}

game = new Game();
game.updateGame();
game.drawGame();


// add event listener for radio button
if(document.querySelector('input[name="screen"]')){
    document.querySelectorAll('input[name="screen"]').forEach((elem) => {
        elem.addEventListener("click", function(event){
            screen = event.target.value;
            game.drawGame();
            console.log("Selected Screen - ",screen);
        });
    });
}

newButtonElement.addEventListener("click", ()=>{
    game.newGame();
});

function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    game.updateGame();
    game.drawGame();
    requestAnimationFrame(animate);
}
animate();



