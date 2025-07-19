const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const gameOver = document.getElementById("gameOver");
const scoreDisplay = document.getElementById("score");
const playAgain = document.getElementById("playAgain");
//how fast in pixels fish moves
const movementSpeed = 5;
let score = 0;
let mouseY = 0;
let currentTime = Date.now();
let line = {
    caught: false,
    fish: null,
    lastPositon: 0,
}
const fishImg = new Image;
fishImg.src = "./assets/fluffy.png"
const fishFlippedImg = new Image;
fishFlippedImg.src = "./assets/fluffy_flipped.png"
const fishBiteImg = new Image;
fishBiteImg.src = "./assets/fluffy_bite.png"
const bait1Img = new Image;
bait1Img.src = "./assets/bait-1.png"
const bait2Img = new Image;
bait2Img.src = "./assets/bait-2.png"
const bait3Img = new Image;
bait3Img.src = "./assets/bait-3.png"
const penguinImg = new Image;
penguinImg.src = "./assets/penguin.png"
const holeImg = new Image;
holeImg.src = "./assets/deck_back.png"
const holeFrontImg = new Image;
holeFrontImg.src = "./assets/deck_front.png"
const IceImg = new Image;
IceImg.src = "./assets/deck_side.png"
const caughtFish1 = new Image;
caughtFish1.src = "./assets/caughtFish.png"
const caughtFish2 = new Image;
caughtFish2.src = "./assets/caughtFish2.png"
const caughtFish3 = new Image;
caughtFish3.src = "./assets/caughtfish3.png"

playAgain.addEventListener("click", () => {
    score = 0;
    currentTime = Date.now();
    gameOver.style.display = "none"
    setup()

})

class fish {
    constructor() {
        this.postionX = -100,
            //so doesn't start on land
            this.postionY = 150,
            this.hit = false,
            this.justReleased = false,
            this.intialDraw = true
        //how long delayed by
        this.startDelay = Math.random() * 1000
        this.forwards = Math.random() * 1
    }
}

const fishes = [new fish, new fish, new fish, new fish]





async function loadImage() {
    const images = [
        fishImg,

        fishFlippedImg,
        fishBiteImg,
        bait1Img,
        bait2Img,
        bait3Img,
        penguinImg,
        holeImg,
        holeFrontImg,
        IceImg,
        caughtFish1,
        caughtFish2,
        caughtFish3
    ]

    await Promise.all(images.map((img) => new Promise((resolve) => {
        img.addEventListener("load", resolve);
    })))
    setup();
}



async function setup() {



    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fishes.forEach(x => {
        //so randomise the position
        fishRestartPostion(x)
    });
    draw();

}
function draw() {



    //as date time does it to mill a second

    //current game set for 60 seconds
    if (Date.now() < currentTime + 60000) {

        ctx.fillStyle = "rgb(255,255,255)"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        //done before fish so not hidden behind it 
        gameEnviorment();

        fishes.forEach(x => {
            //to stagger them at start 
            if (x.intialDraw && x.startDelay <= 0) {
                x.intialDraw = false


            } else {
                x.startDelay = x.startDelay - 5;
            }
            if (x.startDelay <= 0) {
                fishReturned(x)
                catchDetect(x)
                fishDraw(x)
            }
        });











        setTimeout(draw, 20)
    } else {
        gameOver.style.display = "flex";
        scoreDisplay.innerText = "Congratulations! you caught " + score + " fish!"
    }
}

function fishRestartPostion(x) {
    x.forwards = Math.random() * 1

    //if above 0.5 forwards, else back
    if (x.forwards > 0.5) {
        x.postionX = -100;

        x.postionY = Math.random() * ((window.innerHeight - 50) - 160) + 160;
    } else {
        x.postionX = window.innerWidth + 100


        x.postionY = Math.random() * ((window.innerHeight - 50) - 160) + 160;
    }

}
function fishDraw(x) {
    if (x.justReleased) {
        fishRestartPostion(x)
        x.justReleased = false
    }
    if (!x.hit) {
        //so if hit side 
        if ((x.postionX >= window.innerWidth && x.forwards > 0.5) || (x.postionX <= -100 && x.forwards <= 0.5)) {
            fishRestartPostion(x)
        }
        if (x.forwards > 0.5) {

            x.postionX = x.postionX + movementSpeed;
            ctx.drawImage(fishImg, x.postionX, x.postionY, 100, 50);
        } else {
            x.postionX = x.postionX - movementSpeed;
            ctx.drawImage(fishFlippedImg, x.postionX, x.postionY, 100, 50);
        }

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
}, { passive: true })
function fishingLine() {
    ctx.beginPath();
    ctx.moveTo(window.innerWidth / 2, 0);
    //as never moves, form middle of screen
    ctx.lineTo(window.innerWidth / 2, mouseY);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    
    if (line.caught) {
        //-35 so it looks like it eating the line.
        ctx.drawImage(fishBiteImg, (window.innerWidth / 2) - 35, mouseY - 10, 50, 100);

    } else {
        if (mouseY < 150) {
            ctx.drawImage(bait1Img, (window.innerWidth / 2) - 15, mouseY, 30, 30);
            line.lastPositon = mouseY;
        } else if (line.lastPositon > mouseY) {

            ctx.drawImage(bait2Img, (window.innerWidth / 2) - 15, mouseY, 30, 30);
            line.lastPositon = mouseY;
        } else {
            ctx.drawImage(bait3Img, (window.innerWidth / 2) - 15, mouseY, 30, 30);
            line.lastPositon = mouseY;
        }
    }
}
function catchDetect(fishInput) {
    //!line.caught = so only one fish at a time
    if (!line.caught
        &&
        (
            (
                //15 pixel gap barried
                (fishInput.postionX + 85 <= window.innerWidth / 2 && fishInput.postionX + 115 >= window.innerWidth / 2 && fishInput.forwards > 0.5)
                ||
                //doing this so don't catch reverse on taile
                (fishInput.postionX - 15 <= window.innerWidth / 2 && fishInput.postionX + 15 >= window.innerWidth / 2 && fishInput.forwards <= 0.5)
            )
            &&
            (fishInput.postionY - 15 < mouseY && fishInput.postionY + 65 > mouseY)
        )
    ) {
        line.caught = true;
        fishInput.hit = true;
        line.fish = fishInput;

    }
}
//neeed fish so know which one to respawn in
function fishReturned(x) {
    //70 not 150 so fish goes through the ice whole.
    if (line.fish === x && line.caught && mouseY < 70) {
        line.caught = false
        line.fish = null,
            x.hit = false
        x.justReleased = true
        score = score + 1;


    }
}
function gameEnviorment() {

    const linGrad = ctx.createLinearGradient(0, 0, 0, window.innerHeight);

    linGrad.addColorStop(1, "#2a42b8");
    linGrad.addColorStop(0, "#ffffff");

    ctx.fillStyle = linGrad;
   
    ctx.fillRect(0, 150, window.innerWidth, window.innerHeight);




    ctx.drawImage(penguinImg, (window.innerWidth / 2), 0, 125, 100);
    //50 so get middle of it
    ctx.drawImage(holeImg, (window.innerWidth / 2) - 50, 100, 100, 50);


    ctx.fillStyle = "rgb(0,0,0)"
    ctx.font = "20px serif"
    ctx.fillText("score = " + score, 10, 20);
    //done hear so it looks like its going though the hole
    fishingLine();
    ctx.drawImage(holeFrontImg, (window.innerWidth / 2) - 50, 100, 100, 50);
    ctx.drawImage(IceImg, 0, 150, window.innerWidth, 20);


    
    //so on small screen fish don't block at penguin
    if (score <= 8 || window.innerWidth > 600) {
        let fishPileX = 10;
        let fishPileY = 0
        for (let i = 0; i < score; i++) {
            if (i % 3 == 1) {
                ctx.drawImage(caughtFish1, fishPileX, 100 - fishPileY, 100, 50);
            } else if (i % 3 == 2) {
                ctx.drawImage(caughtFish3, fishPileX, 100 - fishPileY, 100, 50);
            } else {
                ctx.drawImage(caughtFish2, fishPileX, 100 - fishPileY, 100, 50);
            }

            if (i % 7 == 0 && i != 0) {
                fishPileX = fishPileX + 60
                fishPileY = 0
            }
            fishPileY = fishPileY + 10;
        }
    } else {
        //so fish don't dispear on mobile
        let fishPileX = 10;
        let fishPileY = 0
        for (let i = 0; i < 8; i++) {
            if (i % 3 == 1) {
                ctx.drawImage(caughtFish1, fishPileX, 100 - fishPileY, 100, 50);
            } else if (i % 3 == 2) {
                ctx.drawImage(caughtFish3, fishPileX, 100 - fishPileY, 100, 50);
            } else {
                ctx.drawImage(caughtFish2, fishPileX, 100 - fishPileY, 100, 50);
            }

            if (i % 7 == 0 && i != 0) {
                fishPileX = fishPileX + 60
                fishPileY = 0
            }
            fishPileY = fishPileY + 10;
        }

    }




}

//so no issue with img not loading

addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


})




loadImage();

