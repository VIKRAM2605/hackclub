import { objectCoordinates, renderObject } from "./ObjectCoordinates.js";
import { drawFloor, kitchenSpriteLoaded, tileSize } from "./SceneCreation.js";
import { decreasePatienceTime, decreaseSpawnDelayTime, drawQueue, isFirstNpcIntaractable, openNpcModal, shouldSpawnNpc, spawnNpc, updateLeavingNpcs, updateNpcQueue } from "./NpcStateManagement.js";
import { npcConvoTemplate } from "./InteractiveModals.js";
import { startTimer } from "./TimeCalculation.js";
import { checkSpillCollision, drawSpills, updateSpills } from "./RandomOilSpillage.js";
import { gameRunning } from "./GameMechanics.js";
import { showHealth } from "./HealthStateManagement.js";
import { showCookedFood } from "./DisplayCookedFood.js";
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

ctx.imageSmoothingEnabled = false;

canvas.width = 480;
canvas.height = 292;

let playerSpriteLoaded = false;
let lastTime = performance.now();

// Toggle this to see collision boxes (press 'C' key)
let debugCollision = false;

export let player = {
    x: 64,
    y: 192,
    width: 20,
    height: 38,
    spriteName: 'player',
    speed: 0.09,
    slipTimer: 0,
    slipDuration: 500,
    direction: 'right',
    isMoving: false,
    isSlipping: false,
    slipTimer: 0,
    frameIndex: 0,
    frameCounter: 0,
    frameTimer: 0,
    frameInterval: 100,
    animationSpeed: 18,
    collisionWidth: 12,
    collisionHeight: 16,
    collisionOffsetY: 8,
    reduceKillerChance: 1,
    increaseCoinDropTime: 1,
    reducePattyCookTime: 1,
    reduceHotDogCookTime: 1,
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
        ],
        slip: [
            { x: 26, y: 128, w: 32, h: 34 },
            { x: 62, y: 136, w: 32, h: 34 },
            { x: 96, y: 136, w: 32, h: 34 },
            { x: 128, y: 138, w: 32, h: 34 },
            { x: 166, y: 136, w: 32, h: 34 },
            { x: 200, y: 136, w: 32, h: 34 },


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

export function getPlayerCollisionBox(x, y) {
    return {
        left: x - player.collisionWidth / 2,
        right: x + player.collisionWidth / 2,
        top: y - player.collisionHeight / 2 + player.collisionOffsetY,
        bottom: y + player.collisionHeight / 2 + player.collisionOffsetY
    };
}

export function drawPlayer() {
    let currentFrame;

    if (player.isSlipping) {
        const slipFrames = sprites.player.slip;
        currentFrame = slipFrames[player.frameIndex % slipFrames.length];
    } else {
        const walkFrames = sprites.player.walk;
        const frameCount = walkFrames.length;
        currentFrame = player.isMoving
            ? walkFrames[player.frameIndex % frameCount]
            : sprites.player.idle;
    }
    ctx.save();
    ctx.translate(Math.round(player.x), Math.round(player.y));

    if (player.direction === 'left') {
        ctx.scale(-1, 1);
    }

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        spriteSheet,
        currentFrame.x,
        currentFrame.y,
        currentFrame.w,
        currentFrame.h,
        Math.round(-player.width / 2),
        Math.round(-player.height / 2),
        currentFrame.w,
        currentFrame.h
    );

    ctx.restore();
}

export function updatePlayer(slipping, deltaTime) {
    if (gameRunning === false) return;
    if (slipping && player.slipTimer <= 0) {
        player.slipTimer = player.slipDuration;
    }

    if (player.slipTimer > 0) {
        player.isSlipping = true;
        player.slipTimer -= deltaTime;
    } else {
        player.isSlipping = false;
        player.slipTimer = 0;
    }

    let moveX = 0;
    let moveY = 0;

    if (player.isSlipping) {
        const slideMultiplier = 1;
        switch (player.direction) {
            case 'left': moveX = -1 * slideMultiplier; break;
            case 'right': moveX = 1 * slideMultiplier; break;
            case 'up': moveY = -1 * slideMultiplier; break;
            case 'down': moveY = 1 * slideMultiplier; break;
        }
        player.isMoving = true;
    } else {
        if (keys.up) moveY -= 1;
        if (keys.down) moveY += 1;
        if (keys.left) moveX -= 1;
        if (keys.right) moveX += 1;

        player.isMoving = (moveX !== 0 || moveY !== 0);
    }


    if (player.isMoving) {

        // Normalize diagonal movement
        if (!player.isSlipping && moveX !== 0 && moveY !== 0) {
            moveX *= 0.707;
            moveY *= 0.707;
        }

        const distance = player.speed * deltaTime;

        const stepX = moveX * distance;
        const stepY = moveY * distance;

        const newX = player.x + stepX;
        const newY = player.y + stepY;

        if (isValidPosition(newX, newY)) {
            player.x = newX;
            player.y = newY;
        }
        else {
            let hitWall = true;
            if (stepX !== 0 && isValidPosition(newX, player.y)) {
                player.x = newX;
                hitWall = false;
            }
            if (stepY !== 0 && isValidPosition(player.x, newY)) {
                player.y = newY;
                hitWall = false;
            }
            if (player.isSlipping && hitWall) {
                player.isSlipping = false;
                player.slipTimer = 0;
            }
        }

        if (!player.isSlipping) {
            if (moveX < 0) player.direction = 'left';
            else if (moveX > 0) player.direction = 'right';
            else if (moveY < 0) player.direction = 'up';
            else if (moveY > 0) player.direction = 'down';
        }

        player.frameTimer += deltaTime;

        const currentInterval = player.isSlipping ? player.frameInterval / 1.5 : player.frameInterval;

        if (player.frameTimer >= currentInterval) {
            player.frameTimer = 0;

            let currentAnimationArray = player.isSlipping ? sprites.player.slip : sprites.player.walk;
            const frameCount = currentAnimationArray.length || 1;

            player.frameIndex = (player.frameIndex + 1) % frameCount;
        }
    }
    else {
        player.frameIndex = 0;
        player.frameTimer = 0;
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
    //console.log(text);
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
    if (el._hideTimeout) {
        clearTimeout(el._hideTimeout);
        el._hideTimeout = null;
    }
    el.textContent = text;
    el.style.display = 'block';
    requestAnimationFrame(() => el.style.opacity = '1');
}


function hideInteractButton() {
    const el = document.getElementById('interact-text');
    if (!el) return;
    el.style.opacity = '0';
    if (el._hideTimeout) clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => {
        if (el) el.style.display = 'none';
        el._hideTimeout = null;
    }, 140);
}
export function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isSlipping = checkSpillCollision(player.x, player.y);

    updatePlayer(isSlipping, deltaTime);

    drawFloor();

    updateSpills(currentTime, canvas);
    drawSpills(ctx);


    renderObject();

    showHealth();

    showCookedFood();

    drawPlayer();

    drawCollisionBoxes();

    if (shouldSpawnNpc(currentTime)) {
        spawnNpc(currentTime);
    }
    updateNpcQueue(deltaTime);

    updateLeavingNpcs(deltaTime);

    drawQueue(ctx);

    const nearby = getNearByInteractables(player.x, player.y);
    const nearbyNpc = isFirstNpcIntaractable(player.x, player.y);

    if (nearby) {
        showInteractButton('Press E');
    } else if (nearbyNpc) {
        showInteractButton('Press F');
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
    if (playerSpriteLoaded && kitchenSpriteLoaded && gameRunning) {
        console.log('Starting game loop!');
        console.log('Press C to toggle collision debug view');
        startTimer();
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
        case 'f':
        case 'F':
            const isNpcNear = isFirstNpcIntaractable(player.x, player.y);
            if (isNpcNear) openNpcModal(npcConvoTemplate);
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


export function interactWithObject(obj) {
    if (!obj) return;
    const { onOpen, } = obj.coords.onInteract;

    if (typeof onOpen === "function") {
        onOpen(canvas, ctx, player, obj.coords.unlockedSlots)
    }
};