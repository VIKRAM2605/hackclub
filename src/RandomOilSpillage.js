import { gameRunning } from "./GameMechanics.js";
import { npcsServedCount } from "./NpcStateManagement.js";
import { randomInt } from "./RandomCoinDrops.js";
import { cookedFoodCount } from "./StateManagement.js";

const spillageSprite = new Image();
spillageSprite.src = 'assets/oilspill.png';

let nextSpillTime = 0;
let minSpillSpawnTime = 1000;
let maxSpillSpawnTime = 2000;

let globalPauseStartTime = 0;


export const activeSpills = [];

export function spawnSpillage(x, y, currentTime) {
    activeSpills.push({
        id: `spill_${Date.now()}`,
        x: x,
        y: y,
        width: 32,
        height: 32,
        spawnTime: currentTime,
        pausedTime: null
    });
};


export function updateSpills(currentTime, canvas) {
    if(gameRunning === false) return;
    for (let i = activeSpills.length - 1; i >= 0; i--) {
        const spill = activeSpills[i];

        if (currentTime - spill.spawnTime > 10000) {
            activeSpills.splice(i, 1);
        }
    }
    if (currentTime > nextSpillTime) {
        const topMargin = 50;
        const bottomMargin = 50;
        const sideMargin = 50;
        const minX = sideMargin;
        const maxX = canvas.width - sideMargin - 50;

        const minY = topMargin;
        const maxY = canvas.height - bottomMargin - 50;

        const randomX = Math.floor(Math.random() * (maxX - minX) + minX);
        const randomY = Math.floor(Math.random() * (maxY - minY) + minY);

        spawnSpillage(randomX, randomY, currentTime);

        nextSpillTime = currentTime + minSpillSpawnTime + (Math.random() * (maxSpillSpawnTime - minSpillSpawnTime));
    }
}

export function drawSpills(ctx) {
    ctx.imageSmoothingEnabled = false;
    for (let i = 0; i < activeSpills.length; i++) {
        const spill = activeSpills[i];
        ctx.drawImage(spillageSprite, spill.x, spill.y, spill.width, spill.height);
    }
}

export function checkSpillCollision(playerX, playerY) {
    const playerFeetY = playerY + 15;
    const collisionThreshold = 18;
    for (let i = 0; i < activeSpills.length; i++) {
        const spill = activeSpills[i];
        const spillCenterX = spill.x + (spill.width / 2);
        const spillCenterY = spill.y + (spill.height / 2);

        const dx = playerX - spillCenterX;
        const dy = playerFeetY - spillCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
            console.log("Player slipped on oil!");
            activeSpills.splice(i, 1);
            dropSomefood();
            return true;
        }
    }
    return false;
}

export function dropSomefood() {
    let minDrop = 1;
    let maxDrop = 1;
    let typesToLose = 1;

    if (npcsServedCount >= 5) {
        maxDrop = 2;
    }
    if (npcsServedCount >= 10) {
        minDrop = 1;
        maxDrop = 3;
    }
    if (npcsServedCount >= 15) {
        minDrop = 2;
        maxDrop = 4;
        typesToLose = 2;
    }
    if (npcsServedCount >= 25) {
        minDrop = 3;
        maxDrop = 5;
        typesToLose = 3;
    }
    let availableFoodTypes = Object.keys(cookedFoodCount).filter(food => cookedFoodCount[food] > 0);
    if (availableFoodTypes.length === 0) {
        console.log("nothing to drop!");
        return;
    }
    let lostLog = [];
    for (let i = 0; i < typesToLose; i++) {
        if (availableFoodTypes.length === 0) break;

        const randomIndex = randomInt(0, availableFoodTypes.length - 1);
        const foodName = availableFoodTypes[randomIndex];

        availableFoodTypes.splice(randomIndex, 1);

        const currentStock = cookedFoodCount[foodName];
        const amountToDrop = randomInt(minDrop, maxDrop);

        const actualLoss = Math.min(currentStock, amountToDrop);

        cookedFoodCount[foodName] -= actualLoss;

        lostLog.push(`${actualLoss}x ${foodName}`);
    }
    console.log(cookedFoodCount);
}

export function pauseAllActiveSpills(currentTime) {
    console.log(currentTime)
    globalPauseStartTime = currentTime;

    for (let i = 0; i < activeSpills.length; i++) {
        let spill = activeSpills[i];
        spill.pausedTime = currentTime;
    }
}

export function resumeAllPausedSpills(currentTime) {
    console.log(currentTime);

    let durationPaused = 0;

    if (globalPauseStartTime > 0) {
        durationPaused = currentTime - globalPauseStartTime;

        nextSpillTime += durationPaused;

        globalPauseStartTime = 0;
    }
    for (let i = 0; i < activeSpills.length; i++) {
        let spill = activeSpills[i];

        if (spill.pausedTime) {
            spill.spawnTime += (currentTime - spill.pausedTime);

            spill.pausedTime = null;
        }
    }
}