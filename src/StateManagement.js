import { objectCoordinates } from "./ObjectCoordinates.js";
import { sprites } from "./SceneCreation.js";
import { attemptUpgrade, getNextUpgradeForObject, upgrades } from "./ShopStateManagement.js";
import { getBalance } from "./Wallet.js";

export const State = {

};

// export const hotDog = {};

export const cookedFoodCount = {
    cookedPatty: 0,
    cookedHotDog: 0
};



const spriteSheet = new Image();
spriteSheet.src = "assets/professional_kitchen_withshadows.png";

function toTitleCase(str) {
  return str.toLowerCase().split(' ')
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

//creating the modal with the template
export function createModal(templateName, template, canvas, ctx, player, objectId, unlockedSlots) {
    //console.log(template);
    if (document.getElementById("main-modal")) {
        return;
    }
    const modal = document.createElement('div');
    modal.id = "main-modal";
    modal.innerHTML = template;
    //console.log(modal);
    document.getElementById('game-container').appendChild(modal);
    const canvasMainSprite = document.getElementById('canvas-sprite');
    if (canvasMainSprite) {
        const ctxMainSprite = canvasMainSprite.getContext('2d');
        drawSpriteOnModal(templateName.slice(0,-1), canvasMainSprite, ctxMainSprite);
    }

    if (templateName == 'shop') {
        const moneyDisplay = document.getElementById('display-money');

        const shopContainer = document.getElementById('shop-items-container');

        const updateshopUi = () => {
            moneyDisplay.innerText = getBalance().toFixed(2);
            shopContainer.innerHTML = '';
            for (let objName in objectCoordinates) {
                const obj = objectCoordinates[objName];
                //console.log(objName, obj);
                if (obj.unlockedSlots && obj.unlockedSlots < 4) {
                    const nextLevel = obj.unlockedSlots + 1;
                    const cost = getNextUpgradeForObject(objName);
                    const slotCard = document.createElement("div");
                    slotCard.id = objName;
                    slotCard.className = "shop-card";
                    slotCard.style.cssText = "border: 1px solid #555; margin: 10px; padding: 10px; background: #333; display: flex; justify-content: space-between; align-items: center;";
                    slotCard.innerHTML = `
                        <div>
                            <h3 style="margin:0; color:#fff">${toTitleCase(obj.name.trim())}</h3>
                            <p style="margin:5px 0; color:#aaa">Level: ${obj.unlockedSlots} → ${nextLevel}</p>
                            <p style="margin:0; color:#4CAF50; font-weight:bold">Price: $${cost}</p>
                        </div>
                        <button id="buy-${objName}" class="buy-btn" style="padding: 8px 16px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px;"> 
                            Buy 
                        </button>
                `
                    shopContainer.appendChild(slotCard);
                    const buyBtn = document.getElementById(`buy-${objName}`);
                    buyBtn.onclick = () => {
                        const result = attemptUpgrade(objName);
                        if (result.success) {
                            console.log("Upgraded!");
                            updateshopUi();
                        } else {
                            console.log(result.msg);
                            buyBtn.innerText = "No Cash";
                            setTimeout(() => buyBtn.innerText = "Buy", 1000);
                        }
                    };
                };


            }
        }
        updateshopUi();

    }
    else if (templateName == 'grillLevel11') {
        const canvasCookedSprite = document.getElementById('cooked-canvas-sprite');

        // canvasCookedSprite.dataset.id=objectId;
        // console.log(canvasCookedSprite.dataset.id);

        const ctxCookedSprite = canvasCookedSprite.getContext('2d');

        drawSpriteOnModal('cookedPatty', canvasCookedSprite, ctxCookedSprite);

        const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
        slots.forEach((slotId, index) => {
            const slotCanvas = document.getElementById(slotId);
            if (slotCanvas) {
                if (index >= unlockedSlots) {
                    drawLockedSlots(slotCanvas);
                } else {
                    slotCanvas.style.cursor = 'default';
                }
            }
        })


        refillSlotsToPreviousState(objectId, unlockedSlots,templateName);
        canvasCookedSprite.style.cursor = 'pointer';

        canvasCookedSprite.addEventListener('click', () => {
            console.log('clicked cooked patty');
            addItemsToSlot('cookedPatty', objectId, unlockedSlots,templateName);
        })

    }

    const closeBtn = document.getElementById('close-modal');

    closeBtn.addEventListener('click', () => {
        modal.remove();
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.remove();
    });
}


export function drawSpriteOnModal(spriteName, canvas, ctx) {

    const sprite = sprites[spriteName];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y,
        sprite.w, sprite.h,
        0, 0,
        sprite.sw * 3, sprite.sh
    );

}

export function addItemsToSlot(spriteName, objectId, unlockedSlots,templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    let targetSlot = null;
    let targetSlotId = null;

    State[objectId] ??= {};

    for (let i = 0; i < slots.length; i++) {
        if (i >= unlockedSlots) {
            continue;
        }
        let slotId = slots[i];
        const slotCanvas = document.querySelector(`#${slotId}`);
        if (slotCanvas && (!State[objectId][slotId] || State[objectId][slotId].status === 'empty')) {
            targetSlot = slotCanvas;
            targetSlotId = slotId;
            break;
        }
    }

    if (targetSlot && targetSlotId) {

        State[objectId][targetSlotId] ??= {};

        const ctx = targetSlot.getContext('2d');

        if (State[objectId][targetSlotId].animationId) {
            cancelAnimationFrame(State[objectId][targetSlotId].animationId);
            State[objectId][targetSlotId].animationId = null;
        }


        ctx.clearRect(0, 0, targetSlot.width, targetSlot.height);
        // Mark slot as occupied
        State[objectId][targetSlotId].spriteName = spriteName;
        State[objectId][targetSlotId].status = 'cooking';
        targetSlot.style.borderColor = '#4CAF50';

        State[objectId][targetSlotId].startTime = performance.now();

        targetSlot.onclick = () => {
            const status = State[objectId][targetSlotId].status;
            console.log(status);
            if (status === 'cooked') {
                console.log('picked up cooked food');


                const newCount = updateCookedFoodCount(State[objectId][targetSlotId].spriteName);
                console.log('cookedPatty count:', newCount);

                if (State[objectId][targetSlotId].animationId) cancelAnimationFrame(State[objectId][targetSlotId].animationId);
                ctx.clearRect(0, 0, targetSlot.width, targetSlot.height);
                State[objectId][targetSlotId].status = "empty";
                State[objectId][targetSlotId].spriteName = null;
                State[objectId][targetSlotId].startTime = null;

            } else if (status === 'cooking') {
                console.log('removed uncooked food');

                if (State[objectId][targetSlotId].animationId) cancelAnimationFrame(State[objectId][targetSlotId].animationId);

                ctx.clearRect(0, 0, targetSlot.width, targetSlot.height);
                State[objectId][targetSlotId].status = "empty";
                State[objectId][targetSlotId].spriteName = null;
                State[objectId][targetSlotId].startTime = null;
            }
        };

        State[objectId][targetSlotId].animationId = requestAnimationFrame((currentTime) =>
            animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId,templateName)
        );
    } else {
        console.log('No empty slots available!');
    }
}

export function animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId,templateName) {
    const elapsed = Math.floor((currentTime - State[objectId][targetSlotId].startTime) / 1000);
    const timeLeft = Math.max(0, objectCoordinates[templateName].cookingTime - elapsed);

    // Clear and redraw
    ctx.clearRect(0, 0, targetSlot.width, targetSlot.height);
    drawSpriteOnModal(spriteName, targetSlot, ctx);

    // Draw countdown timer
    ctx.save();
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${timeLeft}s`, targetSlot.width / 2, targetSlot.height / 2);
    ctx.restore();

    if (timeLeft > 0) {
        State[objectId][targetSlotId].animationId = requestAnimationFrame((time) =>
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId,templateName)
        );
    } else {
        console.log("cooked food");
        // clear and reset for next item
        State[objectId][targetSlotId].animationId = null;
        State[objectId][targetSlotId].status = 'cooked';
        targetSlot.style.borderColor = '';

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, targetSlot.height - 20, targetSlot.width, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cooked', targetSlot.width / 2, targetSlot.height - 6);
    }
}

export function updateCookedFoodCount(foodName) {
    if (!foodName) return;
    if (!Object.prototype.hasOwnProperty.call(cookedFoodCount, foodName)) {
        console.warn('updateCookedFoodCount: unknown key', foodName);
        return;
    }
    cookedFoodCount[foodName] += 1;
    return cookedFoodCount[foodName];
}


export function refillSlotsToPreviousState(objectId, unlockedSlots,templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    State[objectId] ??= {};
    for (let i = 0; i < slots.length; i++) {
        if (i >= unlockedSlots) {
            continue;
        }
        let slotId = slots[i];
        const slotCanvas = document.querySelector(`#${slotId}`);
        if (slotCanvas && State[objectId][slotId]) {
            redrawSlot(slotId, objectId, slotCanvas,templateName);
        }
    }
};

export function redrawSlot(slotId, objectId, slotCanvas,templateName) {
    const slotData = State[objectId][slotId];
    const ctx = slotCanvas.getContext('2d');

    slotCanvas.onclick = () => {
        const status = State[objectId][slotId].status;
        console.log(status);
        if (status === 'cooked') {
            console.log('picked up cooked food');


            const newCount = updateCookedFoodCount(slotData.spriteName);
            console.log('cookedPatty count:', newCount);

            if (slotData.animationId) cancelAnimationFrame(slotData.animationId);
            ctx.clearRect(0, 0, slotCanvas.width, slotCanvas.height);
            slotData.status = "empty";
            slotData.spriteName = null;
            slotData.startTime = null;

        } else if (status === 'cooking') {
            console.log('removed uncooked food');

            if (slotData.animationId) cancelAnimationFrame(slotData.animationId);

            ctx.clearRect(0, 0, slotCanvas.width, slotCanvas.height);
            slotData.status = "empty";
            slotData.spriteName = null;
            slotData.startTime = null;
        }
    };


    if (slotData.status === 'cooking' && slotData.startTime) {

        const now = performance.now();
        const elapsed = Math.floor((now - slotData.startTime) / 1000);
        const timeLeft = Math.max(0, objectCoordinates[templateName].cookingTime - elapsed);

        ctx.clearRect(0, 0, slotCanvas.width, slotCanvas.height);
        drawSpriteOnModal(slotData.spriteName, slotCanvas, ctx);

        ctx.save();
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${timeLeft}s`, slotCanvas.width / 2, slotCanvas.height / 2);
        ctx.restore();

        if (timeLeft > 0) {
            slotData.animationId = requestAnimationFrame((currentTime) =>
                animateTimer(currentTime, slotData.spriteName, ctx, slotCanvas, objectId, slotId,templateName)
            );
        }
    } else if (slotData.status === 'cooked') {
        ctx.clearRect(0, 0, slotCanvas.width, slotCanvas.height);
        drawSpriteOnModal(slotData.spriteName, slotCanvas, ctx);

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, slotCanvas.height - 20, slotCanvas.width, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cooked', slotCanvas.width / 2, slotCanvas.height - 6);

        slotCanvas.style.borderColor = '';
    }
}

export function drawLockedSlots(slotCanvas) {
    const ctx = slotCanvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, slotCanvas.width, slotCanvas.height);

    ctx.fillStyle = "#888";
    ctx.font = "30px Arial";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Locked', slotCanvas.width / 2, slotCanvas.height / 2);
    slotCanvas.style.border = '2px solid #333';
    slotCanvas.style.cursor = 'not-allowed';

    slotCanvas.onclick = null;
}