const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//how fast in pixels fish moves
const movementSpeed = 5;
let postionX = 0;
let postionY=0;
const fishImg = new Image;
fishImg.src="./assets/fluffy.png"

function setup(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}
function draw(){
     ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    fish()
    setTimeout(draw, 20)
}

 function fish(){
    //so if hit side 
    if(postionX >=window.innerWidth){
postionX = 0;
postionY = Math.random()*window.innerHeight;
    }
   postionX = postionX + movementSpeed;
ctx.drawImage(fishImg,postionX,postionY);
 
 }



//so no issue with img not loading
fishImg.onload = setup();

