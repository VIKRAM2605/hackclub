import { baseH, baseW, canvas, ctx } from './CharacterMovement.js';

export const tileSize = 32;

export const spriteSheet = new Image();
spriteSheet.src = 'assets/professional_kitchen_withshadows.png';

const doorSpriteSheet = new Image();
doorSpriteSheet.src = 'assets/professional_kitchen_room_door_tiles.png';

export const sprites = {
    unCookedHotDog: { x: 85, y: 3, w: 6, h: 11, sw: 6, sh: 11 },
    cookedHotDog: { x: 85, y: 18, w: 6, h: 11, sw: 6, sh: 11 },
    eggCatoonHorizontal: { x: 209, y: 34, w: 14, h: 13, sw: 14, sh: 13 },
    eggCatoonVertical: { x: 211, y: 48, w: 11, h: 16, sw: 11, sh: 16 },
    gasStove: { x: 98, y: 168, w: 29, h: 40, sw: 29, sh: 40 },
    sinkHorizontal: { x: 49, y: 115, w: 31, h: 45, sw: 31, sh: 45 },
    dirtyPlate: { x: 177, y: 2, w: 14, h: 13, sw: 14, sh: 13 },
    cleanPlate: { x: 145, y: 17, w: 14, h: 13, sw: 14, sh: 13 },
    cookedPatty: { x: 66, y: 19, w: 10, h: 12, sw: 10, sh: 12 },
    grillLevel1: { x: 305, y: 164, w: 31, h: 44, sw: 31, sh: 44 },
    typeOneLongFilledShelfVertical: { x: 54, y: 453, w: 25, h: 58, sw: 25, sh: 58 },
    typeOneLongFilledShelfHorizontal: { x: 1, y: 466, w: 47, h: 46, sw: 47, sh: 46 },
    typeTwoLongFilledShelfHorizontal: { x: 208, y: 443, w: 47, h: 66, sw: 47, sh: 66 },
    cupboardType1: { x: 1, y: 232, w: 47, h: 40, sw: 47, sh: 40 },
    exhaustType1: { x: 337, y: 32, w: 47, h: 32, sw: 47, sh: 32 },
};

const doorSprite = {
    openDoorType1: { x: 208, y: 292, w: 320, h: 69, sw: 320, sh: 69 },
};

export let kitchenSpriteLoaded = false;

export function drawDoor(spriteName, col, row) {
    const sprite = doorSprite[spriteName.slice(0, -1)];
    const x = Math.round(col * tileSize + (tileSize - sprite.w) / 2);
    const y = Math.round(row * tileSize + (tileSize - sprite.h) / 2);

    ctx.drawImage(
        doorSpriteSheet,
        sprite.x, sprite.y, sprite.w, sprite.h,
        x, y, sprite.sw, sprite.sh
    );
}

export function drawFloor() {
    const cols = Math.floor(baseW / tileSize);
    const rows = Math.floor(baseH / tileSize);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * tileSize;
            const y = row * tileSize;

            ctx.fillStyle = (row + col) % 2 === 0 ? '#FFFFFF' : '#bcbcbc';
            ctx.fillRect(x, y, tileSize, tileSize);

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, tileSize, tileSize);
        }
    }

    const wallThickness = 5;

    drawWallStrip(0, 0, wallThickness, baseH);
    drawWallStrip(baseW - wallThickness, 0, wallThickness, baseH);
    drawWallStrip(0, 0, baseW, wallThickness);
    drawWallStrip(0, baseH - wallThickness, baseW, wallThickness);
}

function drawWallStrip(x, y, width, height) {
    ctx.fillStyle = '#8B5A3C';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#6B4423';
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

    ctx.strokeStyle = '#9B6A4C';
    ctx.lineWidth = 2;

    const plankSpacing = 32;
    for (let i = 0; i < height; i += plankSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + width, y + i);
        ctx.stroke();
    }

    ctx.strokeStyle = '#4A3322';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

export function drawSprite(spriteName, col = 0, row = 0) {
    if (!kitchenSpriteLoaded) return;

    const sprite = sprites[spriteName.slice(0, -1)];
    if (!sprite) {
        console.error('Sprite not found:', spriteName);
        return;
    }

    const x = Math.round(col * tileSize + (tileSize - sprite.w) / 2);
    const y = Math.round(row * tileSize + (tileSize - sprite.h) / 2);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y, sprite.w, sprite.h,
        x, y, sprite.sw, sprite.sh
    );
}

spriteSheet.onload = () => {
    console.log('Kitchen sprites loaded!');
    kitchenSpriteLoaded = true;
};