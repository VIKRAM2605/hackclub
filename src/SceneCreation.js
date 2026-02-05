import { baseH, baseW, ctx } from './CharacterMovement.js';

export const tileSize = 32;

export const spriteSheet = new Image();
spriteSheet.src = 'assets/professional_kitchen_withshadows_edited.png';

const dividerSpriteSheet = new Image();
dividerSpriteSheet.src = 'assets/divider-Photoroom.png';

const paymentSpriteSheet = new Image();
paymentSpriteSheet.src = 'assets/terminal-payment-machine-with-pixel-art-styl_475147-709-Photoroom.png'

export const sprites = {
    unCookedHotDog: { x: 85, y: 3, w: 6, h: 11, sw: 6, sh: 11 },
    cookedHotDog: { x: 85, y: 18, w: 6, h: 11, sw: 6, sh: 11 },
    cookedPatty: { x: 66, y: 19, w: 10, h: 9, sw: 10, sh: 9 },
    unCookedPatty: { x: 212, y: 69, w: 10, h: 9, sw: 10, sh: 9 },
    unCookedSoup: { x: 33, y: 177, w: 14, h: 15, sw: 14, sh: 15 },
    cookedSoup: { x: 48, y: 177, w: 15, h: 15, sw: 15, sh: 15 },

    bench1: { x: 337, y: 232, w: 47, h: 40, sw: 70, sh: 30 },
    eggCatoonHorizontal: { x: 209, y: 34, w: 14, h: 13, sw: 14, sh: 13 },
    eggCatoonVertical: { x: 211, y: 48, w: 11, h: 16, sw: 11, sh: 16 },
    gasStove: { x: 98, y: 168, w: 29, h: 40, sw: 29, sh: 40 },
    sink1: { x: 165, y: 101, w: 25, h: 58, sw: 25, sh: 58 },
    dirtyPlate: { x: 177, y: 2, w: 14, h: 13, sw: 14, sh: 13 },
    cleanPlate: { x: 145, y: 17, w: 14, h: 13, sw: 14, sh: 13 },
    grillLevel1: { x: 305, y: 164, w: 31, h: 44, sw: 31, sh: 44 },
    typeOneLongFilledShelfVertical: { x: 54, y: 453, w: 25, h: 58, sw: 25, sh: 58 },
    typeOneLongFilledShelfHorizontal: { x: 1, y: 466, w: 47, h: 46, sw: 47, sh: 46 },
    typeTwoLongFilledShelfHorizontal: { x: 208, y: 443, w: 47, h: 66, sw: 47, sh: 66 },
    cupboardType1: { x: 1, y: 232, w: 47, h: 40, sw: 47, sh: 40 },
    exhaustType1: { x: 337, y: 32, w: 47, h: 32, sw: 47, sh: 32 },
    divider: { x: 117, y: 275, w: 566, h: 250, sw: 50, sh: 25 },
    payment: { x: 175, y: 104, w: 354, h: 431, sw: 12, sh: 15 },
    towel: { x: 258, y: 65, w: 12, h: 15, sw: 12, sh: 15 },
    drawer1: { x: 161, y: 232, w: 47, h: 40, sw: 47, sh: 40 },
    knife1: { x: 243, y: 36, w: 9, h: 9, sw: 9, sh: 9 },
    mustard: { x: 257, y: 2, w: 7, h: 13, sw: 7, sh: 13 },
    ketchup: { x: 265, y: 1, w: 7, h: 13, sw: 7, sh: 13 },
    dirtyPlateStack: { x: 161, y: 13, w: 14, h: 17, sw: 14, sh: 17 },
    unCookedMeatTub: { x: 177, y: 43, w: 14, h: 20, sw: 14, sh: 20 },
    veggiesTub: { x: 161, y: 41, w: 14, h: 22, sw: 14, sh: 22 },
    peppersTub: { x: 129, y: 42, w: 14, h: 21, sw: 14, sh: 21 },
    utensilsRack1: { x: 210, y: 570, w: 47, h: 38, sw: 47, sh: 38 },
    tableaWithEggAndOther: { x: 273, y: 520, w: 47, h: 56, sw: 47, sh: 56 },
    mixer: { x: 145, y: 64, w: 15, h: 32, sw: 15, sh: 32 },
    bowlMix: { x: 194, y: 81, w: 14, h: 15, sw: 14, sh: 15 },
    DishWash1: { x: 357, y: 86, w: 27, h: 73, sw: 27, sh: 73 },

};


export let kitchenSpriteLoaded = false;

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
    let sprite;

    if (sprites[spriteName]) {
        sprite = sprites[spriteName];
    } else {
        sprite = sprites[spriteName.slice(0, -1)];
    }

    if (!sprite) {
        console.error('Sprite not found:', spriteName);
        return;
    }

    if (spriteName.slice(0, -1) === 'divider') {
        if (!dividerSpriteSheet) {
            console.warn('Divider sprite sheet not loaded yet');
            return;
        }
        const x = Math.round(col * tileSize + (tileSize - sprite.sw) / 2);
        const y = Math.round(row * tileSize + (tileSize - sprite.sh) / 2);

        ctx.drawImage(
            dividerSpriteSheet,
            sprite.x, sprite.y, sprite.w, sprite.h,
            x, y, sprite.sw, sprite.sh
        );
        return
    }
    if (spriteName.slice(0, -1) === 'bench1') {
        if (!dividerSpriteSheet) {
            console.warn('Divider sprite sheet not loaded yet');
            return;
        }
        const x = Math.round(col * tileSize + (tileSize - sprite.sw) / 2);
        const y = Math.round(row * tileSize + (tileSize - sprite.sh) / 2);

        ctx.drawImage(
            spriteSheet,
            sprite.x, sprite.y, sprite.w, sprite.h,
            x, y, sprite.sw, sprite.sh
        );
        return
    }
    if (spriteName.slice(0, -1) === 'payment') {
        if (!paymentSpriteSheet) {
            console.warn('Divider sprite sheet not loaded yet');
            return;
        }
        const x = Math.round(col * tileSize + (tileSize - sprite.sw) / 2);
        const y = Math.round(row * tileSize + (tileSize - sprite.sh) / 2);

        ctx.drawImage(
            paymentSpriteSheet,
            sprite.x, sprite.y, sprite.w, sprite.h,
            x, y, sprite.sw, sprite.sh
        );
        return
    }

    const x = Math.round(col * tileSize + (tileSize - sprite.w) / 2);
    const y = Math.round(row * tileSize + (tileSize - sprite.h) / 2);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y, sprite.w, sprite.h,
        x, y, sprite.w, sprite.h
    );
}

export function drawSpriteFromSlotToMainCanvs(spriteName, col = 0, row = 0, width, height) {
    if (!kitchenSpriteLoaded) return;
    let sprite;

    if (sprites[spriteName]) {
        sprite = sprites[spriteName];
    } else {
        sprite = sprites[spriteName.slice(0, -1)];
    }

    if (!sprite) {
        console.error('Sprite not found:', spriteName);
        return;
    }

    const x = Math.round(col * tileSize + (tileSize - sprite.w) / 2);
    const y = Math.round(row * tileSize + (tileSize - sprite.h) / 2);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y, sprite.w, sprite.h,
        x, y, width, height
    );
}

spriteSheet.onload = () => {
    console.log('Kitchen sprites loaded!');
    kitchenSpriteLoaded = true;
};