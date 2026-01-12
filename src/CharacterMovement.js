import { renderObject } from "./ObjectCoordinates.js";
import { drawFloor, kitchenSpriteLoaded } from "./SceneCreation.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 480;
canvas.height = 577;

let playerSpriteLoaded = false;


let player = {
    x: 64,
    y: 192,
    width: 20,
    height: 38,
    spriteName: 'player',
    speed: 0.3,
    direction: 'right',
    isMoving: false,
    frameIndex: 0,
    frameCounter: 0,
    animationSpeed: 18,
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};


const sprites = {
    player: {
        idle: { x: 38, y: 16, w: 20, h: 34 },
        walk: [
            { x: 38, y: 16, w: 20, h: 34 },
            { x: 38, y: 58, w: 20, h: 34 },
            { x: 70, y: 56, w: 20, h: 34 },
            { x: 104, y: 58, w: 20, h: 34 },
            { x: 134, y: 58, w: 20, h: 34 },

        ]
    }
};

const spriteSheet = new Image();

spriteSheet.src = 'assets/Chef A2.png';

export function drawPlayer() {
    const walkFrames = sprites.player.walk;
    const currentFrame = player.isMoving
        ? walkFrames[player.frameIndex]
        : sprites.player.idle;

    ctx.save();

    ctx.translate(player.x, player.y);

    if (player.direction === 'left') {
        ctx.scale(-1, 1);  // Flip horizontally
    }

    ctx.drawImage(
        spriteSheet,
        currentFrame.x,
        currentFrame.y,
        currentFrame.w,
        currentFrame.h,
        -player.width / 2,   // Center on position
        -player.height / 2,
        player.width,
        player.height
    );

    // Restore context
    ctx.restore();
}

export function updatePlayer() {
    let moveX = 0;
    let moveY = 0;

    if (keys.up) moveY -= 1;
    if (keys.down) moveY += 1;
    if (keys.left) moveX -= 1;
    if (keys.right) moveX += 1;

    player.isMoving = (moveX !== 0 || moveY !== 0);

    if (player.isMoving) {
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        const newX = player.x + (moveX * player.speed);
        const newY = player.y + (moveY * player.speed);

        if (isValidPosition(newX, newY)) {
            player.x = newX;
            player.y = newY;
        }

        if (moveX < 0) player.direction = 'left';
        else if (moveX > 0) player.direction = 'right';
        else if (moveY < 0) player.direction = 'up';
        else if (moveY > 0) player.direction = 'down';


        player.frameCounter++;

        if (player.frameCounter >= player.animationSpeed) {
            player.frameCounter = 0;
            player.frameIndex = (player.frameIndex + 1) % 5;
        }
    }
    else {
        player.frameIndex = 0;
        player.frameCounter = 0;
    }
}

export function isValidPosition(x, y) {
    const margin = 24;
    const padding = 0;

    if (x - padding < margin) return false;  // Left wall
    if (x + padding > canvas.width - margin) return false;  // Right wall
    if (y - padding < margin) return false;  // Top wall
    if (y + padding > canvas.height - margin) return false;  // Bottom wall

    return true;
}

export function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawFloor();
    renderObject();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

spriteSheet.onload = () => {
    console.log('Player sprite loaded!');
    playerSpriteLoaded = true;
    checkAndStart();
}

function checkAndStart() {
    if (playerSpriteLoaded && kitchenSpriteLoaded) {
        console.log('Starting game loop! ');
        gameLoop();
    } else {
        setTimeout(checkAndStart, 100);
    }
}

checkAndStart();

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            keys.up = true;
            e.preventDefault();
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            keys.down = true;
            e.preventDefault();
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keys.right = true;
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            keys.up = false;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            keys.down = false;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            keys.right = false;
            break;
    }
});
