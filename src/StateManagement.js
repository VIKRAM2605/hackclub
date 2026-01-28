import { objectCoordinates } from "./ObjectCoordinates.js";
import { sprites } from "./SceneCreation.js";
import { attemptSkillUpgrade, attemptUpgrade, getNextUpgradeForObject, getNextUpgradeForSkills, skillNameForUpgrades, skillSpriteForUpgrades, skillUpgrades, upgrades } from "./ShopStateManagement.js";
import { getBalance } from "./Wallet.js";

export const State = {

};
const bgSprite = new Image();
bgSprite.src = 'assets/Shop.png';

const ribbonSprite = new Image();
ribbonSprite.src = 'assets/ribbon-banners-Photoroom.png';

const settingsSprite = new Image();
settingsSprite.src = 'assets/Settings.png';

export const cookedFoodCount = {
    cookedPatty: 0,
    cookedHotDog: 0
};

const spriteSheet = new Image();
spriteSheet.src = "assets/professional_kitchen_withshadows.png";

export function toTitleCase(str) {
    return str.toLowerCase().split(' ')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

export function setupCanvas(canvas, sourceW, sourceH) {

    const dpr = window.devicePixelRatio || 1;
    const scale = 4;

    const logicalW = sourceW * scale;
    const logicalH = sourceH * scale;

    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`

    const ctx = canvas.getContext('2d');

    ctx.scale(dpr, dpr);

    ctx.scale(scale, scale);

    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;


    return ctx;
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
        drawSpriteOnModal(templateName.slice(0, -1), canvasMainSprite, ctxMainSprite);
    }

    if (templateName == 'shop') {

        const shopModal = document.getElementById('shop-modal');

        Object.assign(shopModal.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '1000',
            cursor: 'default'
        });

        const shopCanvas = document.getElementById('shop-bg-canvas');

        const rect = shopCanvas.getBoundingClientRect();

        if (shopCanvas) {

            const sourceW = 98;
            const sourceH = 149;

            const shopctx = setupCanvas(shopCanvas, sourceW, sourceH);

            shopctx.drawImage(
                settingsSprite,
                7, 0, sourceW, sourceH,
                0, 0, sourceW, sourceH
            )
        }
        const moneyDisplay = document.getElementById('display-money');

        const shopContainer = document.getElementById('shop-items-container');

        const updateshopUi = () => {
            moneyDisplay.innerText = getBalance().toFixed(2);
            shopContainer.innerHTML = '';
            
            for (let objName in objectCoordinates) {
                const obj = objectCoordinates[objName];
                
                if (obj.unlockedSlots && obj.unlockedSlots < 4) {

                    const nextLevel = obj.unlockedSlots + 1;
                    const cost = getNextUpgradeForObject(objName);

                    const slotCard = document.createElement("div");
                    slotCard.id = objName;
                    slotCard.className = "shop-card";
                    slotCard.style.display = "flex";
                    slotCard.style.flexDirection = "column";
                    slotCard.style.gap = "5px";
                    slotCard.style.margin = "10px";
                    slotCard.style.alignItems = 'center';

                    const cardBaseSize = 50; 
                    
                    const cardCanvas = document.createElement("canvas");
                    cardCanvas.id = `object-canvas-${objName}`;
                    
                    const objctx = setupCanvas(cardCanvas, cardBaseSize, cardBaseSize);

                    const btnWidth = 50;
                    const btnHeight = 18;

                    const buyCanvas = document.createElement("canvas");
                    buyCanvas.id = `buy-canvas-${objName}`;
                    
                    const buyctx = setupCanvas(buyCanvas, btnWidth, btnHeight);

                    buyCanvas.style.marginTop = "2px";
                    buyCanvas.style.cursor = "pointer";

                    slotCard.appendChild(cardCanvas);
                    slotCard.appendChild(buyCanvas);
                    shopContainer.appendChild(slotCard);

                    
                    objctx.drawImage(
                        bgSprite,
                        357, 161, 21, 21, 
                        0, 0, cardBaseSize, cardBaseSize
                    );

                    const sprite = sprites[objName.slice(0, -1)];
                    objctx.drawImage(
                        spriteSheet,
                        sprite.x, sprite.y, sprite.w, sprite.h,
                        (cardBaseSize / 2) - (sprite.w / 2), (cardBaseSize / 2) - (sprite.h / 2), 
                        sprite.w, sprite.h
                    );

                    objctx.drawImage(
                        ribbonSprite,
                        34, 102, 156, 44,
                        0, -3, 50, 15
                    );

                    objctx.fillStyle = "black";
                    objctx.textAlign = "center";
                    objctx.textBaseline = "middle";
                    objctx.font = "bold 5px 'Pixelify Sans', sans-serif";
                    objctx.fillText(toTitleCase(obj.name), cardBaseSize / 2, 3);


                    buyctx.drawImage(
                        bgSprite,
                        99, 186, 26, 14,
                        0, 0, btnWidth, btnHeight
                    );

                    buyctx.fillStyle = "white";
                    buyctx.textAlign = "center";
                    buyctx.font = "6px 'Pixelify Sans', sans-serif";
                    
                    buyctx.fillText(`Lvl ${nextLevel}`, btnWidth / 2, 7);

                    const playerMoney = getBalance();
                    const canAfford = playerMoney >= cost;
                    buyctx.fillStyle = canAfford ? "#90ee90" : "#ff4444";
                    buyctx.font = "bold 6px 'Pixelify Sans', sans-serif";
                    buyctx.fillText(`$${cost}`, btnWidth / 2, 14);

                    buyCanvas.addEventListener('click', () => {
                        const result = attemptUpgrade(objName);
                        if (result.success) {
                            console.log("Upgraded!");
                            updateshopUi();
                        } else {
                            console.log(result.msg);
                        }
                    });
                };
            }

            for (let skillName in skillUpgrades) {
                if (skillName === "buyAHeart") continue;
                
                const currentSkillLvl = player[skillName];
                if (currentSkillLvl && currentSkillLvl < 4) {
                    const nextSkillLvl = currentSkillLvl + 1;
                    const cost = getNextUpgradeForSkills(skillName);
                    
                    const slotCard = document.createElement("div");
                    slotCard.id = skillName;
                    slotCard.className = "shop-card";
                    slotCard.style.display = "flex";
                    slotCard.style.flexDirection = "column";
                    slotCard.style.gap = "5px";
                    slotCard.style.margin = "10px";
                    slotCard.style.alignItems = 'center';

                    const cardBaseSize = 50;

                    const cardCanvas = document.createElement("canvas");
                    cardCanvas.id = `object-canvas-${skillName}`;
                    
                    const objctx = setupCanvas(cardCanvas, cardBaseSize, cardBaseSize);

                    const btnWidth = 50;
                    const btnHeight = 18;

                    const buyCanvas = document.createElement("canvas");
                    buyCanvas.id = `buy-canvas-${skillName}`;
                    
                    const buyctx = setupCanvas(buyCanvas, btnWidth, btnHeight);

                    buyCanvas.style.marginTop = "2px";
                    buyCanvas.style.cursor = "pointer";

                    slotCard.appendChild(cardCanvas);
                    slotCard.appendChild(buyCanvas);
                    shopContainer.appendChild(slotCard);

                    objctx.drawImage(
                        bgSprite,
                        357, 161, 21, 21,
                        0, 0, cardBaseSize, cardBaseSize
                    );
                    
                    const sprite = skillSpriteForUpgrades[skillName];
                    objctx.drawImage(
                        sprite.img,
                        sprite.x, sprite.y, sprite.w, sprite.h,
                        (cardBaseSize / 2) - (sprite.sw / 2), (cardBaseSize / 2) - (sprite.sh / 2), 
                        sprite.sw, sprite.sh
                    );

                    objctx.drawImage(
                        ribbonSprite,
                        34, 102, 156, 44,
                        0, -3, 50, 15
                    );

                    objctx.fillStyle = "black";
                    objctx.textAlign = "center";
                    objctx.textBaseline = "middle";
                    objctx.font = "bold 5px 'Pixelify Sans', sans-serif";
                    objctx.fillText(toTitleCase(skillNameForUpgrades[skillName]), 25, 3);

                    buyctx.drawImage(
                        bgSprite,
                        99, 186, 26, 14,
                        0, 0, btnWidth, btnHeight
                    );

                    buyctx.fillStyle = "white";
                    buyctx.textAlign = "center";
                    buyctx.font = "6px 'Pixelify Sans', sans-serif";
                    buyctx.fillText(`Lvl ${nextSkillLvl}`, btnWidth / 2, 7);

                    const playerMoney = getBalance();
                    const canAfford = playerMoney >= cost;
                    buyctx.fillStyle = canAfford ? "#90ee90" : "#ff4444";
                    buyctx.font = "bold 6px 'Pixelify Sans', sans-serif";
                    buyctx.fillText(`$${cost}`, btnWidth / 2, 14);

                    buyCanvas.addEventListener('click', () => {
                        const result = attemptSkillUpgrade(skillName);
                        if (result.success) {
                            console.log("Upgraded!");
                            updateshopUi();
                        } else {
                            console.log(result.msg);
                        }
                    });
                }
            }
        }
        updateshopUi();

        const closeCanvas = document.getElementById('close-modal');

        const closectx = closeCanvas.getContext('2d');

        const closeW = 35;
        const closeH = 20;

        const dpr = window.devicePixelRatio || 1;
        closeCanvas.width = closeW * dpr;
        closeCanvas.height = closeH * dpr;
        closeCanvas.style.width = `${closeW}px`;
        closeCanvas.style.height = `${closeH}px`;
        closeCanvas.style.cursor = "pointer";

        const spriteW = 26;
        const x = rect.width - 26;

        closectx.drawImage(
            bgSprite,
            64, 160, 26, 16,
            x, 0, 26, 16
        )

        closeCanvas.addEventListener('click', () => {
            modal.remove();
        })

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.remove();
        });
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


        refillSlotsToPreviousState(objectId, unlockedSlots, templateName);
        canvasCookedSprite.style.cursor = 'pointer';

        canvasCookedSprite.addEventListener('click', () => {
            console.log('clicked cooked patty');
            addItemsToSlot('cookedPatty', objectId, unlockedSlots, templateName);
        })

    }

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

export function addItemsToSlot(spriteName, objectId, unlockedSlots, templateName) {
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
            animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName)
        );
    } else {
        console.log('No empty slots available!');
    }
}

export function animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName) {
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
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName)
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


export function refillSlotsToPreviousState(objectId, unlockedSlots, templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    State[objectId] ??= {};
    for (let i = 0; i < slots.length; i++) {
        if (i >= unlockedSlots) {
            continue;
        }
        let slotId = slots[i];
        const slotCanvas = document.querySelector(`#${slotId}`);
        if (slotCanvas && State[objectId][slotId]) {
            redrawSlot(slotId, objectId, slotCanvas, templateName);
        }
    }
};

export function redrawSlot(slotId, objectId, slotCanvas, templateName) {
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
                animateTimer(currentTime, slotData.spriteName, ctx, slotCanvas, objectId, slotId, templateName)
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