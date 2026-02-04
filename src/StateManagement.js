import { gameRunning } from "./GameMechanics.js";
import { objectCoordinates } from "./ObjectCoordinates.js";
import { drawSpriteFromSlotToMainCanvs, sprites, spriteSheet } from "./SceneCreation.js";
import { cookedFoodCount } from "./TotalCookedFoods.js";

export let State = {};

const closeSprite = new Image();
closeSprite.src = 'assets/Main_tiles.png';

const inventorySprite = new Image();
inventorySprite.src = 'assets/Inventory.png';

const lockSprite = new Image();
lockSprite.src = 'assets/lock-Photoroom.png';

const timerSprite = new Image();
timerSprite.src = 'assets/sand-glass1-Photoroom.png';

const timerFrames = {
    completed: { x: 139, y: 161, w: 51, h: 66 },
    ongoing: [
        { x: 43, y: 32, w: 50, h: 67 },
        { x: 139, y: 32, w: 51, h: 67 },
        { x: 235, y: 32, w: 51, h: 67 },
        { x: 332, y: 32, w: 50, h: 67 },
        { x: 43, y: 161, w: 50, h: 66 },
        { x: 139, y: 161, w: 51, h: 66 },
        { x: 223, y: 153, w: 51, h: 66 },
        { x: 320, y: 153, w: 51, h: 66 },
    ]
};

const grillSlotPositions = [
    { x: 14, y: 8 },
    { x: 28, y: 8 },
    { x: 14, y: 17 },
    { x: 28, y: 17 }
];

const stoveSlotPositions = [
    { x: 13, y: 3 },
    { x: 25, y: 3 },
    { x: 13, y: 12 },
    { x: 25, y: 12 }
];

const intaractableGrillPositionsForPatty = [
    { col: -0.19, row: -0.32 },
    { col: 0.24, row: -0.32 },
    { col: -0.19, row: -0.08 },
    { col: 0.24, row: -0.08 }
];

const intaractableGrillPositionsForHotDog = [
    { col: -0.19, row: -0.32 },
    { col: 0.24, row: -0.32 },
    { col: -0.19, row: -0.08 },
    { col: 0.24, row: -0.08 }
];

const intaractableStovePositionsForSoup = [
    { col: -0.19, row: -0.46 },
    { col: 0.24, row: -0.46 },
    { col: -0.18, row: -0.20 },
    { col: 0.25, row: -0.20 }
];

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 4;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (closeSprite.complete) loadedCount++; else closeSprite.onload = onload;
        if (inventorySprite.complete) loadedCount++; else inventorySprite.onload = onload;
        if (lockSprite.complete) loadedCount++; else lockSprite.onload = onload;
        if (timerSprite.complete) loadedCount++; else timerSprite.onload = onload;

        if (loadedCount === totalImages) resolve();
    });
};

export function resetState() {
    for (let key in State) {
        delete State[key];
    }
}

export async function showCookingModal(templateName, objectId, unlockedSlots) {
    await imagesLoaded();

    if (document.getElementById('cooking-modal-overlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'cooking-modal-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1000',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 30px',
        backgroundColor: '#eec39a',
        borderRadius: '12px',
        border: '4px solid #5D4037',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        minWidth: '400px'
    });

    const objectNames = {
        'grillLevel11': 'Grill - Patties',
        'grillLevel12': 'Grill - Hot Dogs',
        'gasStove1': 'Gas Stove - Soup'
    };

    const title = document.createElement('div');
    title.textContent = objectNames[templateName] || 'Cooking Station';
    Object.assign(title.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: '20px',
        textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
    });
    modal.appendChild(title);

    const contentArea = document.createElement('div');
    Object.assign(contentArea.style, {
        display: 'flex',
        gap: '30px',
        alignItems: 'flex-start'
    });

    const stationPreview = document.createElement('div');
    Object.assign(stationPreview.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    });

    const stationLabel = document.createElement('div');
    stationLabel.textContent = 'Station';
    Object.assign(stationLabel.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#5D4037'
    });
    stationPreview.appendChild(stationLabel);

    const stationCanvas = document.createElement('canvas');
    stationCanvas.id = 'station-sprite-canvas';
    stationCanvas.dataset.objectId = objectId;
    const stationSize = 200;
    setupCanvas(stationCanvas, stationSize, stationSize);
    stationPreview.appendChild(stationCanvas);

    contentArea.appendChild(stationPreview);

    const cookingArea = document.createElement('div');
    Object.assign(cookingArea.style, {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    });

    const foodSelector = document.createElement('div');
    Object.assign(foodSelector.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
    });

    const foodLabel = document.createElement('div');
    foodLabel.textContent = 'Click to Cook';
    Object.assign(foodLabel.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#5D4037'
    });
    foodSelector.appendChild(foodLabel);

    const foodCanvas = document.createElement('canvas');
    foodCanvas.id = 'food-selector-canvas';
    const foodSize = 80;
    setupCanvas(foodCanvas, foodSize, foodSize);
    Object.assign(foodCanvas.style, {
        cursor: 'pointer',
        border: '3px solid #5D4037',
        borderRadius: '8px',
        backgroundColor: '#d4a574'
    });
    foodSelector.appendChild(foodCanvas);

    cookingArea.appendChild(foodSelector);

    const slotsLabel = document.createElement('div');
    slotsLabel.textContent = 'Cooking Slots';
    Object.assign(slotsLabel.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#5D4037',
        textAlign: 'center'
    });
    cookingArea.appendChild(slotsLabel);

    const slotsGrid = document.createElement('div');
    slotsGrid.id = 'slots-grid';
    Object.assign(slotsGrid.style, {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
    });

    for (let i = 1; i <= 4; i++) {
        const slotCanvas = document.createElement('canvas');
        slotCanvas.id = `slot-${i}`;
        slotCanvas.className = 'cooking-slot';
        const slotSize = 80;
        setupCanvas(slotCanvas, slotSize, slotSize);
        Object.assign(slotCanvas.style, {
            border: '3px solid #5D4037',
            borderRadius: '8px',
            backgroundColor: '#d4a574'
        });
        slotsGrid.appendChild(slotCanvas);
    }

    cookingArea.appendChild(slotsGrid);
    contentArea.appendChild(cookingArea);
    modal.appendChild(contentArea);

    const dpr = window.devicePixelRatio || 1;
    const closeCanvas = document.createElement('canvas');
    const closeW = 9;
    const closeH = 9;
    const closeScale = 4;
    const closeLogicalW = closeW * closeScale;
    const closeLogicalH = closeH * closeScale;

    closeCanvas.width = closeLogicalW * dpr;
    closeCanvas.height = closeLogicalH * dpr;
    Object.assign(closeCanvas.style, {
        width: `${closeLogicalW}px`,
        height: `${closeLogicalH}px`,
        position: 'absolute',
        top: '15px',
        right: '15px',
        cursor: 'pointer'
    });

    const closectx = closeCanvas.getContext('2d');
    closectx.imageSmoothingEnabled = false;
    closectx.scale(dpr * closeScale, dpr * closeScale);

    closectx.drawImage(
        closeSprite,
        356, 291, closeW, closeH,
        0, 0, closeW, closeH
    );

    let isReady = false;
    setTimeout(() => { isReady = true; }, 200);

    const closeModal = () => {
        if (!isReady) return;
        overlay.remove();
        document.removeEventListener('keydown', handleEscape);
    };

    closeCanvas.onclick = closeModal;
    modal.appendChild(closeCanvas);

    const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);

    overlay.appendChild(modal);
    document.getElementById('game-container').appendChild(overlay);

    initializeCookingInterface(templateName, objectId, unlockedSlots);
}

function setupCanvas(canvas, size, scale = 1) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    return ctx;
}

function initializeCookingInterface(templateName, objectId, unlockedSlots) {
    drawStationPreview(templateName, objectId);

    const foodTypes = {
        'grillLevel11': 'unCookedPatty',
        'grillLevel12': 'unCookedHotDog',
        'gasStove1': 'unCookedSoup'
    };
    const foodType = foodTypes[templateName];
    drawFoodSelector(foodType);

    initializeSlots(objectId, unlockedSlots, templateName);

    const foodCanvas = document.getElementById('food-selector-canvas');
    foodCanvas.onclick = () => {
        addItemsToSlot(foodType, objectId, unlockedSlots, templateName);
    };
}

function drawStationPreview(templateName, objectId) {
    const canvas = document.getElementById('station-sprite-canvas');
    if (!canvas) return;

    const activeModalId = canvas.dataset.objectId;

    if (String(activeModalId) !== String(objectId)) {
        return;
    }

    const ctx = canvas.getContext('2d');
    const size = 200;

    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#d4a574';
    ctx.fillRect(0, 0, size, size);

    const spriteName = templateName.slice(0, -1);
    const sprite = sprites[spriteName];
    if (sprite) {
        const spriteScale = 4;
        const spriteW = sprite.w * spriteScale;
        const spriteH = sprite.h * spriteScale;

        ctx.drawImage(
            spriteSheet,
            sprite.x, sprite.y, sprite.w, sprite.h,
            (size - spriteW) / 2, (size - spriteH) / 2,
            spriteW, spriteH
        );
    }

    drawFoodOnStation(ctx, objectId, templateName, size);
}

function drawFoodOnStation(ctx, objectId, templateName, canvasSize) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];

    if (!State[objectId]) return;

    slots.forEach((slotId, index) => {
        const slotData = State[objectId][slotId];

        if (slotData && slotData.spriteName && (slotData.status === 'cooking' || slotData.status === 'cooked')) {
            let sprite, pos, name, foodSize;

            if (slotData.status === 'cooked') {
                name = slotData.spriteName.replace('unCooked', 'cooked');
            } else {
                name = slotData.spriteName;
            }

            sprite = sprites[name];

            if (templateName === 'gasStove1') {
                pos = stoveSlotPositions[index];
                foodSize = 12;
            } else {
                pos = grillSlotPositions[index];
                foodSize = 8;
            }

            if (sprite && pos) {
                const scale = canvasSize / 50;
                ctx.drawImage(
                    spriteSheet,
                    sprite.x, sprite.y, sprite.w, sprite.h,
                    pos.x * scale, pos.y * scale,
                    foodSize * scale, foodSize * scale
                );
            }
        }
    });
}

function drawFoodSelector(foodType) {
    const canvas = document.getElementById('food-selector-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 80;

    ctx.clearRect(0, 0, size, size);

    const sprite = sprites[foodType];
    if (sprite) {
        const spriteScale = 3;
        const spriteW = sprite.w * spriteScale;
        const spriteH = sprite.h * spriteScale;

        ctx.drawImage(
            spriteSheet,
            sprite.x, sprite.y, sprite.w, sprite.h,
            (size - spriteW) / 2, (size - spriteH) / 2,
            spriteW, spriteH
        );
    }
}

function initializeSlots(objectId, unlockedSlots, templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    State[objectId] ??= {};

    slots.forEach((slotId, index) => {
        const slotCanvas = document.getElementById(slotId);
        if (!slotCanvas) return;

        const ctx = slotCanvas.getContext('2d');
        const size = 80;

        ctx.clearRect(0, 0, size, size);

        if (index >= unlockedSlots) {
            // Draw locked slot
            drawLockedSlot(ctx, size);
            slotCanvas.style.cursor = 'not-allowed';
        } else {
            slotCanvas.style.cursor = 'pointer';

            // Restore previous state if exists
            if (State[objectId][slotId]) {
                redrawSlot(slotId, objectId, slotCanvas, templateName, size);
            }
        }
    });
}

function drawLockedSlot(ctx, size) {
    const lockSize = size * 0.4;
    ctx.drawImage(
        lockSprite,
        83, 61, 90, 128,
        (size - lockSize) / 2, (size - lockSize) / 2,
        lockSize, lockSize
    );
}

export function addItemsToSlot(spriteName, objectId, unlockedSlots, templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    let targetSlot = null;
    let targetSlotId = null;

    State[objectId] ??= {};

    for (let i = 0; i < slots.length; i++) {
        if (i >= unlockedSlots) continue;

        let slotId = slots[i];
        const slotCanvas = document.getElementById(slotId);
        if (slotCanvas && (!State[objectId][slotId] || State[objectId][slotId].status === 'empty')) {
            targetSlot = slotCanvas;
            targetSlotId = slotId;
            break;
        }
    }

    if (!targetSlot || !targetSlotId) {
        console.log('No empty slots available!');
        return;
    }

    State[objectId][targetSlotId] ??= {};

    const ctx = targetSlot.getContext('2d');
    const size = 80;

    if (State[objectId][targetSlotId].animationId) {
        cancelAnimationFrame(State[objectId][targetSlotId].animationId);
        State[objectId][targetSlotId].animationId = null;
    }

    State[objectId][targetSlotId].spriteName = spriteName;
    State[objectId][targetSlotId].status = 'cooking';
    State[objectId][targetSlotId].accumulatedTime = 0;
    State[objectId][targetSlotId].lastFrameTime = performance.now();

    targetSlot.style.borderColor = '#4CAF50';

    targetSlot.onclick = () => handleSlotClick(objectId, targetSlotId, templateName, ctx, size);

    drawStationPreview(templateName, objectId);

    State[objectId][targetSlotId].animationId = requestAnimationFrame((currentTime) =>
        animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, size)
    );
}

function handleSlotClick(objectId, slotId, templateName, ctx, size) {
    const status = State[objectId][slotId].status;

    if (status === 'cooked') {
        console.log('picked up cooked food');

        const foodName = State[objectId][slotId].spriteName.replace('unCooked', 'cooked');
        updateCookedFoodCount(foodName);

        if (State[objectId][slotId].animationId) {
            cancelAnimationFrame(State[objectId][slotId].animationId);
        }

        ctx.clearRect(0, 0, size, size);

        State[objectId][slotId].status = "empty";
        State[objectId][slotId].spriteName = null;
        State[objectId][slotId].startTime = null;
        State[objectId][slotId].pauseStartTime = null;

        const slotCanvas = document.getElementById(slotId);
        if (slotCanvas) {
            slotCanvas.style.borderColor = '#5D4037';
        }

        drawStationPreview(templateName, objectId);

    } else if (status === 'cooking') {
        console.log('removed uncooked food');

        if (State[objectId][slotId].animationId) {
            cancelAnimationFrame(State[objectId][slotId].animationId);
        }

        ctx.clearRect(0, 0, size, size);

        State[objectId][slotId].status = "empty";
        State[objectId][slotId].spriteName = null;
        State[objectId][slotId].startTime = null;
        State[objectId][slotId].pauseStartTime = null;

        const slotCanvas = document.getElementById(slotId);
        if (slotCanvas) {
            slotCanvas.style.borderColor = '#5D4037';
        }

        drawStationPreview(templateName, objectId);
    }
}

function animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, size) {
    const slotData = State[objectId][targetSlotId];

    if (!gameRunning) {
        slotData.lastFrameTime = currentTime;

        slotData.animationId = requestAnimationFrame((time) =>
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, size)
        );
        return;
    }

    const deltaTime = currentTime - (slotData.lastFrameTime || currentTime);
    slotData.lastFrameTime = currentTime;
    const safeDelta = Math.min(deltaTime, 100);
    slotData.accumulatedTime += safeDelta;

    const totalCookingTime = objectCoordinates[templateName].cookingTime;
    const timeInMs = slotData.accumulatedTime;
    const elapsedSeconds = Math.floor(timeInMs / 1000);
    const timeLeft = Math.max(0, totalCookingTime - elapsedSeconds);

    ctx.clearRect(0, 0, size, size);

    let displaySpriteName = spriteName;
    if (slotData.status === 'cooked') {
        displaySpriteName = spriteName.replace('unCooked', 'cooked');
    }

    drawFoodInSlot(ctx, displaySpriteName, size);

    if (timeLeft > 0) {
        const frameDuration = 125;
        const totalFrames = timerFrames.ongoing.length;
        const frameIndex = Math.floor(timeInMs / frameDuration) % totalFrames;

        if (timerFrames.ongoing[frameIndex]) {
            drawTimerOnSlot(ctx, timerFrames.ongoing[frameIndex], size);
        }

        slotData.animationId = requestAnimationFrame((time) =>
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, size)
        );
    } else {
        console.log("cooked food");
        slotData.animationId = null;
        slotData.status = 'cooked';

        drawFoodInSlot(ctx, spriteName.replace('unCooked', 'cooked'), size);

        targetSlot.style.borderColor = 'lime';

        drawStationPreview(templateName, objectId);
    }
}

function drawFoodInSlot(ctx, spriteName, size) {
    const sprite = sprites[spriteName];
    if (!sprite) return;

    const spriteScale = 3;
    const spriteW = sprite.w * spriteScale;
    const spriteH = sprite.h * spriteScale;

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y, sprite.w, sprite.h,
        (size - spriteW) / 2, (size - spriteH) / 2,
        spriteW, spriteH
    );
}

function drawTimerOnSlot(ctx, frame, size) {
    const timerScale = 2;
    const timerW = 8 * timerScale;
    const timerH = 10 * timerScale;

    ctx.drawImage(
        timerSprite,
        frame.x, frame.y, frame.w, frame.h,
        (size - timerW) / 2, (size - timerH) / 2,
        timerW, timerH
    );
}

function redrawSlot(slotId, objectId, slotCanvas, templateName, size) {
    const slotData = State[objectId][slotId];
    const ctx = slotCanvas.getContext('2d');
    const totalCookingTime = objectCoordinates[templateName].cookingTime;

    slotData.accumulatedTime ??= 0;

    const now = performance.now();
    slotData.lastFrameTime = now;

    const timeAway = now - (slotData.lastFrameTime || now);

    if (gameRunning && slotData.status === 'cooking') {
        slotData.accumulatedTime += timeAway;
    }

    slotCanvas.onclick = () => handleSlotClick(objectId, slotId, templateName, ctx, size);

    if (slotData.animationId) {
        cancelAnimationFrame(slotData.animationId);
    }

    if (slotData.status === 'cooking') {
        const timeInMs = slotData.accumulatedTime;
        const elapsedSeconds = Math.floor(timeInMs / 1000);
        const timeLeft = Math.max(0, totalCookingTime - elapsedSeconds);

        ctx.clearRect(0, 0, size, size);
        drawFoodInSlot(ctx, slotData.spriteName, size);

        if (timeLeft > 0) {
            const frameDuration = 125;
            const totalFrames = timerFrames.ongoing.length;
            const frameIndex = Math.floor(timeInMs / frameDuration) % totalFrames;

            if (timerFrames.ongoing[frameIndex]) {
                drawTimerOnSlot(ctx, timerFrames.ongoing[frameIndex], size);
            }

            slotData.animationId = requestAnimationFrame((currentTime) =>
                animateTimer(currentTime, slotData.spriteName, ctx, slotCanvas, objectId, slotId, templateName, size)
            );
        } else {
            slotData.status = 'cooked';
            drawFoodInSlot(ctx, slotData.spriteName.replace('unCooked', 'cooked'), size);
            slotCanvas.style.borderColor = 'lime';
        }
    } else if (slotData.status === 'cooked') {
        drawFoodInSlot(ctx, slotData.spriteName.replace('unCooked', 'cooked'), size);
        slotCanvas.style.borderColor = 'lime';
    }
}

export function updateCookedFoodCount(foodName) {
    if (!foodName) return;
    if (!Object.prototype.hasOwnProperty.call(cookedFoodCount, foodName)) {
        console.warn('updateCookedFoodCount: unknown key', foodName);
        return;
    }
    cookedFoodCount[foodName] += 1;
    return cookedFoodCount[foodName];
}

export function drawCookingSpriteOnMainCanvas(objectId, templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    if (State[objectId]) {
        slots.forEach((slotId, index) => {
            const slotData = State[objectId][slotId];

            if (slotData && slotData.spriteName && (slotData.status === 'cooking' || slotData.status === 'cooked')) {
                let pos, stn, name, size = 6;

                if (slotData.status === 'cooked') {
                    name = slotData.spriteName.replace('unCooked', 'cooked');
                } else {
                    name = slotData.spriteName;
                }

                if (templateName === 'grillLevel11') {
                    stn = objectCoordinates['grillLevel11'];
                    pos = intaractableGrillPositionsForPatty[index];
                }
                else if (templateName === 'grillLevel12') {
                    stn = objectCoordinates['grillLevel12'];
                    pos = intaractableGrillPositionsForHotDog[index];
                }
                else if (templateName === 'gasStove1') {
                    stn = objectCoordinates['gasStove1'];
                    pos = intaractableStovePositionsForSoup[index];
                    size = 12;
                }

                if (pos && stn) {
                    drawSpriteFromSlotToMainCanvs(name, pos.col + stn.col, pos.row + stn.row, size, size);
                }
            }
        });
    }
}