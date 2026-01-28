import { baseW } from "./CharacterMovement.js";
import { gameRunning } from "./GameMechanics.js";
import { showRetryPage } from "./RetryPage.js";

export const health = [1, 1];

const fullHeartSpriteSheet = new Image();
fullHeartSpriteSheet.src = 'assets/hearttype1.png'

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const heartSprite = {
    fullHeart: { x: 11, y: 14, w: 45, h: 45 },
}

export function showHealth() {
    if(gameRunning === false) return;

    ctx.imageSmoothingEnabled = false;

    const activeHearts = health.filter(h => h === 1).length;

    const displaySize = 16;
    const spacing = 2;
    const startY = 20;
    const rightMargin = 20;

    const totalHealthBarWidth = (activeHearts * displaySize) + ((activeHearts - 1) * spacing);

    const startX = Math.floor(baseW - totalHealthBarWidth - rightMargin);
    
    for (let i = 0; i < activeHearts; i++) {
        const xPos = startX + (i * (displaySize + spacing));

        if (health[i] == 1) {
            ctx.drawImage(
                fullHeartSpriteSheet,
                heartSprite.fullHeart.x, heartSprite.fullHeart.y,
                heartSprite.fullHeart.w, heartSprite.fullHeart.h,
                xPos, startY,
                displaySize, displaySize
            );
        }
    }
};

export function deductHealth() {
    if (!health) return;

    const lastIndexOfOne = health.lastIndexOf(1); // this checks whether there is one if no the function will return -1

    if (lastIndexOfOne !== -1) {
        health[lastIndexOfOne] = 0;
    }
    const dead = isDead();
    if (dead) {
        console.log("Player died");
        showRetryPage();
    }
}

export function healHealth() {
    if (!health) return;

    const FirstIndexOfZero = health.indexOf(0); // gets the first occurrence of the 0 else will be -1

    if (FirstIndexOfZero !== -1) {
        health[FirstIndexOfZero] = 1;
    }
}

export function isDead() {
    if (!health) return;

    return health.every(h => h === 0);
}