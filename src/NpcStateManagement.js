import { cookedFoodCount } from "./StateManagement.js";
import { deductHealth, showHealth } from "./HealthStateManagement.js";

let lastSpawnTime = 0;
let nextSpawnDelay = 8000 + Math.random() * 5000;

export const npcQueue = [];
export const npcQueuePosition = [180, 210, 240];
export let queuePointer = 0;

const orderWeights = {
    'cookedPatty': 0.4,
    'cookedHotDog': 0.3,
};


export function spawnNpc(currentTime) {
    const npcId = `npc_${Date.now()}`;

    const npcData = {
        id: npcId,
        order: Math.random() > 0.5 ? 'cookedPatty' : 'cookedHotDog',
        patience: 25,
        spawnTime: currentTime,
        positionX: -50,
        positionY: npcQueuePosition[queuePointer++],
    };
    npcQueue.push(npcData);
    console.log(npcQueue)
    lastSpawnTime = currentTime
}

export function updateNpcQueue(deltaTime) {
    if (npcQueue.length === 0) return;

    if (npcQueue[0]) {
        npcQueue[0].patience -= deltaTime / 1000;

        if (npcQueue[0].patience < 0) {
            console.log(`${npcQueue[0].order} left angry!`);
            npcQueue.shift();
            queuePointer--;
            deductHealth();
            return;
        }
    }

    if (npcQueue.length > 0) {
        const orderingCustomer = npcQueue[0];
        orderingCustomer.positionX = 400;
        orderingCustomer.positionY = npcQueuePosition[0];

        if (cookedFoodCount[orderingCustomer.order] > 0) {
            cookedFoodCount[orderingCustomer.order]--;
            npcQueue.shift();
            queuePointer--;
            console.log(`Served! Queue length: ${npcQueue.length}`);
        }
    }
    for (let i = 1; i < npcQueue.length; i++) {
        const targetX = 500 - (2 * 50);
        const targetY = npcQueuePosition[i];
        //stop close to the target
        if (Math.abs(npcQueue[i].positionX - targetX) < 5) {
            npcQueue[i].positionX = targetX;
        } else {
            //move to the target place
            npcQueue[i].positionX += 40 * (deltaTime / 1000);
        }

        npcQueue[i].positionY = targetY;
    }

    queuePointer = npcQueue.length;


}

export function shouldSpawnNpc(currentTime) {
    nextSpawnDelay = 5000 + Math.random() * 5000;
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

        if (i === 0) {
            ctx.fillStyle = 'red';
            ctx.fillRect(customer.positionX, customer.positionY - 8, 30, 4);
            ctx.fillStyle = customer.patience > 10 ? 'green' : 'orange';
            ctx.fillRect(customer.positionX, customer.positionY - 8, 30 * (customer.patience / 25), 4);
        }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(10, 10, 120, 25);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Queue: ${npcQueue.length}`, 15, 27);
}

