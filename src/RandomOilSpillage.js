
const spillageSprite = new Image();
spillageSprite.src = 'assets/oilspill.png';

let nextSpillTime = 0;
let minSpillSpawnTime = 1000;
let maxSpillSpawnTime = 2000;

export const activeSpills = [];

export function spawnSpillage(x, y, currentTime) {
    activeSpills.push({
        id: `spill_${Date.now()}`,
        x: x,
        y: y,
        width: 32,
        height: 32,
        spawnTime: currentTime
    });
    console.log("spill:", activeSpills);
};


export function updateSpills(currentTime, canvas) {
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
            return true;
        }
    }
    return false;
}

export function pauseAllActiveSpills() {

}

export function resumeAllPausedSpills() {

}