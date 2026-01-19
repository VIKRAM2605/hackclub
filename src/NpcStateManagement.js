import { cookedFoodCount } from "./StateManagement.js";
import { deductHealth, showHealth } from "./HealthStateManagement.js";
import { getPlayerCollisionBox } from "./CharacterMovement.js";


let spawnDelayTime = 20000;
let lastSpawnTime = 0;
let nextSpawnDelay = 4000 + Math.random() * spawnDelayTime;

let patience = 25;
let decrementPatienceTime = 0.001;

export const npcQueue = [];
export const npcQueuePosition = [180, 210, 240];
export let queuePointer = 0;

const orderWeights = {
    'cookedPatty': 0.4,
    'cookedHotDog': 0.3,
    'cookedBurger': 0.2,
    'fries': 0.1,
};

const totalWeight = Object.values(orderWeights).reduce((sum, w) => sum + w, 0);

export function spawnNpc(currentTime) {
    const npcId = `npc_${Date.now()}`;

    let order = [];
    const totalOrders = 1 + Math.floor(Math.random() * 3);

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
        const quantity = 1 + Math.floor(Math.random() * 4);
        order.push({ food: selectedFood, quantity: quantity });
    }

    const npcData = {
        id: npcId,
        order,
        patience: patience,
        spawnTime: currentTime,
        positionX: -50,
        positionY: npcQueuePosition[queuePointer++],
        status: 'going',
    };
    npcQueue.push(npcData);
    console.log(npcQueue)
    lastSpawnTime = currentTime
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
                queuePointer = npcQueue.length;
                return;
            }
            if (cookedFoodCount[npcQueue[0].order] > 0) {
                cookedFoodCount[npcQueue[0].order]--;
                npcQueue[0].status = "served";
                npcQueue.shift();
                console.log(`Served! Queue length: ${npcQueue.length}`);
                queuePointer = npcQueue.length;
                showHealth()
                return;
            }
        }

        npcQueue[i].positionY = targetY;
    }

    queuePointer = npcQueue.length;


}

export function decreaseSpawnDelayTime() {
    spawnDelayTime = spawnDelayTime - 0.005;
};
export function decreasePatienceTime() {
    patience = patience - decrementPatienceTime;
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

        if (i === 0 && customer.status ==="ordering") {
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

    const playerBox = getPlayerCollisionBox(x,y);
    const playerCenterX = (playerBox.left + playerBox.right)/2;
    const playerCenterY = (playerBox.top + playerBox.bottom)/2;

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