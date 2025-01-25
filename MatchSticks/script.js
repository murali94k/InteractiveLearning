const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const resetButtonElement = document.getElementById('reset-btn');
const newButtonElement = document.getElementById('new-btn');


let canvasPosition = canvas.getBoundingClientRect();

const windowPadding = 100;
canvas.width = window.innerWidth-windowPadding; //600 px
canvas.height = window.innerHeight-windowPadding; // 300 px

// Variables
const stickWidth = canvas.width/10;
const stickHeight = canvas.height/25;
const stickCount = 10;
const headRatio = 0.1;



// handle touch and mouse clicks
const mouse = {
    x: 0,
    y: 0,
    click: false,
    clickType: "UP",
    distanceX: 0,
    distanceY: 0
};

canvas.addEventListener('touchstart', function(event){
        if(event.touches.length == 1){
        mouse.x = event.touches[0].clientX - canvasPosition.left;
        mouse.y = event.touches[0].clientY - canvasPosition.top;
        mouse.clickType = "DOWN";
//        console.log("Touch Down Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
		}
});
canvas.addEventListener('touchend', function(event){
        mouse.clickType = "UP";
//        console.log("Touch Up Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
});
canvas.addEventListener('touchmove', function(event){
        if(event.touches.length == 1){
        mouse.x = event.touches[0].clientX - canvasPosition.left;
        mouse.y = event.touches[0].clientY - canvasPosition.top;
        mouse.clickType = "DRAG";
//        console.log("Touch Move Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
		}
});


canvas.addEventListener('mousedown', function(event){
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        mouse.clickType = "DOWN";
//        console.log("Mouse Down Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
});
canvas.addEventListener('mousemove', function(event){
        if(mouse.clickType == "DOWN" || mouse.clickType == "DRAG"){
            mouse.x = event.x - canvasPosition.left;
            mouse.y = event.y - canvasPosition.top;
            mouse.clickType = "DRAG";
//            console.log("Mouse Move Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
        }
});
canvas.addEventListener('mouseup', function(event){
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        mouse.clickType = "UP";
//        console.log("Mouse Up Registered at: ",mouse.x, mouse.y, " on screen at: ", event.x, event.y);
});

// Generate random integer number from 0 to max-1
function getRandomInt(min, max) {
  return Math.floor(Math.random() * max)+min;
}

// Match stick
class Stick{
    constructor(){
        this.lx = stickWidth;
        this.ly = 2*stickHeight;
        this.rx = this.lx+stickWidth;
        this.ry = this.ly;
        this.hx = this.rx+headRatio*stickWidth;;
        this.hy = this.ry
        this.stickColor="#f4d03f";
        this.headColor = "#873600";
        this.theta = Math.PI;
    }
    updateStick(){

    }
    drawStick(){
        // draw stick
        ctx.lineWidth = stickHeight;
        ctx.strokeStyle = this.stickColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.lx, this.ly); // top left
        ctx.lineTo(this.rx, this.ry); // top right
        ctx.stroke();
        ctx.closePath();

        // draw head
        ctx.strokeStyle = this.headColor;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.rx, this.ry); // top left
        ctx.lineTo(this.hx, this.hy); // top right
        ctx.stroke();
        ctx.closePath();


    }
    isClicked(x, y){
        // equation of a line with two points : y-y1 = (y2-y1)/(x2-x1)*(x-x1)
        const lhs = (y-this.ly);
        const rhs = ((this.hy - this.ly)/(this.hx-this.lx)*(x-this.lx));
        if( ( Math.abs(lhs-rhs) < stickHeight) &&
           ( (x > Math.min(this.lx, this.hx)) && (x < Math.max(this.lx, this.hx))
         && (y > Math.min(this.ly-stickHeight, this.hy-stickHeight)) && (y < Math.max(this.ly+stickHeight, this.hy+stickHeight)) )
         ){
            return true;
        }
        return false;
    }
}


class Game{
    constructor(){
        this.sticks = [];
        this.newGame();
    }
    newGame(){
        this.selectedStick = null;
        this.moveType = ""; // rotate or drag sticks
        for(let i=0; i<stickCount; i++){
            this.sticks[i] = new Stick();
        }
    }
    updateGame(){
        if(mouse.clickType == "DOWN")
        {
            for(let i=0; i<stickCount; i++)
            {
                if(this.sticks[i].isClicked(mouse.x, mouse.y)){
                    this.selectedStick = this.sticks[i];
                    mouse.distanceX = mouse.x-this.selectedStick.lx; // get the distance from stick start from click point
                    mouse.distanceY = mouse.y-this.selectedStick.ly; // get the distance from stick start from click point
                    if( (mouse.x > this.selectedStick.rx-headRatio*stickWidth) &&
                        (mouse.x < this.selectedStick.rx+headRatio*stickWidth) &&
                        (mouse.y > this.selectedStick.ry-headRatio*stickWidth) &&
                        (mouse.y < this.selectedStick.ry+headRatio*stickWidth)
                    ){
                        this.moveType = "ROTATE";
                    }
                    else{
                        this.moveType = "MOVE";
                    }
                    break;
                }
            }// for
        }// if
        else if(mouse.clickType == "UP"){
            this.selectedStick = null;
        }
        if((this.selectedStick != null) & (mouse.clickType=="DRAG")){
            if(this.moveType == "ROTATE")
            {
                this.selectedStick.theta = Math.atan2((this.selectedStick.ly-mouse.y),(this.selectedStick.lx-mouse.x));// gives radian
            }
            else
            {
                this.selectedStick.lx = mouse.x-mouse.distanceX;
                this.selectedStick.ly = mouse.y-mouse.distanceY;
            }
            this.selectedStick.rx = this.selectedStick.lx+stickWidth*Math.cos(this.selectedStick.theta+Math.PI);
            this.selectedStick.ry = this.selectedStick.ly+stickWidth*Math.sin(this.selectedStick.theta+Math.PI);
            this.selectedStick.hx = this.selectedStick.rx+headRatio*stickWidth*Math.cos(this.selectedStick.theta+Math.PI);
            this.selectedStick.hy = this.selectedStick.ry+headRatio*stickWidth*Math.sin(this.selectedStick.theta+Math.PI);
        }

    }

    drawGame(){
        for(let i=0; i<stickCount; i++){
            this.sticks[i].drawStick();
        }
    }

}

game = new Game();

newButtonElement.addEventListener("click", ()=>{
    game.newGame();
});

resetButtonElement.addEventListener("click", ()=>{
    game.newGame();
});


function animate(){
    // Reduces the frame rate of the game
    ctx.clearRect(0,0, canvas.width, canvas.height);
    game.updateGame();
    game.drawGame();
    requestAnimationFrame(animate);
}

animate();