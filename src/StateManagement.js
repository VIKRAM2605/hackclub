import { sprites } from "./SceneCreation.js";

export const State = {

};

// export const hotDog = {};

export const cookedFoodCount = {
    cookedPatty: 0,
    cookedHotDog: 0
};



const spriteSheet = new Image();
spriteSheet.src = "assets/professional_kitchen_withshadows.png";

//creating the modal with the template
export function createModal(templateName, template, canvas, ctx, player, objectId) {
    console.log(template);

    const modal = document.createElement('div');
    modal.id = "main-modal";
    modal.innerHTML = template;
    console.log(modal);
    document.getElementById('game-container').appendChild(modal);
    const canvasMainSprite = document.getElementById('canvas-sprite');
    const ctxMainSprite = canvasMainSprite.getContext('2d');

    drawSpriteOnModal(templateName, canvasMainSprite, ctxMainSprite);

    if (templateName == 'grillLevel1') {
        const canvasCookedSprite = document.getElementById('cooked-canvas-sprite');

        // canvasCookedSprite.dataset.id=objectId;
        // console.log(canvasCookedSprite.dataset.id);

        const ctxCookedSprite = canvasCookedSprite.getContext('2d');

        drawSpriteOnModal('cookedPatty', canvasCookedSprite, ctxCookedSprite);

        refillSlotsToPreviousState(objectId);
        canvasCookedSprite.style.cursor = 'pointer';

        canvasCookedSprite.addEventListener('click', () => {
            console.log('clicked cooked patty');
            addItemsToSlot('cookedPatty', objectId);
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

export function addItemsToSlot(spriteName, objectId) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    let targetSlot = null;
    let targetSlotId = null;

    State[objectId] ??= {};

    for (let slotId of slots) {
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
            animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId)
        );
    } else {
        console.log('No empty slots available!');
    }
}

export function animateTimer(currentTime, spriteName, ctx, targetSlot, objectId, targetSlotId) {
    const elapsed = Math.floor((currentTime - State[objectId][targetSlotId].startTime) / 1000);
    const timeLeft = Math.max(0, 10 - elapsed);

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
            animateTimer(time, spriteName, ctx, targetSlot, objectId, targetSlotId)
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


export function refillSlotsToPreviousState(objectId) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    State[objectId] ??= {};
    for (let slotId of slots) {
        const slotCanvas = document.querySelector(`#${slotId}`);
        if (slotCanvas && State[objectId][slotId]) {
            redrawSlot(slotId, objectId, slotCanvas);
        }
    }
};

export function redrawSlot(slotId, objectId, slotCanvas) {
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
        const timeLeft = Math.max(0, 10 - elapsed);

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
                animateTimer(currentTime, slotData.spriteName, ctx, slotCanvas, objectId, slotId)
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