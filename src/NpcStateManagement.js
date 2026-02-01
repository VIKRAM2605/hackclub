import { cookedFoodCount, drawSpriteOnModal } from "./StateManagement.js";
import { deductHealth, showHealth } from "./HealthStateManagement.js";
import { getPlayerCollisionBox } from "./CharacterMovement.js";
import { killerNpcDialogs, normalNpcDialogs } from "./NpcDialogs.js";
import { gameRunning } from "./GameMechanics.js";
import { addBalance } from "./Wallet.js";


let spawnDelayTime = 20000;
let minSpawnDelay = 2000;

let lastSpawnTime = 0;
let nextSpawnDelay = 4000 + Math.random() * spawnDelayTime;

export let patience = 25;
let minPatience = 10;

export let npcsServedCount = 0;

export let killerChance = 0.15;

export const npcQueue = [];
export const leavingNpcs = [];

export const npcQueuePosition = [180, 210, 240];
export let queuePointer = 0;

const spriteSheet = new Image();
spriteSheet.src = 'assets/01-generic.png';

const bgSpriteSheet = new Image();
bgSpriteSheet.src = 'assets/shopplaceholder-Photoroom.png';

const closeSprite = new Image();
closeSprite.src = 'assets/Main_tiles.png';

const cloud = new Image();
cloud.src = 'assets/cloud-box-Photoroom.png';

const npcSprites = {
    npc1: {
        ordering: { x: 19, y: 62, w: 13, h: 17 },
        canvas: { x: 18, y: 0, w: 13, h: 17 },
        walking: [
            { x: 4, y: 44, w: 10, h: 16 },
            { x: 21, y: 43, w: 10, h: 17 },
            { x: 36, y: 44, w: 10, h: 16 },
        ]
    },
    npc2: {
        ordering: { x: 20, y: 136, w: 13, h: 17 },
        canvas: { x: 19, y: 81, w: 13, h: 17 },
        walking: [
            { x: 3, y: 118, w: 10, h: 16 },
            { x: 21, y: 117, w: 10, h: 17 },
            { x: 37, y: 116, w: 10, h: 16 },
        ]
    },
    npc3: {
        ordering: { x: 68, y: 60, w: 13, h: 18 },
        canvas: { x: 66, y: 0, w: 13, h: 17 },
        walking: [
            { x: 52, y: 43, w: 10, h: 16 },
            { x: 69, y: 41, w: 10, h: 17 },
            { x: 84, y: 42, w: 10, h: 16 },
        ]
    },
    npc4: {
        ordering: { x: 68, y: 136, w: 13, h: 17 },
        canvas: { x: 68, y: 80, w: 13, h: 17 },
        walking: [
            { x: 53, y: 117, w: 10, h: 16 },
            { x: 69, y: 118, w: 10, h: 17 },
            { x: 84, y: 118, w: 10, h: 16 },
        ]
    },
    npc5: {
        ordering: { x: 113, y: 59, w: 13, h: 17 },
        canvas: { x: 114, y: 0, w: 13, h: 17 },
        walking: [
            { x: 97, y: 44, w: 12, h: 16 },
            { x: 114, y: 41, w: 11, h: 17 },
            { x: 128, y: 41, w: 12, h: 16 },
        ]
    },
    npc6: {
        ordering: { x: 114, y: 136, w: 13, h: 17 },
        canvas: { x: 113, y: 78, w: 13, h: 17 },
        walking: [
            { x: 98, y: 117, w: 12, h: 16 },
            { x: 114, y: 117, w: 11, h: 17 },
            { x: 130, y: 117, w: 12, h: 16 },
        ]
    },
    npc7: {
        ordering: { x: 162, y: 56, w: 13, h: 17 },
        canvas: { x: 162, y: 0, w: 13, h: 17 },
        walking: [
            { x: 146, y: 42, w: 10, h: 16 },
            { x: 163, y: 37, w: 10, h: 17 },
            { x: 180, y: 40, w: 10, h: 16 },
        ]
    },
    npc8: {
        ordering: { x: 163, y: 133, w: 13, h: 17 },
        canvas: { x: 162, y: 76, w: 13, h: 17 },
        walking: [
            { x: 147, y: 116, w: 10, h: 16 },
            { x: 163, y: 114, w: 10, h: 17 },
            { x: 180, y: 115, w: 10, h: 16 },
        ]
    },
    npc9: {
        ordering: { x: 210, y: 55, w: 13, h: 17 },
        canvas: { x: 210, y: 0, w: 13, h: 17 },
        walking: [
            { x: 193, y: 38, w: 12, h: 16 },
            { x: 210, y: 37, w: 11, h: 17 },
            { x: 225, y: 38, w: 12, h: 16 },
        ]
    },
    npc10: {
        ordering: { x: 211, y: 131, w: 13, h: 16 },
        canvas: { x: 210, y: 74, w: 13, h: 17 },
        walking: [
            { x: 195, y: 115, w: 12, h: 16 },
            { x: 211, y: 112, w: 11, h: 17 },
            { x: 226, y: 112, w: 12, h: 16 },
        ]
    },
};

const thinkBubble = { x: 84, y: 250, w: 393, h: 165 };

const animationSpeed = 40;

const orderWeights = {
    'cookedPatty': 0.5,
    'cookedHotDog': 0.3,
};

const food_price = {
    'cookedPatty': 20,
    'cookedHotDog': 30,
}

const totalWeight = Object.values(orderWeights).reduce((sum, w) => sum + w, 0);

export function spawnNpc(currentTime) {
    if (gameRunning === false) return;

    const npcId = `npc_${Date.now()}`;

    let maxOrdersPerNPC = 1;
    let maxQuantityPerItem = 1;

    if (npcsServedCount >= 5) {
        maxQuantityPerItem = 2;
    }
    if (npcsServedCount >= 10) {
        maxOrdersPerNPC = 2;
    }
    if (npcsServedCount >= 20) {
        maxQuantityPerItem = 3;
    }
    if (npcsServedCount >= 30) {
        maxOrdersPerNPC = 3;
        maxQuantityPerItem = 4;
    }

    let order = [];
    const totalOrders = 1 + Math.floor(Math.random() * maxOrdersPerNPC);

    for (let i = 0; i < totalOrders; i++) {
        let randFood = Math.random() * totalWeight;
        let selectedFood;
        for (let food in orderWeights) {
            randFood -= orderWeights[food];
            if (randFood <= 0) {
                selectedFood = food;
                break;
            }
        }
        const quantity = 1 + Math.floor(Math.random() * maxQuantityPerItem);

        const alreadyOrdered = order.some(o => o.food === selectedFood);
        if (!alreadyOrdered) {
            order.push({ food: selectedFood, quantity: quantity });
        } else {
            const existingItem = order.find(o => o.food === selectedFood);
            if (existingItem.quantity < maxQuantityPerItem) {
                existingItem.quantity++;
            }
        }
    }

    if (order.length === 0) {
        order.push({ food: 'cookedPatty', quantity: 1 });
    }

    const isKiller = Math.random() < killerChance ? true : false;
    const npcData = {
        id: npcId,
        order,
        patience: patience,
        spawnTime: currentTime,
        positionX: -50,
        positionY: npcQueuePosition[queuePointer++],
        status: 'going',
        isKiller: isKiller,
        dialog: getNpcDialog(isKiller, 'greeting'),
        reachedHalfPatience: false,
        skin: null
    };
    initNpc(npcData);
    npcQueue.push(npcData);
    console.log(npcQueue);
    lastSpawnTime = currentTime;
    nextSpawnDelay = 4000 + Math.random() * spawnDelayTime;
}

export function getNpcDialog(isKiller, category) {
    const dialogSource = isKiller ? killerNpcDialogs : normalNpcDialogs;
    const lines = dialogSource[category];
    const randomLineIndex = Math.floor(Math.random() * lines.length);
    return lines[randomLineIndex];
}

export function updateNpcQueue(deltaTime) {
    if (npcQueue.length === 0) return;
    if (gameRunning === false) return;

    for (let i = 0; i < npcQueue.length; i++) {
        const targetX = 325 - (2 * 50);
        const targetY = npcQueuePosition[i];

        //stop close to the target
        if (Math.abs(npcQueue[i].positionX - targetX) < 5) {
            npcQueue[i].positionX = targetX;
            npcQueue[i].status = "ordering";
        } else {
            //move to the target place
            npcQueue[i].positionX += 40 * (deltaTime / 1000);
        }
        if (i === 0 && Math.abs(npcQueue[0].positionX - targetX) < 5) {
            npcQueue[0].patience -= deltaTime / 1000;
            if (npcQueue[0].patience == patience / 2 && !npcQueue[0].reachedHalfPatience) {
                npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "waiting");
                npcQueue[0].reachedHalfPatience = true;
            }
            if (npcQueue[0].patience < 0) {
                console.log(`${npcQueue[0].order} left angry!`);
                const modal = document.getElementById('main-modal');
                if (modal) {
                    modal.remove()
                }
                npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "angry");
                npcQueue[0].status = "unserved";
                leavingNpcs.push(npcQueue[0]);
                npcQueue.shift();
                deductHealth();
                decreasePatienceTime();
                decreaseSpawnDelayTime();
                npcsServedCount++;
                queuePointer = npcQueue.length;
                return;
            }
        }

        npcQueue[i].positionY = targetY;
    }

    queuePointer = npcQueue.length;
}

export function updateLeavingNpcs(deltaTime) {
    if (leavingNpcs.length == 0) return;
    if (gameRunning === false) return;
    const exitTargetX = 600;
    for (let i = leavingNpcs.length - 1; i >= 0; i--) {
        const npc = leavingNpcs[i];

        if (npc.positionX < exitTargetX) {
            npc.positionX += 60 * (deltaTime / 1000);
        } else {
            console.log(`${npc.id} has left the map.`)
            leavingNpcs.splice(i, 1);
        }
    }
};

export function decreaseSpawnDelayTime() {
    if (spawnDelayTime > minSpawnDelay) {
        spawnDelayTime -= 100;
    }
};
export function decreasePatienceTime() {
    if (patience > minPatience) {
        patience -= 0.5;
    }
}
function processOrderPayment(order) {
    let totalEarnings = 0;

    order.forEach(item => {
        const price = food_price[item.food] || 15;
        totalEarnings += price * item.quantity;
    });

    console.log(`Earned: $${totalEarnings}`);
    addBalance(totalEarnings);
}

export function shouldSpawnNpc(currentTime) {
    if (gameRunning === false) return;
    return (currentTime - lastSpawnTime) > nextSpawnDelay && queuePointer < 3;
}

export function initNpc(customer) {
    if (!customer.skin) {
        const keys = Object.keys(npcSprites);
        customer.skin = keys[Math.floor(Math.random() * keys.length)];

        customer.animFrame = 0;
        customer.animTimer = 0;
    }
}

export function updateAnimation(customer, deltaTime) {
    customer.animTimer += deltaTime;

    const frameInterval = 150;

    if (customer.animTimer >= frameInterval) {
        customer.animTimer -= frameInterval;
        customer.animFrame = (customer.animFrame + 1) % 3;
    }
}

export function animateNpc(ctx, frame, x, y, targetW, targetH) {
    if (!frame) return;
    ctx.drawImage(
        spriteSheet,
        frame.x, frame.y, frame.w, frame.h,
        x, y, targetW, targetH
    );
}

export function drawQueue(ctx, deltaTime = 0) {
    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < leavingNpcs.length; i++) {
        const customer = leavingNpcs[i];
        initNpc(customer);
        const spriteData = npcSprites[customer.skin];
        const frame = spriteData.walking[customer.animFrame];

        if (gameRunning === true) {
            updateAnimation(customer, deltaTime);
        }

        animateNpc(ctx, frame, customer.positionX, customer.positionY, 20, 34);

        if (customer.dialog) {
            const bubbleW = 60;
            const bubbleH = 25;
            const bubbleX = customer.positionX - 35;
            const bubbleY = customer.positionY - 30;

            ctx.drawImage(
                cloud,
                thinkBubble.x, thinkBubble.y, thinkBubble.w, thinkBubble.h,
                bubbleX, bubbleY, bubbleW, bubbleH
            );

            ctx.font = "8px 'Pixelify Sans', sans-serif";
            ctx.fillStyle = "#3e2723";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const textX = bubbleX + (bubbleW / 2);
            const textY = bubbleY + (bubbleH / 2) - 2;

            ctx.fillText(customer.dialog, textX, textY, bubbleW - 10);
        }
    }

    for (let i = 0; i < npcQueue.length; i++) {
        const customer = npcQueue[i];
        initNpc(customer);

        const spriteData = npcSprites[customer.skin];
        let frame;

        if (customer.status === "ordering") {
            frame = spriteData.ordering;
        } else {
            if (gameRunning === true) {
                updateAnimation(customer, deltaTime);
            }
            frame = spriteData.walking[customer.animFrame];
        }

        animateNpc(ctx, frame, customer.positionX, customer.positionY, 20, 34);

        if (customer.status === "ordering" && i === 0) {
            const barWidth = 30;
            const spriteWidth = 20;
            const barHeight = 4;
            const offsetX = 0;

            const centerX = customer.positionX + (spriteWidth / 2);
            const startX = centerX - (barWidth / 2) + offsetX;

            ctx.fillStyle = '#d32f2f';
            ctx.fillRect(startX, customer.positionY - 8, barWidth, barHeight);

            const fillRatio = Math.max(0, customer.patience / patience);
            const fillWidth = barWidth * fillRatio;

            ctx.fillStyle = fillRatio > 0.3 ? '#4caf50' : '#ff9800';
            ctx.fillRect(startX, customer.positionY - 8, fillWidth, barHeight);
        }
    }
}



export function isFirstNpcIntaractable(x, y, maxDistance = 60) {
    if (!npcQueue[0]) return false;
    if (npcQueue[0].status !== "ordering") return false;

    const playerBox = getPlayerCollisionBox(x, y);
    const playerCenterX = (playerBox.left + playerBox.right) / 2;
    const playerCenterY = (playerBox.top + playerBox.bottom) / 2;

    const npcWidth = 30;
    const npcHeight = 40;

    const npcLeft = npcQueue[0].positionX;
    const npcTop = npcQueue[0].positionY;

    const npcCenterX = npcLeft + (npcWidth / 2);
    const npcCenterY = npcTop + (npcHeight / 2);

    const dx = playerCenterX - npcCenterX;
    const dy = playerCenterY - npcCenterY;
    return (dx * dx + dy * dy) <= (maxDistance * maxDistance);
}


function drawPixelButton(canvas, text, theme, dpr, scale, isDisabled = false) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const logicalW = 130;
    const logicalH = 40;

    canvas.width = logicalW * dpr * scale;
    canvas.height = logicalH * dpr * scale;
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr * scale, dpr * scale);
    ctx.imageSmoothingEnabled = false;

    const colors = {
        green: { main: '#4caf50', light: '#80e27e', dark: '#087f23', border: '#1b5e20', text: '#fff' },
        red: { main: '#d32f2f', light: '#ff6659', dark: '#9a0007', border: '#5d1010', text: '#fff' },
        gray: { main: '#555555', light: '#777777', dark: '#333333', border: '#222222', text: '#aaaaaa' }
    };

    let p = isDisabled ? colors.gray : colors[theme];
    if (!p) p = colors.gray;

    const w = logicalW;
    const h = logicalH;

    ctx.clearRect(0, 0, w, h);

    // Border
    ctx.fillStyle = p.border;
    ctx.fillRect(2, 0, w - 4, h);
    ctx.fillRect(0, 2, w, h - 4);
    ctx.fillRect(1, 1, w - 2, h - 2);

    // Main Body
    ctx.fillStyle = p.main;
    ctx.fillRect(2, 2, w - 4, h - 4);

    // Highlights
    ctx.fillStyle = p.light;
    ctx.fillRect(2, 2, w - 6, 2);
    ctx.fillRect(2, 2, 2, h - 6);

    // Shadows
    ctx.fillStyle = p.dark;
    ctx.fillRect(4, h - 4, w - 6, 2);
    ctx.fillRect(w - 4, 4, 2, h - 6);

    ctx.fillStyle = p.text;
    ctx.font = "16px 'Pixelify Sans', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.border;
    ctx.fillText(text, (w / 2) + 2, (h / 2) + 2);
    ctx.fillStyle = p.text;
    ctx.fillText(text, w / 2, h / 2);

    canvas.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
}


export function openNpcModal(template) {
    if (!template || !npcQueue[0] || npcQueue[0].status !== "ordering") return;

    let modal = document.getElementById('main-modal');
    if (modal) return;

    modal = document.createElement('div');
    modal.id = "main-modal";
    modal.innerHTML = template;
    document.getElementById('game-container').appendChild(modal);

    const dpr = window.devicePixelRatio || 1;

    const bgCanavsW = 127;
    const bgCanavsH = 69;
    const pixelScale = 4;
    const scale = 4;

    const canvas = document.getElementById('npc-bg-canvas');
    const bgLogicalW = bgCanavsW * scale;
    const bgLogicalH = bgCanavsH * scale;

    canvas.width = bgLogicalW * dpr;
    canvas.height = bgLogicalH * dpr;
    canvas.style.width = `${bgLogicalW}px`;
    canvas.style.height = `${bgLogicalH}px`;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr * scale, dpr * scale);

    const w = bgLogicalW / pixelScale;
    const h = bgLogicalH / pixelScale;

    // Draw Background
    ctx.fillStyle = '#eec39a';
    ctx.fillRect(2, 2, w - 4, h - 4);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#2d1e15';
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    ctx.strokeStyle = '#8b5e3c';
    ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
    ctx.fillStyle = '#c69c6d';
    ctx.fillRect(1, 1, w - 2, 1);
    ctx.fillRect(1, 1, 1, h - 2);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(1, h - 2, w - 2, 1);
    ctx.fillRect(w - 2, 1, 1, h - 2);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(2, 2, 1, 1);
    ctx.fillRect(w - 3, 2, 1, 1);
    ctx.fillRect(2, h - 3, 1, 1);
    ctx.fillRect(w - 3, h - 3, 1, 1);

    const closeCanvas = document.getElementById('close-modal-canvas');
    const closeW = 9;
    const closeH = 9;
    const closeLogicalW = closeW * scale;
    const closeLogicalH = closeH * scale;

    closeCanvas.width = closeLogicalW * dpr;
    closeCanvas.height = closeLogicalH * dpr;
    closeCanvas.style.width = `${closeLogicalW}px`;
    closeCanvas.style.height = `${closeLogicalH}px`;

    const closectx = closeCanvas.getContext('2d');
    closectx.imageSmoothingEnabled = false;
    closectx.scale(dpr * scale, dpr * scale);

    closectx.drawImage(
        closeSprite,
        356, 291, closeW, closeH,
        0, 0, closeW, closeH
    );

    const npcSpriteCanva = document.getElementById('npc-sprite');
    const ctxNpcSprite = npcSpriteCanva.getContext('2d');

    drawNPCSpriteOnModal(npcQueue[0].skin, npcSpriteCanva, ctxNpcSprite, dpr);

    const currentOrder = npcQueue[0].order;
    const foodListContainer = document.getElementById('npc-foods');
    const npcDialog = document.getElementById('npc-dialog');
    const serveBtnCanvas = document.getElementById('serve-btn-canvas');
    const unServeBtnCanvas = document.getElementById('refuse-btn-canvas');

    let canAffordAll = true;
    foodListContainer.innerHTML = '';
    npcDialog.innerText = npcQueue[0].dialog;

    currentOrder.forEach(item => {
        const requiredAmount = item.quantity;
        const playerHas = cookedFoodCount[item.food] || 0;
        const hasEnough = playerHas >= requiredAmount;

        if (!hasEnough) canAffordAll = false;

        const row = document.createElement('div');
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.padding = "6px";
        row.style.borderRadius = "6px";
        row.style.flex = "0 0 auto";

        const foodCanvas = document.createElement('canvas');

        const foodLogicalSize = 64;

        foodCanvas.style.width = `${foodLogicalSize}px`;
        foodCanvas.style.height = `${foodLogicalSize}px`;
        foodCanvas.style.marginRight = "10px";

        foodCanvas.width = foodLogicalSize * dpr;
        foodCanvas.height = foodLogicalSize * dpr;

        const foodctx = foodCanvas.getContext('2d');
        foodctx.imageSmoothingEnabled = false;

        foodctx.scale(dpr, dpr);

        drawSpriteOnModal(item.food, foodCanvas, foodctx, foodLogicalSize, foodLogicalSize, "npc");

        const infoText = document.createElement('div');
        infoText.style.display = "flex";
        infoText.style.flexDirection = "column";

        const qtyText = document.createElement('span');
        qtyText.style.fontWeight = "bold";
        qtyText.style.fontSize = "16px";
        qtyText.style.fontFamily = "'Pixelify Sans', sans-serif";
        qtyText.style.color = "#3e2723";

        qtyText.style.color = "#3e2723";
        qtyText.innerText = `x ${requiredAmount}`;

        const stockText = document.createElement('span');
        stockText.style.fontSize = "10px";
        stockText.style.marginTop = "2px";
        stockText.style.fontFamily = "'Pixelify Sans', sans-serif";
        stockText.style.color = hasEnough ? "#2e7d32" : "#d32f2f";
        stockText.innerText = hasEnough
            ? `Have: ${playerHas}`
            : `Need: ${playerHas}/${requiredAmount}`;

        infoText.appendChild(qtyText);
        infoText.appendChild(stockText);

        row.appendChild(foodCanvas);
        row.appendChild(infoText);
        foodListContainer.appendChild(row);
    });

    const serveText = canAffordAll ? "SERVE" : "NOT ENOUGH";
    drawPixelButton(
        serveBtnCanvas,
        serveText,
        'green',
        dpr,
        1,
        !canAffordAll
    );

    drawPixelButton(
        unServeBtnCanvas,
        "REJECT",
        'red',
        dpr,
        1
    );

    serveBtnCanvas.onclick = () => {
        if (!canAffordAll) return;
        currentOrder.forEach(item => {
            cookedFoodCount[item.food] -= item.quantity;
        });

        processOrderPayment(currentOrder);

        npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "served");
        npcQueue[0].status = "served";
        leavingNpcs.push(npcQueue[0]);
        if (npcQueue[0].isKiller) {
            deductHealth();
        }
        npcQueue.shift();
        decreasePatienceTime();
        decreaseSpawnDelayTime();
        npcsServedCount++;
        modal.remove();
    };

    unServeBtnCanvas.onclick = () => {
        npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "angry");
        npcQueue[0].status = "unserved";
        leavingNpcs.push(npcQueue[0]);
        if (!npcQueue[0].isKiller) {
            deductHealth();
        }
        npcQueue.shift();
        decreasePatienceTime();
        decreaseSpawnDelayTime();
        npcsServedCount++;
        modal.remove();
    };

    closeCanvas.addEventListener('click', () => modal.remove());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.remove();
    });
}


export function drawNPCSpriteOnModal(skinName, canvas, ctx, dpr = 1) {
    if (!npcSprites[skinName]) return;

    const sprite = npcSprites[skinName].canvas;

    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;


    const cropHeight = Math.floor(sprite.h * 0.65);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y,
        sprite.w, sprite.h,
        0, 0, canvas.width, canvas.height
    );
}