const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//how fast in pixels fish moves
const movementSpeed = 5;

let mouseY = 0;
let fish ={
 postionX:0,
 postionY:0,
 hit:false,
}
let line={
    caught:false,
}
const fishImg = new Image;
fishImg.src="./assets/fluffy.png"
const fishBiteImg = new Image;
fishBiteImg.src="./assets/fluffy_bite.png"

function setup(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
function draw(){
     ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    catchDetect(fish)
    gameEnviorment();
    fishDraw()
    fishingLine();
    setTimeout(draw, 20)
}

 function fishDraw(){
    if(!fish.hit){
    //so if hit side 
    if(fish.postionX >=window.innerWidth){
fish.postionX = 0;
fish.postionY = Math.random()*window.innerHeight;
    }
   fish.postionX = fish.postionX + movementSpeed;
ctx.drawImage(fishImg,fish.postionX,fish.postionY,100,50);
 
 }


}
 addEventListener("mousemove", (e) => {
    mouseY = e.clientY;
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
  
}
}
function catchDetect(fishInput){
    //so know if in the middle where line
    //+100 on x so is head that hits
    //50 is fish hight so if line is between it
    // as 5 intervals need to allow for that
if((fishInput.postionX+90 <= window.innerWidth /2 && fishInput.postionX+110 >= window.innerWidth /2) && (fishInput.postionY<mouseY && fishInput.postionY + 50 > mouseY) ){
line.caught = true;
fish.hit = true;

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
}

//so no issue with img not loading

fishImg.onload = setup;

