const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


const resetButtonElement = document.getElementById('reset-btn');
const newButtonElement = document.getElementById('new-btn');
const answerButtonElement = document.getElementById('answer-btn');


let canvasPosition = canvas.getBoundingClientRect();

console.log(canvasPosition)

canvas.width = 600; //600 px
canvas.height = 300; // 300 px


const startPositionX = 15;
const startPositionY = canvas.height - 30;
const containerHeight = 75;
const containerWidth = 40;
const containerSpacing = 45;
let containerSizes = [[.3, .4, .5, .6, .8],[.2, .4, .6, .7, .8],[0.2,0.6,0.8],[0.3,0.6,0.8]];
let gameLevel = 0;
let containerSize = containerSizes[gameLevel] // first game
let containerCount = containerSize.length;
const containerMouthAngle = 10 * Math.PI/180;
let pouringHeight = -10;
let animateRunning = false;
let animationStep = 0;
let containerIdClicked = -1;
let showAnswer = false;

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
		if(! mouse.disable){
		    mouse.disable=true;
			mouse.click = true;
			}
		}
});
canvas.addEventListener('mouseup', function(event){
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        if(! mouse.disable){
            mouse.disable=true;
			mouse.click = true;
		}
});



class Container{
    constructor(id, height, width, startPositionX, startPositionY, waterLevel){
        this.id = id;
        this.startPositionX = startPositionX;
        this.startPositionY = startPositionY;
        this.height = height;
        this.width = width;
        this.waterLevel = waterLevel; // in percent from 0 to 100
        this.theta = 10;
        this.rotate = false;
        this.text = "";
        this.textColor = "#6c3483";
        this.volumes = "";
        this.clickCounts = 0;
        this.updateContainer();

    }
    isClicked(){
        if( (mouse.x>this.tl[0]) && (mouse.x<this.tr[0])
         && (mouse.y>this.tl[1]) && (mouse.y< this.bl[1]) ){
         this.clickCounts += 1;
            return this.id;
         }
         return -1;
    }
    updateContainer(){
        this.bl = [this.startPositionX, this.startPositionY];
        this.br = [this.startPositionX+this.width, this.startPositionY];
        this.tl = [this.startPositionX-(Math.tan(containerMouthAngle)*this.height), this.startPositionY-this.height];
        this.tr = [this.startPositionX+this.width+(Math.tan(containerMouthAngle)*this.height), this.startPositionY-this.height];

        // water
        this.wtl = [this.startPositionX-(Math.tan(containerMouthAngle)*this.height*this.waterLevel), this.startPositionY-(this.height*this.waterLevel)];
        this.wtr = [this.startPositionX+this.width+(Math.tan(containerMouthAngle)*this.height*this.waterLevel), this.startPositionY-(this.height*this.waterLevel)];
    }
    drawContainer(){
        // Start a new Path for container

        ctx.beginPath();
        ctx.strokeStyle = "#a6acaf";
        ctx.lineWidth = 1;
        let translatePosX = 0;
        let translatePosY = 0;
        if(this.rotate){
            translatePosX = this.tl[0];
            translatePosY = this.tl[1];
            ctx.translate(translatePosX, translatePosY);
            ctx.rotate(-this.theta*Math.PI/180);
        }
        ctx.moveTo(this.tl[0]-translatePosX, this.tl[1]-translatePosY);
        ctx.lineTo(this.bl[0]-translatePosX, this.bl[1]-translatePosY);
        ctx.lineTo(this.br[0]-translatePosX, this.br[1]-translatePosY);
        ctx.lineTo(this.tr[0]-translatePosX, this.tr[1]-translatePosY);
            // Draw the Path
        ctx.stroke();

        // Start a new Path for water
        ctx.fillStyle = '#1ca3ec';
        ctx.lineWidth = 0;
        ctx.beginPath();
        ctx.moveTo(this.wtl[0]-translatePosX, this.wtl[1]-translatePosY);
        ctx.lineTo(this.bl[0]-translatePosX, this.bl[1]-translatePosY);
        ctx.lineTo(this.br[0]-translatePosX, this.br[1]-translatePosY);
        ctx.lineTo(this.wtr[0]-translatePosX, this.wtr[1]-translatePosY);
        ctx.closePath();
        ctx.fill();

        //draw container mouth
        ctx.fillStyle = "#ececec";
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.ellipse(this.startPositionX+this.width/2-translatePosX, this.startPositionY-this.height-translatePosY,
        this.width/2+(Math.tan(containerMouthAngle)*this.height), 6, Math.PI , 0, 2 * Math.PI);
        ctx.fill();

        // Translate back the ctx
        if(this.rotate){
            ctx.rotate(this.theta*Math.PI/180);
            ctx.translate(-translatePosX, -translatePosY);
        }
        ctx.fillStyle = "#ca6f1e";
        ctx.font = "32px Bold Courier New";
        ctx.fillText(this.text,canvasPosition.left+canvas.width/3,canvasPosition.top+canvas.height/3);


        if(this.id>0){
        ctx.fillStyle = "#a569bd";
        ctx.font = "20px Bold Courier New";
        ctx.fillText(this.clickCounts,this.bl[0]+this.width/3,this.bl[1]+25);}
        else{
            ctx.font = "20px Bold Courier New";
            ctx.fillText("1 Litre",this.bl[0],this.bl[1]+25);
        }
        if(showAnswer && this.id>0){
            ctx.font = "17px Bold Courier New";
            ctx.fillStyle = "#8e44ad";
            ctx.fillText(this.volumes+" ml",this.tl[0],this.bl[1]-this.height);
        }

    }

}

class Game{
    constructor(){
        this.containers = [];
        this.newGame();
    }
    newGame(){
        showAnswer = false;
        animateRunning = false;
        mouse.disable=false;
        this.containers = [];
        // Initialize Tub container
        this.containers.push(new Container(0, containerHeight,
                containerWidth+20, startPositionX, startPositionY, 0));
        for(let i=1; i<=containerCount; i++){
            this.containers.push(new Container(i, containerHeight*containerSize[i-1],
                containerWidth, startPositionX+(containerWidth+containerSpacing)*(i), startPositionY, 1));
        };
    }
    updateGame(){

        if(mouse.click && ! animateRunning){
            mouse.click=false;  // reset mouse click
            mouse.disable=true; // Disable user action till animation is done
            for(let i=1; i<=containerCount; i++){
                containerIdClicked = this.containers[i].isClicked();
                if(containerIdClicked > 0){
                    console.log("selected container ", containerIdClicked);
                    animationStep = 0;
                    animateRunning = true;
                    break; // once selected stop checking for rest containers
                }
            }
            mouse.disable=false; // Re enable user action

        }
        if (animateRunning){
            let dx = this.containers[0].tr[0];
            let dy = this.containers[0].tr[1]-pouringHeight;

            let container = this.containers[containerIdClicked];
            // Move containers
            if(animationStep == 0){
                container.startPositionX = Math.max(container.startPositionX - 10, dx);
                container.startPositionY = Math.max(container.startPositionY - 10, dy);
                container.updateContainer();
                if(container.startPositionX==dx && container.startPositionY==dy){
                    animationStep += 1;
                    container.rotate = true;
                }
            }
            // rotate container
            let dTheta = 90;
            if(animationStep == 1){
                container.theta = Math.min(container.theta + 10, dTheta);
                if(container.theta == dTheta){
                    animationStep += 1;
                }

            }

            // pour water to destination

            if(animationStep == 2){
                container.waterLevel -= .01;
                this.containers[0].waterLevel = Math.min(this.containers[0].waterLevel + (0.01*containerSize[containerIdClicked-1]), 1.1);
                container.updateContainer();
                this.containers[0].updateContainer();

                // Water Fall animation
                ctx.fillStyle = '#1ca3ec';
                ctx.lineWidth = 0;
                ctx.beginPath();
                ctx.moveTo(container.tl[0], container.tl[1]);
                ctx.lineTo(container.tl[0]-5, container.tl[1]);
                ctx.lineTo(startPositionX, startPositionY);
                ctx.lineTo(startPositionX+containerWidth, startPositionY);
                ctx.closePath();
                ctx.fill();
                // overflow
                if(container.waterLevel > 0 && this.containers[0].waterLevel>=1.01){
                    this.containers[0].text = "OVERFLOW";

                }
                // perfect full
                if(container.waterLevel <= 0){
                    if(this.containers[0].waterLevel>=0.99 && this.containers[0].waterLevel<1.01){
                        confetti({
                          particleCount: 500,
                          startVelocity: 20,
                          spread: 360,
                          decay : 0.95
                        });
                        this.containers[0].text = "Completely Filled";
                    }

                    animationStep += 1;
                    container.rotate = false;
                }

            }
            // move back the container
            if(animationStep == 3){
                container.startPositionX = startPositionX+(containerWidth+containerSpacing)*containerIdClicked;
                container.startPositionY = startPositionY;
                container.waterLevel = 1;
                container.updateContainer();
                animateRunning = false;
                mouse.disable=false;
                mouse.click=false;
            }
            // re enable user action
        }
    }
    drawGame(){
        for(let i=0;i<=containerCount;i++){
            this.containers[i].drawContainer();
        }
    }
}

let game = new Game();


resetButtonElement.addEventListener("click", ()=>{
    game.newGame();
});
newButtonElement.addEventListener("click", ()=>{
    gameLevel = (gameLevel + 1)% (containerSizes.length);
    containerSize = containerSizes[gameLevel];
    containerCount = containerSize.length;
    game.newGame();
});
answerButtonElement.addEventListener("click", ()=>{
    for(let i=1; i<=containerCount; i++){
        game.containers[i].volumes = containerSize[i-1]*1000;
    }
    showAnswer = true;
});

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    game.updateGame();
    game.drawGame();
    requestAnimationFrame(animate);
}
animate();

// https://github.com/catdad/canvas-confetti