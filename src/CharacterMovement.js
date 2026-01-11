import { drawFloor } from "./SceneCreation.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let player = {
    col:1,
    row:6,
    spriteName:'player',
    speed:64
};

const sprites = {
    player:{x:38,y:16,w:20,h:34},
};

const spriteSheet = new Image();
spriteSheet.src='assets/Chef A2.png'

export function drawPlayer(){
    const sprite =sprites[player.spriteName];
    const tileSize = 64;
    
    // 2D position: x = col * tileSize, y = row * tileSize
    const x = player.col * tileSize + (tileSize - sprite.w * 2) / 2;
    const y = player.row * tileSize + (tileSize - sprite.h * 2) / 2;

    ctx.drawImage(spriteSheet,
        sprite.x,sprite.y,sprite.w,sprite.h,
        x,y,sprite.w*2,sprite.h*2
    )
}

export function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawFloor()
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

spriteSheet.onload=()=>{
    console.log('player loaded');
    gameLoop();
}

document.addEventListener('keydown',(e)=>{
    console.log(e);
    switch(e.key){
        case 'ArrowLeft':  player.col = Math.max(0, player.col - 1); break;
        case 'ArrowRight': player.col = Math.min(7, player.col + 1); break;
        case 'ArrowUp':    player.row = Math.max(0, player.row - 1); break;
        case 'ArrowDown':  player.row = Math.min(7, player.row + 1); break;
        case 'a':  player.col = Math.max(0, player.col - 1); break;
        case 'd': player.col = Math.min(7, player.col + 1); break;
        case 'w':    player.row = Math.max(0, player.row - 1); break;
        case 's':  player.row = Math.min(7, player.row + 1); break;
    }
})