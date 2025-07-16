const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//how fast in pixels fish moves
const movementSpeed = 5;
let score = 0;
let mouseY = 0;

let line={
    caught:false,
    fish:null,
}
const fishImg = new Image;
fishImg.src="./assets/fluffy.png"
const fishBiteImg = new Image;
fishBiteImg.src="./assets/fluffy_bite.png"
const baitImg = new Image;
baitImg.src="./assets/bait-2.png"




class fish{
     constructor() {
this.postionX=0,
 //so doesn't start on land
 this.postionY=150,
 this.hit=false,
 this.justReleased=false,
 this.intialDraw = true
 //how long delayed by
 this.startDelay = Math.random()*1000
    }
}

const fishes = [new fish, new fish, new fish, new fish]









function setup(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
   fishes.forEach(x => {
    //so randomise the position
    fishRestartPostion(x)
   });
    draw();

}
function draw(){
     ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    fishes.forEach(x => {
        //to stagger them at start 
    if(x.intialDraw && x.startDelay <=0){
x.intialDraw = false


    }else{
        x.startDelay = x.startDelay -5;
    }
    if(x.startDelay <= 0){
    fishReturned(x)
    catchDetect(x)
    fishDraw(x)
    }
   });
    
    
    gameEnviorment();
    
    fishingLine();
    setTimeout(draw, 20)
}

function fishRestartPostion(x){
x.postionX = 0;
        
x.postionY = Math.random()*((window.innerHeight-50)-150)+ 150;
}
 function fishDraw(x){
    if (x.justReleased){
        fishRestartPostion(x)
x.justReleased = false
    }
    if(!x.hit){
    //so if hit side 
    if(x.postionX >=window.innerWidth){
fishRestartPostion(x)
    }
   x.postionX = x.postionX + movementSpeed;
ctx.drawImage(fishImg,x.postionX,x.postionY,100,50);

 
 }


}
 addEventListener("mousemove", (e) => {
    mouseY = e.clientY;
 })
 //to help with mobile. 
 addEventListener("touchmove", (e) => {
    //to stop scrolling down screen.
    e.preventDefault()
    mouseY = e.touches[0].clientY;
 })
function fishingLine() {
    ctx.beginPath();
    ctx.moveTo(window.innerWidth /2, 0);
    //as never moves, form middle of screen
    ctx.lineTo(window.innerWidth /2, mouseY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    
// so can undo the changes
if(line.caught){
    //-35 so it looks like it eating the line.

    ctx.drawImage(fishBiteImg,(window.innerWidth /2)-35,mouseY-10,50,100);
  
}else{
    ctx.drawImage(baitImg,(window.innerWidth /2)-15,mouseY,30,30);
}
}
function catchDetect(fishInput){
    //so know if in the middle where line
    //+100 on x so is head that hits
    //50 is fish hight so if line is between it
    // as 5 intervals need to allow for that
    //!line.caught = so only one fish at a time
if(!line.caught&&((fishInput.postionX+90 <= window.innerWidth /2 && fishInput.postionX+110 >= window.innerWidth /2) && (fishInput.postionY<mouseY && fishInput.postionY + 50 > mouseY)) ){
line.caught = true;
fishInput.hit = true;
line.fish = fishInput;

}
}
//neeed fish so know which one to respawn in
function fishReturned(x){
//125 not 150 so fish a bit over the lne
    if(line.fish === x && line.caught && mouseY<125){
        line.caught = false
        line.fish = null,
        x.hit = false
        x.justReleased = true
        score = score + 1;
        
    
}
}
function gameEnviorment(){
     ctx.beginPath();
    ctx.moveTo(0, 150);
    //as never moves, form middle of screen
    ctx.lineTo(window.innerWidth, 150);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle ="rgb(0,0,0)"
    ctx.font ="48px serif"
ctx.fillText("score = " + score,10,50);
}

//so no issue with img not loading

fishImg.onload = setup;

