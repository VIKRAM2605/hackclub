import { gameRunning } from "./GameMechanics.js";
import { sprites, spriteSheet } from "./SceneCreation.js";
import { cookedFoodCount } from "./StateManagement.js";

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');



export function showCookedFood() {
    if (gameRunning === false) return;
    const iconSize = 8;
    const rightMargin = 20;
    const spacing = 5;

    const foodStartY = 40;

    const columnWidth = 40;
    const rowHeight = 20;

    ctx.imageSmoothingEnabled = false;

    ctx.font = `${Math.floor(10)}px monospace`;
    ctx.fillStyle = "white";
    ctx.textAlign = 'right';
    ctx.textBaseline = "top";

    ctx.shadowColor = "black";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    let verticaloffset = 0;

    let index = 0;
    for (let food in cookedFoodCount) {
        const quantity = cookedFoodCount[food];

        const sprite = sprites[food];
        const quantityText = `x${quantity}`;
        const textWidth = ctx.measureText(quantityText).width;

        const col = index % 2;
        const row = Math.floor(index / 2);

        const xBase = Math.floor(canvas.width - rightMargin - (col * columnWidth));
        const yPos = Math.floor(foodStartY + (row * rowHeight));

        if (sprite) {
            const xPosIcon = Math.floor(xBase - textWidth - spacing - sprite.w);
            ctx.drawImage(
                spriteSheet,
                sprite.x, sprite.y, sprite.w, sprite.h,
                xPosIcon, yPos,
                sprite.w, sprite.h
            );
        }
        ctx.fillText(
            quantityText,
            xBase,
            Math.floor(yPos + (sprite.h / 4))
        )
        verticaloffset += iconSize + 8;
        index++;
        ctx.shadowColor = "black";
    }
    ctx.shadowColor = "transparent";
}
