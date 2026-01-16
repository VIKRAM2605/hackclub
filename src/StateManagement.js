import { sprites } from "./SceneCreation.js";

export const grill = {};

export const hotDog = {};


const spriteSheet = new Image();
spriteSheet.src = "assets/professional_kitchen_withshadows.png";

//creating the modal with the template
export function createModal(templateName, template, canvas, ctx, player) {
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
        const ctxCookedSprite = canvasCookedSprite.getContext('2d');

        drawSpriteOnModal('cookedPatty', canvasCookedSprite, ctxCookedSprite);

        canvasCookedSprite.style.cursor = 'pointer';

        canvasCookedSprite.addEventListener('click', () => {
            console.log('clicked cooked patty');
            addItemsToSlot('cookedPatty');
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

export function addItemsToSlot(spriteName) {
    const slots = ['slot-1', 'slot-2', 'slot-3', 'slot-4'];
    let targetSlot = null;

    for (let slotId of slots) {
        const slotCanvas = document.querySelector(`#${slotId}`);
        if (slotCanvas && !slotCanvas.dataset.item) {
            targetSlot = slotCanvas;
            break;
        }
    }

    if (targetSlot) {
        const ctx = targetSlot.getContext('2d');
        drawSpriteOnModal(spriteName, targetSlot, ctx);

        // Mark slot as occupied
        targetSlot.dataset.item = spriteName;
        targetSlot.title = `${spriteName} in slot`;
        targetSlot.style.borderColor = '#4CAF50';

        // Timer state
        let timeLeft = 10.0;
        const startTime = performance.now();
        let animationId = null;

        targetSlot.addEventListener('click', () => {
            if (targetSlot.dataset.item) {
                if(targetSlot.title==="cooked"){
                    console.log("removed cooked food");
                }else{
                    console.log("removed uncooked food");
                }
                if (animationId) cancelAnimationFrame(animationId);
                ctx.clearRect(0, 0, targetSlot.width, targetSlot.height);
                targetSlot.dataset.item = '';
                targetSlot.title = '';
                targetSlot.style.borderColor = '';
            }
        })
        function animateTimer(currentTime) {
            const elapsed = Math.floor((currentTime - startTime) / 1000);
            timeLeft = Math.max(0, 10.0 - elapsed);

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
                animationId = requestAnimationFrame(animateTimer);
            } else {
                console.log("cooked food");
                // Final clear and reset
                targetSlot.dataset.item = '';
                targetSlot.title = 'cooked';
                targetSlot.style.borderColor = '';
            }
        }

        requestAnimationFrame(animateTimer);
    } else {
        console.log('No empty slots available!');
    }
}


