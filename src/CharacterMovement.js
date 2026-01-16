import { objectCoordinates, renderObject } from "./ObjectCoordinates.js";
import { drawFloor, kitchenSpriteLoaded, tileSize } from "./SceneCreation.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Ensure canvas width/height attributes match CSS size for sharp rendering
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.imageSmoothingEnabled = false;


canvas.width = 480;
canvas.height = 292;

let playerSpriteLoaded = false;

// Toggle this to see collision boxes (press 'C' key)
let debugCollision = false;

let player = {
    x: 64,
    y: 192,
    width: 20,
    height: 38,
    spriteName: 'player',
    speed: 0.5,
    direction: 'right',
    isMoving: false,
    frameIndex: 0,
    frameCounter: 0,
    animationSpeed: 18,
    collisionWidth: 12,
    collisionHeight: 16,
    collisionOffsetY: 8
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

// Draw collision boxes for debugging
function drawCollisionBoxes() {
    if (!debugCollision) return;

    // Draw player collision box
    const playerBox = getPlayerCollisionBox(player.x, player.y);
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        playerBox.left,
        playerBox.top,
        playerBox.right - playerBox.left,
        playerBox.bottom - playerBox.top
    );

    // Draw object collision boxes
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    for (const [objectName, coords] of Object.entries(objectCoordinates)) {
        // Calculate base position (top-left of tile)
        const baseTileX = coords.col * tileSize;
        const baseTileY = coords.row * tileSize;

        // Get collision dimensions
        const objWidth = coords.collisionWidth || tileSize;
        const objHeight = coords.collisionHeight || tileSize;

        // Center the collision box within the tile (matching sprite centering)
        // Then apply any custom offsets
        const objX = baseTileX + (tileSize - objWidth) / 2 + (coords.offsetX || 0);
        const objY = baseTileY + (tileSize - objHeight) / 2 + (coords.offsetY || 0);

        ctx.strokeRect(objX, objY, objWidth, objHeight);

        // Label the object
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(objectName, objX, objY - 2);
    }

    // Draw wall boundaries
    const margin = 24;
    const wallPadding = -15;
    const topWallPadding = -10;
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        margin + wallPadding,
        margin + wallPadding,
        canvas.width - 2 * (margin + wallPadding),
        canvas.height - 2 * (margin + wallPadding)
    );
}

function getPlayerCollisionBox(x, y) {
    return {
        left: x - player.collisionWidth / 2,
        right: x + player.collisionWidth / 2,
        top: y - player.collisionHeight / 2 + player.collisionOffsetY,
        bottom: y + player.collisionHeight / 2 + player.collisionOffsetY
    };
}

export function drawPlayer() {
    const walkFrames = sprites.player.walk;
    const frameCount = walkFrames.length;
    const currentFrame = player.isMoving
        ? walkFrames[player.frameIndex % frameCount]
        : sprites.player.idle;

    ctx.save();
    ctx.translate(Math.round(player.x), Math.round(player.y));

    if (player.direction === 'left') {
        ctx.scale(-1, 1);
    }

    // Set imageSmoothingEnabled to false before drawing (in case it was changed elsewhere)
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        spriteSheet,
        currentFrame.x,
        currentFrame.y,
        currentFrame.w,
        currentFrame.h,
        Math.round(-player.width / 2),
        Math.round(-player.height / 2),
        player.width,
        player.height
    );

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
        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        const stepX = moveX * player.speed;
        const stepY = moveY * player.speed;

        const newX = player.x + stepX;
        const newY = player.y + stepY;

        // Try moving in both directions first
        if (isValidPosition(newX, newY)) {
            player.x = newX;
            player.y = newY;
        }
        // If diagonal movement blocked, try sliding along obstacles
        else {
            // Try moving only horizontally (slide along vertical walls/objects)
            if (stepX !== 0 && isValidPosition(newX, player.y)) {
                player.x = newX;
            }
            // Try moving only vertically (slide along horizontal walls/objects)
            if (stepY !== 0 && isValidPosition(player.x, newY)) {
                player.y = newY;
            }
        }

        // Update direction based on input
        if (moveX < 0) player.direction = 'left';
        else if (moveX > 0) player.direction = 'right';
        else if (moveY < 0) player.direction = 'up';
        else if (moveY > 0) player.direction = 'down';

        player.frameCounter++;

        const walkFrames = sprites.player.walk;
        const frameCount = walkFrames.length || 1;
        if (player.frameCounter >= player.animationSpeed) {
            player.frameCounter = 0;
            player.frameIndex = (player.frameIndex + 1) % frameCount;
        }
    }
    else {
        player.frameIndex = 0;
        player.frameCounter = 0;
    }
}

export function isValidPosition(x, y) {
    const margin = 24;
    const wallPadding = -15;
    const topWallPadding = -3;
    // Get player collision box using the custom collision dimensions
    const playerBox = getPlayerCollisionBox(x, y);

    // Check wall boundaries
    if (playerBox.left < margin + wallPadding) return false;
    if (playerBox.right > canvas.width - margin - wallPadding) return false;
    if (playerBox.top < margin + topWallPadding) return false;
    if (playerBox.bottom > canvas.height - margin - wallPadding) return false;

    // Check collision with objects
    for (const [objectName, coords] of Object.entries(objectCoordinates)) {
        // Calculate base position top-left of tile
        const baseTileX = coords.col * tileSize;
        const baseTileY = coords.row * tileSize;

        // Get collision dimensions
        const objWidth = coords.collisionWidth || tileSize;
        const objHeight = coords.collisionHeight || tileSize;

        // Center the collision box within the tile
        // Then apply any custom offsets
        const objX = baseTileX + (tileSize - objWidth) / 2 + (coords.offsetX || 0);
        const objY = baseTileY + (tileSize - objHeight) / 2 + (coords.offsetY || 0);

        const objBox = {
            left: objX,
            right: objX + objWidth,
            top: objY,
            bottom: objY + objHeight
        };

        // AABB collision detection
        if (
            playerBox.right > objBox.left &&
            playerBox.left < objBox.right &&
            playerBox.bottom > objBox.top &&
            playerBox.top < objBox.bottom
        ) {
            return false;
        }
    }

    return true;
}
export function getNearByInteractables(x, y, maxDistance = 12) {

    const playerBox = getPlayerCollisionBox(x, y);

    for (const [objectName, coords] of Object.entries(objectCoordinates)) {
        if (!coords.interactable) continue;

        const baseTileX = coords.col * tileSize;
        const baseTileY = coords.row * tileSize;
        const objWidth = coords.collisionWidth || tileSize;
        const objHeight = coords.collisionHeight || tileSize;
        const objX = baseTileX + (tileSize - objWidth) / 2 + (coords.offsetX || 0);
        const objY = baseTileY + (tileSize - objHeight) / 2 + (coords.offsetY || 0);

        const objBox = {
            left: objX,
            right: objX + objWidth,
            top: objY,
            bottom: objY + objHeight
        };

        const overlap = (
            playerBox.right > objBox.left &&
            playerBox.left < objBox.right &&
            playerBox.bottom > objBox.top &&
            playerBox.top < objBox.bottom
        );
        if (overlap) return { name: objectName, coords };

        //proximity disatnce calculation
        const px = Math.max(objBox.left, Math.min(x, objBox.right));
        const py = Math.max(objBox.top, Math.min(y, objBox.bottom));
        const distSq = (px - x) * (px - x) + (py - y) * (py - y);
        if (distSq <= maxDistance * maxDistance) return { name: objectName, coords };
    }
    return null;
};


function showInteractButton(text = 'Press E') {
    let el = document.getElementById('interact-text');
    if (!el) {
        el = document.createElement('div');
        el.id = 'interact-text';
        Object.assign(el.style, {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: '60px',
            padding: '6px 10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            borderRadius: '6px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            pointerEvents: 'none',
            zIndex: 10000,
            transition: 'opacity 120ms',
            opacity: '0',
            display: 'none'
        });
        document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.display = 'block';
    requestAnimationFrame(() => el.style.opacity = '1');
}

function hideInteractButton() {
    const el = document.getElementById('interact-text');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
        if (el) el.style.display = 'none';
    }, 140);
}
export function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    drawFloor();
    renderObject();
    drawPlayer();
    drawCollisionBoxes();

    const nearby = getNearByInteractables(player.x, player.y);
    if (nearby) {
        showInteractButton('Press E');
    } else {
        hideInteractButton();
    }

    requestAnimationFrame(gameLoop);
}

spriteSheet.onload = () => {
    console.log('Player sprite loaded!');
    playerSpriteLoaded = true;
    checkAndStart();
}

function checkAndStart() {
    if (playerSpriteLoaded && kitchenSpriteLoaded) {
        console.log('Starting game loop!');
        console.log('Press C to toggle collision debug view');
        gameLoop();
    } else {
        setTimeout(checkAndStart, 100);
    }
}

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
        case 'c':
        case 'C':
            debugCollision = !debugCollision;
            console.log('Collision debug:', debugCollision ? 'ON' : 'OFF');
            break;
        case 'e':
        case 'E':
            const obj = getNearByInteractables(player.x, player.y);
            if (obj) interactWithObject(obj);
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


export function interactWithObject(obj){
    if(!obj)return;
    console.log(obj);
    const {template,onOpen}=obj.coords.onInteract;
    console.log(template,onOpen);

    if(typeof onOpen==="function"){
        onOpen(canvas,ctx,player)
    }
};