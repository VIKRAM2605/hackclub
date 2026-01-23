import { cookedFoodCount, drawSpriteOnModal } from "./StateManagement.js";
import { deductHealth, showHealth } from "./HealthStateManagement.js";
import { getPlayerCollisionBox } from "./CharacterMovement.js";


let spawnDelayTime = 20000;
let minSpawnDelay = 2000;

let lastSpawnTime = 0;
let nextSpawnDelay = 4000 + Math.random() * spawnDelayTime;

let patience = 25;
let minPatience = 10;

let npcsServedCount = 0;

let killerChance = 0.05;

export const npcQueue = [];
export const leavingNpcs = [];

export const npcQueuePosition = [180, 210, 240];
export let queuePointer = 0;

const spriteSheet = new Image();
spriteSheet.src = 'assets/Chef A2.png';

const npcSprites = {
    npc1: {
        idle: { x: 38, y: 16, w: 20, h: 34 },
        walk: [
            { x: 38, y: 16, w: 20, h: 34 },
            { x: 38, y: 58, w: 20, h: 34 },
            { x: 70, y: 56, w: 20, h: 34 },
            { x: 104, y: 58, w: 20, h: 34 },
            { x: 134, y: 58, w: 20, h: 34 },
        ]
    }
};
const orderWeights = {
    'cookedPatty': 0.4,
    'cookedHotDog': 0.3,
    // 'cookedBurger': 0.2,
    // 'fries': 0.1,
};

const totalWeight = Object.values(orderWeights).reduce((sum, w) => sum + w, 0);

export function spawnNpc(currentTime) {
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

    const npcData = {
        id: npcId,
        order,
        patience: patience,
        spawnTime: currentTime,
        positionX: -50,
        positionY: npcQueuePosition[queuePointer++],
        status: 'going',
        isKiller: Math.random() < killerChance ? true : false,
    };
    npcQueue.push(npcData);
    console.log(npcQueue);
    lastSpawnTime = currentTime;
    nextSpawnDelay = 4000 + Math.random() * spawnDelayTime;
}

export function bringUpTheOrder() {

};

export function updateNpcQueue(deltaTime) {
    if (npcQueue.length === 0) return;

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
            if (npcQueue[0].patience < 0) {
                console.log(`${npcQueue[0].order} left angry!`);
                npcQueue[0].status = "unserved"
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

export function updateLeavingNpcs(deltaTime){
    if(leavingNpcs.length == 0) return;
    const exitTargetX = 600;
    for(let i=leavingNpcs.length - 1;i>=0;i--){
        const npc = leavingNpcs[i];

        if(npc.positionX < exitTargetX){
            npc.positionX += 60 * (deltaTime/1000);
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
    return (currentTime - lastSpawnTime) > nextSpawnDelay && queuePointer < 3;
}



export function drawQueue(ctx) {
    for (let i = 0; i < npcQueue.length; i++) {
        const customer = npcQueue[i];

        ctx.fillStyle = i === 0 ? '#ffaa00' : '#44aa88';
        ctx.fillRect(customer.positionX, customer.positionY, 30, 40);

        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(customer.order, customer.positionX + 15, customer.positionY + 20);

        if (i === 0 && customer.status === "ordering") {
            ctx.fillStyle = 'red';
            ctx.fillRect(customer.positionX, customer.positionY - 8, 30, 4);
            ctx.fillStyle = customer.patience > 10 ? 'green' : 'orange';
            ctx.fillRect(customer.positionX, customer.positionY - 8, 30 * (customer.patience / 25), 4);
        }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(10, 10, 100, 25);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Queue: ${npcQueue.length}`, 15, 27);
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
    const modal = document.createElement('div');
    modal.id = "main-modal";
    modal.innerHTML = template;
    document.getElementById('game-container').appendChild(modal);

    const npcSpriteCanva = document.getElementById('npc-sprite');
    const ctxNpcSprite = npcSpriteCanva.getContext('2d');

    drawNPCSpriteOnModal('npc1', npcSpriteCanva, ctxNpcSprite);

    const currentOrder = npcQueue[0].order;
    const foodListContainer = document.getElementById('npc-foods');
    const serveBtn = document.getElementById('serve-button');

    let canAffordAll = true;
    foodListContainer.innerHTML = '';

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

        npcQueue[0].status = "served";
        npcQueue.shift();

        console.log(`Order Served! Remaining Queue: ${npcQueue.length}`);

        if (npcQueue[0].isKiller) {
            deductHealth();
        }

        decreasePatienceTime();
        decreaseSpawnDelayTime();
        npcsServedCount++;
        modal.remove();
    });

    const unServeBtn = document.getElementById('unserve-button');
    unServeBtn.addEventListener('click', () => {
        npcQueue[0].status = "served";

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

    const sprite = npcSprites[spriteName]['idle'];
    console.log(sprite);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y,
        sprite.w, sprite.h,
        0, 0,
        sprite.w * 3, sprite.h
    );

}