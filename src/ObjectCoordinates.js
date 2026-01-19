import { grillTemplate } from "./InteractiveModals.js";
import { drawDoor, drawSprite } from "./SceneCreation.js";
import { createModal } from "./StateManagement.js";

export const objectCoordinates = {
    grillLevel11: {
        col: 2, row: 0.1, collisionWidth: 31, collisionHeight: 44,
        offsetX: 0, offsetY: 0,
        interactable: true,
        onInteract: {
            template:grillTemplate,
            onOpen:(canvas,ctx,player)=>{
                console.log("function call=>",canvas,ctx,player);
                createModal('grillLevel1',grillTemplate, canvas, ctx, player,1);
            },
        }
    },

    gasStove1: {
        col: 6.2, row: 0.2, collisionWidth: 29, collisionHeight: 40,
        offsetX: 0, offsetY: 0
    },
    exhaustType11: {
        col: 6.2, row: -0.6, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    gasStove2: {
        col: 4.2, row: 0.1, collisionWidth: 29, collisionHeight: 40,
        offsetX: 0, offsetY: 0
    },

    // === LEFT WALL - WASH STATION ===
    sinkHorizontal1: {
        col: 0.2, row: 1.5, collisionWidth: 31, collisionHeight: 45,
        offsetX: 0, offsetY: 0
    },
    dirtyPlate1: {
        col: 0.3, row: 3.2, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    dirtyPlate2: {
        col: 0.3, row: 3.8, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    cleanPlate1: {
        col: 0.3, row: 4.4, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    cleanPlate2: {
        col: 0.3, row: 5, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },

    // === PREP AREA (BELOW COOKING) ===
    unCookedHotDog1: {
        col: 2, row: 1.5, collisionWidth: 6, collisionHeight: 11,
        offsetX: 12, offsetY: 0
    },
    unCookedHotDog2: {
        col: 2.4, row: 1.5, collisionWidth: 6, collisionHeight: 11,
        offsetX: 12, offsetY: 0
    },
    eggCatoonHorizontal1: {
        col: 2.8, row: 1.5, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    cookedPatty1: {
        col: 3.5, row: 1.5, collisionWidth: 10, collisionHeight: 12,
        offsetX: 10, offsetY: 0
    },
    cookedPatty2: {
        col: 3.9, row: 1.5, collisionWidth: 10, collisionHeight: 12,
        offsetX: 10, offsetY: 0
    },
    cookedHotDog1: {
        col: 4.3, row: 1.5, collisionWidth: 6, collisionHeight: 11,
        offsetX: 12, offsetY: 0
    },

    // === PLATING ZONE (CENTER) ===
    cleanPlate3: {
        col: 2.5, row: 2.5, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    cleanPlate4: {
        col: 3, row: 2.5, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },
    cleanPlate5: {
        col: 3.5, row: 2.5, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },

    // === RIGHT WALL - STORAGE (COMPACT) ===
    cupboardType11: {
        col: 12.8, row: 0.1, collisionWidth: 47, collisionHeight: 40,
        offsetX: 0, offsetY: 0
    },
    typeOneLongFilledShelfVertical1: {
        col: 14, row: 1.5, collisionWidth: 25, collisionHeight: 58,
        offsetX: 0, offsetY: 0
    },
    eggCatoonVertical1: {
        col: 14.2, row: 2, collisionWidth: 11, collisionHeight: 16,
        offsetX: 7, offsetY: 0
    },
    eggCatoonVertical2: {
        col: 14.2, row: 2.8, collisionWidth: 11, collisionHeight: 16,
        offsetX: 7, offsetY: 0
    },

    // === CUSTOMER SERVICE COUNTER (BOTTOM - TIGHT) ===
    typeOneLongFilledShelfHorizontal1: {
        col: 1, row: 8.5, collisionWidth: 47, collisionHeight: 46,
        offsetX: 0, offsetY: 0
    },
    typeTwoLongFilledShelfHorizontal1: {
        col: 3.5, row: 8.2, collisionWidth: 47, collisionHeight: 66,
        offsetX: 0, offsetY: 0
    },
    typeOneLongFilledShelfHorizontal2: {
        col: 6, row: 8.5, collisionWidth: 47, collisionHeight: 46,
        offsetX: 0, offsetY: 0
    },
    typeOneLongFilledShelfHorizontal3: {
        col: 8.5, row: 8.5, collisionWidth: 47, collisionHeight: 46,
        offsetX: 0, offsetY: 0
    },

    // Ready orders on counter
    cookedPatty3: {
        col: 2.5, row: 7, collisionWidth: 10, collisionHeight: 12,
        offsetX: 10, offsetY: 0
    },
    cleanPlate6: {
        col: 3, row: 7, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    },

};

export const doorObjectCoordinates = {
    openDoorType11: {
        col: 4.7, row: 0.7, collisionWidth: 14, collisionHeight: 13,
        offsetX: 8, offsetY: 0
    }
};

export function renderObject() {
    Object.entries(objectCoordinates).forEach(([key, value]) => {
        drawSprite(key, value.col, value.row);
    });
}

export function updateRenderObjectCoordinates() {
}