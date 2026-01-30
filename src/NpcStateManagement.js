import { cookedFoodCount, drawSpriteOnModal } from "./StateManagement.js";
import { deductHealth, showHealth } from "./HealthStateManagement.js";
import { getPlayerCollisionBox } from "./CharacterMovement.js";
import { killerNpcDialogs, normalNpcDialogs } from "./NpcDialogs.js";
import { gameRunning } from "./GameMechanics.js";


let spawnDelayTime = 20000;
let minSpawnDelay = 2000;

let lastSpawnTime = 0;
let nextSpawnDelay = 4000 + Math.random() * spawnDelayTime;

let patience = 25;
let minPatience = 10;

export let npcsServedCount = 0;

let killerChance = 0.05;

export const npcQueue = [];
export const leavingNpcs = [];

export const npcQueuePosition = [180, 210, 240];
export let queuePointer = 0;

const spriteSheet = new Image();
spriteSheet.src = 'assets/01-generic.png';

const npcSprites = {
    npc1: {
        ordering: { x: 19, y: 62, w: 13, h: 17 },
        walking: [
            { x: 4, y: 44, w: 10, h: 16 },
            { x: 21, y: 43, w: 10, h: 17 },
            { x: 36, y: 44, w: 10, h: 16 },
        ]
    },
    npc2: {
        ordering: { x: 20, y: 136, w: 13, h: 17 },
        walking: [
            { x: 3, y: 118, w: 10, h: 16},
            { x: 21, y: 117, w: 10, h: 17 },
            { x: 37, y: 116, w: 10, h: 16 },
        ]
    },
    npc3: {
        ordering: { x: 68, y: 60, w: 13, h: 18 },
        walking: [
            { x: 52, y: 43, w: 10, h: 16 },
            { x: 69, y: 41, w: 10, h: 17 },
            { x: 84, y: 42, w: 10, h: 16 },
        ]
    },
    npc4: {
        ordering: { x: 68, y: 136, w: 13, h: 17 },
        walking: [
            { x: 53, y: 117, w: 10, h: 16 },
            { x: 69, y: 118, w: 10, h: 17 },
            { x: 84, y: 118, w: 10, h: 16 },
        ]
    },
    npc5: {
        ordering: { x: 113, y: 59, w: 13, h: 17 },
        walking: [
            { x: 97, y: 44, w: 12, h: 16 },
            { x: 114, y: 41, w: 11, h: 17 },
            { x: 128, y: 41, w: 12, h: 16 },
        ]
    },
    npc6: {
        ordering: { x: 114, y: 136, w: 13, h: 17 },
        walking: [
            { x: 98, y: 117, w: 12, h: 16 },
            { x: 114, y: 117, w: 11, h: 17 },
            { x: 130, y: 117, w: 12, h: 16 },
        ]
    },
    npc7: {
        ordering: { x: 162, y: 56, w: 13, h: 17 },
        walking: [
            { x: 146, y: 42, w: 10, h: 16 },
            { x: 163, y: 37, w: 10, h: 17 },
            { x: 180, y: 40, w: 10, h: 16 },
        ]
    },
    npc8: {
        ordering: { x: 163, y: 133, w: 13, h: 17 },
        walking: [
            { x: 147, y: 116, w: 10, h: 16 },
            { x: 163, y: 114, w: 10, h: 17 },
            { x: 180, y: 115, w: 10, h: 16 },
        ]
    },
    npc9: {
        ordering: { x: 210, y: 55, w: 13, h: 17 },
        walking: [
            { x: 193, y: 38, w: 12, h: 16 },
            { x: 210, y: 37, w: 11, h: 17 },
            { x: 225, y: 38, w: 12, h: 16 },
        ]
    },
    npc10: {
        ordering: { x: 211, y: 131, w: 13, h: 16 },
        walking: [
            { x: 195, y: 115, w: 12, h: 16 },
            { x: 211, y: 112, w: 11, h: 17 },
            { x: 226, y: 112, w: 12, h: 16 },
        ]
    },
};

const animationSpeed = 40;

const orderWeights = {
    'cookedPatty': 0.5,
    'cookedHotDog': 0.3,
};

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
    };
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
        const targetX = 500 - (2 * 50);
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
                npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "angry");
                npcQueue[0].status = "unserved";
                leavingNpcs.push(npcQueue[0]);
                npcQueue.shift();
                deductHealth();
                decreasePatienceTime();
                decreaseSpawnDelayTime();
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

export function updateAnimation(customer) {
    customer.animTimer++;
    if (customer.animTimer > animationSpeed) {
        customer.animTimer = 0;

        customer.animFrame = (customer.animFrame + 1) % 3;
    }
}

export function animateNpc(ctx, frame, x, y, targetW, targetH) {

    if (!frame) return;

    ctx.drawImage(
        spriteSheet,
        frame.x, frame.y, frame.w, frame.h,
        x, y, targetW, targetH
    )

}

export function drawQueue(ctx) {
    ctx.imageSmoothingEnabled = false;

    for (let i = 0; i < leavingNpcs.length; i++) {
        const customer = leavingNpcs[i];

        initNpc(customer);
        updateAnimation(customer);

        const spriteData = npcSprites[customer.skin];
        const frame = spriteData.walking[customer.animFrame];

        animateNpc(ctx, frame, customer.positionX, customer.positionY, 20, 34);

    }

    for (let i = 0; i < npcQueue.length; i++) {
        const customer = npcQueue[i];

        initNpc(customer);
        updateAnimation(customer);

        const spriteData = npcSprites[customer.skin];
        let frame;

        if (customer.status === "ordering") {
            frame = spriteData.ordering;
        } else {
            updateAnimation(customer);
            frame = spriteData.walking[customer.animFrame];
        }

        animateNpc(ctx, frame, customer.positionX, customer.positionY, 20, 34);

        if (customer.status === "ordering" && i == 0) {
            const barWidth = 30;
            const spriteWidth = 20;
            const barHeight = 4;
            const offsetX = 0

            const centerX = customer.positionX + (spriteWidth / 2);

            const startX = centerX - (barWidth/2) + offsetX;

            ctx.fillStyle = 'red';
            ctx.fillRect(startX, customer.positionY - 8, barWidth, barHeight);
            ctx.fillStyle = customer.patience > 10 ? 'green' : 'orange';
            ctx.fillRect(startX, customer.positionY - 8, barWidth * (customer.patience / 25), barHeight);
        }
    }
}



export function isFirstNpcIntaractable(x, y, maxDistance = 60) {
    if (!npcQueue[0]) return false;
    if (npcQueue[0].status !== "ordering") return false;
    //console.log(x,y);

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

export function openNpcModal(template) {
    if (!template || !npcQueue[0] || npcQueue[0].status !== "ordering") return;
    let modal = document.getElementById('main-modal');
    if (modal) return;
    modal = document.createElement('div');
    modal.id = "main-modal";
    modal.innerHTML = template;
    document.getElementById('game-container').appendChild(modal);

    const npcSpriteCanva = document.getElementById('npc-sprite');
    const ctxNpcSprite = npcSpriteCanva.getContext('2d');

    drawNPCSpriteOnModal('npc1', npcSpriteCanva, ctxNpcSprite);

    const currentOrder = npcQueue[0].order;
    const foodListContainer = document.getElementById('npc-foods');
    const npcDialog = document.getElementById('npc-dialog');
    const serveBtn = document.getElementById('serve-button');

    let canAffordAll = true;
    foodListContainer.innerHTML = '';

    npcDialog.innerText = npcQueue[0].dialog;

    currentOrder.forEach(item => {
        const requiredAmount = item.quantity;
        const playerHas = cookedFoodCount[item.food] || 0;
        const hasEnough = playerHas >= requiredAmount ? true : false;

        if (!hasEnough) canAffordAll = false;

        const row = document.createElement('div');
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.marginBottom = "10px";
        row.style.background = "rgba(255, 255, 255, 0.05)";
        row.style.padding = "8px";
        row.style.borderRadius = "8px";

        const foodCanvas = document.createElement('canvas');
        foodCanvas.width = 50;
        foodCanvas.height = 50;
        foodCanvas.style.marginRight = "15px";

        const foodctx = foodCanvas.getContext('2d');
        foodctx.imageSmoothingEnabled = false;

        console.log(item.food);
        drawSpriteOnModal(item.food, foodCanvas, foodctx);

        const infoText = document.createElement('div');
        infoText.style.display = "flex";
        infoText.style.flexDirection = "column";

        const qtyText = document.createElement('span');
        qtyText.style.fontWeight = "bold";
        qtyText.style.fontSize = "18px";
        qtyText.style.color = "#eee";
        qtyText.innerText = `x ${requiredAmount}`;

        const stockText = document.createElement('span');
        stockText.style.fontSize = "12px";
        stockText.style.marginTop = "2px";
        stockText.style.color = hasEnough ? "#4caf50" : "#ff5252";
        stockText.innerText = hasEnough
            ? `Available: ${playerHas}`
            : `Missing (${playerHas}/${requiredAmount})`;

        infoText.appendChild(qtyText);
        infoText.appendChild(stockText);

        row.appendChild(foodCanvas);
        row.appendChild(infoText);
        foodListContainer.appendChild(row);

    });

    if (!canAffordAll) {
        serveBtn.style.background = "#444";
        serveBtn.style.color = "#aaa";
        serveBtn.style.cursor = "not-allowed";
        serveBtn.innerText = "Not enough";
    } else {
        serveBtn.innerText = "Serve Order";
        serveBtn.style.background = "#2e8b57";
    }

    serveBtn.addEventListener('click', () => {
        if (!canAffordAll) return;

        currentOrder.forEach(item => {
            cookedFoodCount[item.food] -= item.quantity;
        });
        npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "served");
        npcQueue[0].status = "served";
        leavingNpcs.push(npcQueue[0]);
        if (npcQueue[0].isKiller) {
            deductHealth();
        }
        npcQueue.shift();

        console.log(`Order Served! Remaining Queue: ${npcQueue.length}`);

        decreasePatienceTime();
        decreaseSpawnDelayTime();
        npcsServedCount++;
        modal.remove();
    });

    const unServeBtn = document.getElementById('unserve-button');
    unServeBtn.addEventListener('click', () => {

        npcQueue[0].dialog = getNpcDialog(npcQueue[0].isKiller, "angry")
        npcQueue[0].status = "unserved";
        leavingNpcs.push(npcQueue[0]);
        if (!npcQueue[0].isKiller) {
            deductHealth();
        }

        npcQueue.shift();

        modal.remove();
    })

    const closeButton = document.getElementById('close-modal');
    closeButton.addEventListener('click', () => {
        modal.remove();
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.remove();
    });

}
export function drawNPCSpriteOnModal(spriteName, canvas, ctx) {

    const sprite = npcSprites[spriteName]['ordering'];
    console.log(sprite);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y,
        sprite.w, sprite.h,
        0, 0,
        sprite.w, sprite.h
    );

}