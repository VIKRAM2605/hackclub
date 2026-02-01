import { gameRunning } from "./GameMechanics.js";
import { objectCoordinates } from "./ObjectCoordinates.js";
import { drawSprite, drawSpriteFromSlotToMainCanvs, sprites, spriteSheet } from "./SceneCreation.js";
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

const inventorySprite = new Image();
inventorySprite.src = 'assets/Inventory.png';

const lockSprite = new Image();
lockSprite.src = 'assets/lock-Photoroom.png';

const timerSprite = new Image();
timerSprite.src = 'assets/sand-glass1-Photoroom.png';

const timerFrames = {
    completed: { x: 139, y: 161, w: 51, h: 66 },
    ongoing: [
        { x: 43, y: 32, w: 50, h: 67 },
        { x: 139, y: 32, w: 51, h: 67 },
        { x: 235, y: 32, w: 51, h: 67 },
        { x: 332, y: 32, w: 50, h: 67 },
        { x: 43, y: 161, w: 50, h: 66 },
        { x: 139, y: 161, w: 51, h: 66 },
        { x: 223, y: 153, w: 51, h: 66 },
        { x: 320, y: 153, w: 51, h: 66 },
    ]
};

const grillSlotPositions = [
    { x: 14, y: 8 },
    { x: 28, y: 8 },
    { x: 14, y: 17 },
    { x: 28, y: 17 }
]
const stoveSlotPositions = [
    { x: 13, y: 3 },
    { x: 25, y: 3 },
    { x: 13, y: 12 },
    { x: 25, y: 12 }
]

const intaractableGrillPositionsForPatty = [
    { col: -0.19, row: -0.32 },
    { col: 0.24, row: -0.32 },
    { col: -0.19, row: -0.08 },
    { col: 0.24, row: -0.08 }
];
const intaractableGrillPositionsForHotDog = [
    { col: -0.19, row: -0.32 },
    { col: 0.24, row: -0.32 },
    { col: -0.19, row: -0.08 },
    { col: 0.24, row: -0.08 }
];

const intaractableStovePositionsForSoup = [
    { col: -0.141, row: -0.50 },
    { col: 0.24, row: -0.50 },
    { col: -0.141, row: -0.20 },
    { col: 0.24, row: -0.20 }
];

export const cookedFoodCount = {
    cookedPatty: 0,
    cookedHotDog: 0,
    cookedSoup: 0,
};

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
        if (objectId) {
            canvasMainSprite.dataset.objectId = objectId;
        }
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
        const closeH = 30;

        const dpr = window.devicePixelRatio || 1;
        closeCanvas.width = closeW * dpr;
        closeCanvas.height = closeH * dpr;
        closeCanvas.style.width = `${closeW}px`;
        closeCanvas.style.height = `${closeH}px`;
        closeCanvas.style.cursor = "pointer";

        const x = rect.width - 26;

        closectx.drawImage(
            bgSprite,
            64, 160, 26, 16,
            x, 0, 28, 22
        )

        closeCanvas.addEventListener('click', () => {
            modal.remove();
        })

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') modal.remove();
        });
    }
    else if (templateName == 'grillLevel11' || templateName == 'grillLevel12' || templateName == 'gasStove1') {
        const grillModal = document.getElementById('grill-modal');
        const closeHitbox = document.getElementById('close-hitbox');

        Object.assign(grillModal.style, {
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

        let isReady = false;

        setTimeout(() => {
            isReady = true;
        }, 200);

        const handleEscape = (e) => {
            if (e.key === 'Escape' && isReady) {
                modal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };

        closeHitbox.addEventListener('click', (e) => {
            if (!isReady) {
                return;
            }

            console.log('Closing modal');
            e.stopPropagation();
            e.preventDefault();
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        });

        document.addEventListener('keydown', handleEscape);

        closeHitbox.addEventListener('mouseleave', () => {
            closeHitbox.style.background = 'transparent';
        });

        requestAnimationFrame(() => {
            const sourceW = 98;
            const sourceH = 101;
            const bgCanvas = document.getElementById('modal-bg-canvas');
            const bgctx = canvasSetupForCookingModal(bgCanvas, sourceW, sourceH);
            bgctx.drawImage(inventorySprite, 7, 0, sourceW, sourceH, 0, 0, sourceW, sourceH);

            const closeSourceW = 25;
            const closeSourceH = 16;
            const closeCanvas = document.getElementById('close-modal-canvas');
            const closectx = canvasSetupForCookingModal(closeCanvas, closeSourceW, closeSourceH);
            closectx.drawImage(inventorySprite, 144, 112, closeSourceW, closeSourceH, 0, 0, closeSourceW, closeSourceH);

            const objCanvas = document.getElementById('canvas-sprite');
            const objBaseW = 50;
            const objBaseH = 50;
            const objctx = canvasSetupForCookingModal(objCanvas, objBaseW, objBaseH);
            objctx.drawImage(inventorySprite, 177, 113, 14, 14, 0, 0, objBaseW, objBaseH);
            drawSpriteOnModal(templateName.slice(0, -1), objCanvas, objctx, objBaseW, objBaseH);

            const canvasCookedSprite = document.getElementById('cooked-canvas-sprite');
            const cookedSourceW = 14;
            const cookedSourceH = 14;
            const ctxCookedSprite = canvasSetupForCookingModal(canvasCookedSprite, cookedSourceW, cookedSourceH);
            ctxCookedSprite.drawImage(inventorySprite, 177, 113, cookedSourceW, cookedSourceH, 0, 0, cookedSourceW, cookedSourceH);
            let foodType;
            if (templateName == 'grillLevel11') {
                foodType = 'unCookedPatty';
            }
            else if (templateName == 'grillLevel12') {
                foodType = 'unCookedHotDog'
            }
            else if (templateName == 'gasStove1') {
                foodType = 'unCookedSoup'
            }
            drawSpriteOnModal(foodType, canvasCookedSprite, ctxCookedSprite, cookedSourceW, cookedSourceH);

            const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
            const slotSourceW = 14;
            const slotSourceH = 14;

            slots.forEach((slotId, index) => {
                const slotCanvas = document.getElementById(slotId);
                const slotctx = canvasSetupForCookingModal(slotCanvas, slotSourceW, slotSourceH);
                slotctx.drawImage(inventorySprite, 177, 113, slotSourceW, slotSourceH, 0, 0, slotSourceW, slotSourceH);

                if (slotCanvas) {
                    if (index >= unlockedSlots) {
                        drawLockedSlots(slotCanvas, slotSourceW, slotSourceH);
                    } else {
                        slotCanvas.style.cursor = 'default';
                    }
                }
            });

            refillSlotsToPreviousState(objectId, unlockedSlots, templateName, slotSourceW, slotSourceH);
            drawSpriteOnTopOfTheStation(objectId, templateName);

            canvasCookedSprite.style.cursor = 'pointer';
            canvasCookedSprite.addEventListener('click', () => {
                console.log('clicked cooked patty');
                addItemsToSlot(foodType, objectId, unlockedSlots, templateName);
            });
        });
    }

}

export function drawSpriteOnTopOfTheStation(objectId, templateName) {
    const canvas = document.getElementById('canvas-sprite');

    if (!canvas) return;

    const canvasObjectId = parseInt(canvas.dataset.objectId);
    if (canvasObjectId !== objectId) {
        console.log(`Skipping draw - canvas belongs to objectId ${canvasObjectId}, but trying to draw for objectId ${objectId}`);
        return;
    }

    const ctx = canvas.getContext('2d');


    const width = 50;
    const height = 50;

    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(
        inventorySprite,
        177, 113, 14, 14,
        0, 0, width, height
    );

    drawSpriteOnModal(templateName.slice(0, -1), canvas, ctx, width, height);

    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];

    if (State[objectId]) {
        slots.forEach((slotId, index) => {
            const slotData = State[objectId][slotId];

            if (slotData && slotData.spriteName && (slotData.status === 'cooking' || slotData.status === 'cooked')) {
                let sprite, pos, name, foodSize;

                if (slotData.status == 'cooked') {
                    name = slotData.spriteName.replace('unCooked', 'cooked');
                    sprite = sprites[name];
                } else {
                    name = slotData.spriteName
                    sprite = sprites[name];
                }

                if (templateName === 'gasStove1') {
                    pos = stoveSlotPositions[index];
                    foodSize = 12;
                } else {
                    pos = grillSlotPositions[index];
                    foodSize = 6;
                }


                if (sprite && pos) {

                    ctx.drawImage(
                        spriteSheet,
                        sprite.x, sprite.y, sprite.w, sprite.h,
                        pos.x, pos.y, foodSize, foodSize
                    );

                }
            }
        });
    }
}
export function drawCookingSpriteOnMainCanvas(objectId, templateName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    if (State[objectId]) {
        slots.forEach((slotId, index) => {
            const slotData = State[objectId][slotId];

            if (slotData && slotData.spriteName && (slotData.status === 'cooking' || slotData.status === 'cooked')) {
                let pos, stn, name, size = 6;

                if (slotData.status === 'cooked') {
                    name = slotData.spriteName.replace('unCooked', 'cooked');
                } else {
                    name = slotData.spriteName
                }

                if (templateName === 'grillLevel11') {
                    stn = objectCoordinates['grillLevel11'];
                    pos = intaractableGrillPositionsForPatty[index];
                }
                else if (templateName === 'grillLevel12') {
                    stn = objectCoordinates['grillLevel12'];
                    pos = intaractableGrillPositionsForHotDog[index];
                }
                else if (templateName === 'gasStove1') {
                    stn = objectCoordinates['gasStove1'];
                    pos = intaractableStovePositionsForSoup[index];
                    size = 12;
                }

                if (pos && stn) {

                    drawSpriteFromSlotToMainCanvs(name, pos.col + stn.col, pos.row + stn.row, size, size);
                }
            }
        });
    }
}

export function canvasSetupForCookingModal(canvas, width, height, scale = 5) {

    const dpr = window.devicePixelRatio || 1;

    const logicalW = width * scale;
    const logicalH = height * scale;

    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;

    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;

    ctx.scale(dpr, dpr);
    ctx.scale(scale, scale);

    return ctx;

};

export function drawSpriteOnModal(spriteName, canvas, ctx, width, height, from) {

    const sprite = sprites[spriteName];
    let spriteW, spriteH;
    if (from === 'npc') {
        spriteW = sprite.w + 20;
        spriteH = sprite.h + 20;
    } else {
        spriteW = sprite.w;
        spriteH = sprite.h;
    }

    ctx.drawImage(
        spriteSheet,
        sprite.x, sprite.y,
        sprite.w, sprite.h,
        (width / 2) - (spriteW / 2), (height / 2) - (spriteH / 2),
        spriteW, spriteH
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

        const slotSourceW = 14;
        const slotSourceH = 14;
        // Mark slot as occupied
        State[objectId][targetSlotId].spriteName = spriteName;
        State[objectId][targetSlotId].status = 'cooking';
        targetSlot.style.borderColor = '#4CAF50';

        State[objectId][targetSlotId].startTime = performance.now();
        State[objectId][targetSlotId].pausedElapsed = null;

        if (timerFrames && timerFrames.ongoing && timerFrames.ongoing.length > 0) {
            drawTimer(ctx, timerFrames.ongoing[0], slotSourceW, slotSourceH);
        }

        drawSpriteOnTopOfTheStation(objectId, templateName);

        targetSlot.onclick = () => {
            const status = State[objectId][targetSlotId].status;
            console.log(status);
            if (status === 'cooked') {
                console.log('picked up cooked food');

                const newCount = updateCookedFoodCount(State[objectId][targetSlotId].spriteName.replace('unCooked', 'cooked'));
                console.log('count:', newCount);

                if (State[objectId][targetSlotId].animationId) cancelAnimationFrame(State[objectId][targetSlotId].animationId);

                ctx.clearRect(0, 0, slotSourceW, slotSourceH);

                ctx.drawImage(
                    inventorySprite,
                    177, 113, slotSourceW, slotSourceH,
                    0, 0, slotSourceW, slotSourceH
                );

                State[objectId][targetSlotId].status = "empty";
                State[objectId][targetSlotId].spriteName = null;
                State[objectId][targetSlotId].startTime = null;
                State[objectId][targetSlotId].pauseStartTime = null;

                targetSlot.style.outline = 'none';

                drawSpriteOnTopOfTheStation(objectId, templateName);

            } else if (status === 'cooking') {
                console.log('removed uncooked food');

                if (State[objectId][targetSlotId].animationId) cancelAnimationFrame(State[objectId][targetSlotId].animationId);

                ctx.clearRect(0, 0, slotSourceW, slotSourceH);

                ctx.drawImage(
                    inventorySprite,
                    177, 113, slotSourceW, slotSourceH,
                    0, 0, slotSourceW, slotSourceH
                )
                State[objectId][targetSlotId].status = "empty";
                State[objectId][targetSlotId].spriteName = null;
                State[objectId][targetSlotId].startTime = null;
                State[objectId][targetSlotId].pauseStartTime = null;

                targetSlot.style.outline = 'none';

                drawSpriteOnTopOfTheStation(objectId, templateName);

            }
        };

        State[objectId][targetSlotId].animationId = requestAnimationFrame((currentTime) =>
            animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, slotSourceW, slotSourceH)
        );
    } else {
        console.log('No empty slots available!');
    }
}

export function animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, width, height) {

    const slotData = State[objectId][targetSlotId];

    if (!gameRunning) {

        if (!slotData.pauseStartTime) {
            slotData.pauseStartTime = currentTime;
        }

        slotData.animationId = requestAnimationFrame((time) =>
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, width, height)
        );
        return;
    }

    if (slotData.pauseStartTime) {
        const durationPaused = currentTime - slotData.pauseStartTime;
        slotData.startTime += durationPaused;
        slotData.pauseStartTime = null;
    }

    const totalCookingTime = objectCoordinates[templateName].cookingTime;

    const startTime = State[objectId][targetSlotId].startTime;

    const timeInMs = currentTime - startTime;

    const elapsedSeconds = Math.floor(timeInMs / 1000);

    const timeLeft = Math.max(0, totalCookingTime - elapsedSeconds);

    // Clear and redraw
    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(
        inventorySprite,
        177, 113, width, height,
        0, 0, width, height
    )

    let displaySpriteName = spriteName;
    if (slotData.status === 'cooked') {
        displaySpriteName = spriteName.replace('unCooked', 'cooked');
    }

    drawSpriteOnModal(displaySpriteName, targetSlot, ctx, width, height);

    if (timeLeft > 0) {

        const frameDuration = 125;

        const totalFrames = timerFrames.ongoing.length;

        const frameIndex = Math.floor(timeInMs / frameDuration) % totalFrames;

        if (timerFrames.ongoing[frameIndex]) {
            drawTimer(ctx, timerFrames.ongoing[frameIndex], width, height);
        }

        State[objectId][targetSlotId].animationId = requestAnimationFrame((time) =>
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId, templateName, width, height)
        );
    } else {
        console.log("cooked food");
        // clear and reset for next item
        State[objectId][targetSlotId].animationId = null;
        State[objectId][targetSlotId].status = 'cooked';

        drawSpriteOnModal(spriteName.replace('unCooked', 'cooked'), targetSlot, ctx, width, height);

        drawSpriteOnTopOfTheStation(objectId, templateName);

        targetSlot.style.outline = '2px solid lime';
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


export function refillSlotsToPreviousState(objectId, unlockedSlots, templateName, width, height) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    State[objectId] ??= {};
    for (let i = 0; i < slots.length; i++) {
        if (i >= unlockedSlots) {
            continue;
        }
        let slotId = slots[i];
        const slotCanvas = document.querySelector(`#${slotId}`);
        if (slotCanvas && State[objectId][slotId]) {
            redrawSlot(slotId, objectId, slotCanvas, templateName, width, height);
        }
    }
};

export function redrawSlot(slotId, objectId, slotCanvas, templateName, width, height) {
    const slotData = State[objectId][slotId];
    const ctx = slotCanvas.getContext('2d');
    const totalCookingTime = objectCoordinates[templateName].cookingTime;

    slotData.pauseStartTime ??= 0;

    slotCanvas.onclick = () => {
        const status = State[objectId][slotId].status;
        if (status === 'cooked') {
            console.log('picked up cooked food');

            const newCount = updateCookedFoodCount(slotData.spriteName.replace('unCooked', 'cooked'));
            console.log('cookedPatty count:', newCount, slotData.spriteName);

            if (slotData.animationId) cancelAnimationFrame(slotData.animationId);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(
                inventorySprite,
                177, 113, width, height,
                0, 0, width, height
            )
            slotData.status = "empty";
            slotData.spriteName = null;
            slotData.startTime = null;
            slotData.pauseStartTime = null;

            slotCanvas.style.outline = 'none';

            drawSpriteOnTopOfTheStation(objectId, templateName);

        } else if (status === 'cooking') {
            console.log('removed uncooked food');

            if (slotData.animationId) cancelAnimationFrame(slotData.animationId);

            ctx.clearRect(0, 0, width, height);

            ctx.drawImage(
                inventorySprite,
                177, 113, width, height,
                0, 0, width, height
            )

            slotData.status = "empty";
            slotData.spriteName = null;
            slotData.startTime = null;
            slotData.pauseStartTime = null;

            slotCanvas.style.outline = 'none';

            drawSpriteOnTopOfTheStation(objectId, templateName);

        }
    };


    if (slotData.status === 'cooking' && slotData.startTime) {

        const now = performance.now();

        const effectiveNow = slotData.pauseStartTime || now;

        const timeInMs = effectiveNow - slotData.startTime;
        const elapsedSeconds = Math.floor(timeInMs / 1000);
        const timeLeft = Math.max(0, totalCookingTime - elapsedSeconds);

        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(
            inventorySprite,
            177, 113, width, height,
            0, 0, width, height
        );

        drawSpriteOnModal(slotData.spriteName, slotCanvas, ctx, width, height);

        if (timeLeft > 0) {

            const frameDuration = 125;
            const totalFrames = timerFrames.ongoing.length;
            const frameIndex = Math.floor(timeInMs / frameDuration) % totalFrames;

            if (timerFrames.ongoing[frameIndex]) {
                drawTimer(ctx, timerFrames.ongoing[frameIndex], width, height);
            }

            slotData.animationId = requestAnimationFrame((currentTime) =>
                animateTimer(currentTime, slotData.spriteName, ctx, slotCanvas, objectId, slotId, templateName, width, height)
            );
        } else {
            slotData.status = 'cooked';
            slotData.spriteName.replace('unCooked', 'cooked')

            drawSpriteOnTopOfTheStation(objectId, templateName);

            slotCanvas.style.outline = '2px solid lime';
        }
    } else if (slotData.status === 'cooked') {
        drawSpriteOnModal(slotData.spriteName.replace('unCooked', 'cooked'), slotCanvas, ctx, width, height);

        drawSpriteOnTopOfTheStation(objectId, templateName);

        slotCanvas.style.outline = '2px solid lime';
    }
}

export function drawLockedSlots(slotCanvas, width, height) {
    const ctx = slotCanvas.getContext('2d');

    ctx.drawImage(
        lockSprite,
        83, 61, 90, 128,
        (width / 2) - (6 / 2), (height / 2) - (6 / 2), 6, 6
    )
    slotCanvas.style.cursor = 'not-allowed';

    slotCanvas.onclick = null;
}

export function drawTimer(ctx, frame, width, height) {

    const timerW = 8;
    const timerH = 10;

    ctx.drawImage(
        timerSprite,
        frame.x, frame.y, frame.w, frame.h,
        (width / 2) - (timerW / 2), (height / 2) - (timerH / 2), timerW, timerH
    )
};