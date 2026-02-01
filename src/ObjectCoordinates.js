import { grillTemplate, shopTemplate } from "./InteractiveModals.js";
import { drawSprite } from "./SceneCreation.js";
import { createModal } from "./StateManagement.js";

export const objectCoordinates = {
    grillLevel11: {
        col: 2, row: 0.2, collisionWidth: 31, collisionHeight: 44,
        offsetX: 0, offsetY: 0,
        unlockedSlots: 1,
        interactable: true,
        name: 'patty stn',
        cookingTime: 10,
        objectId: 1,
        onInteract: {
            onOpen: (canvas, ctx, player, unlockedSlots) => {
                console.log("function call=>", canvas, ctx, player, unlockedSlots);
                createModal('grillLevel11', grillTemplate, canvas, ctx, player, 1, unlockedSlots);
            },
        }
    },
    grillLevel12: {
        col: 3, row: 0.2, collisionWidth: 31, collisionHeight: 44,
        offsetX: 0, offsetY: 0,
        unlockedSlots: 1,
        interactable: true,
        name: 'hotdog stn',
        cookingTime: 12,
        objectId: 2,
        onInteract: {
            onOpen: (canvas, ctx, player, unlockedSlots) => {
                console.log("function call=>", canvas, ctx, player, unlockedSlots);
                createModal('grillLevel12', grillTemplate, canvas, ctx, player, 2, unlockedSlots);
            },
        }
    },
    gasStove1: {
        col: 4, row: 0.2, collisionWidth: 30, collisionHeight: 42,
        offsetX: 0, offsetY: 0,
        unlockedSlots: 1,
        interactable: true,
        name: 'Soup stn',
        cookingTime: 14,
        objectId: 3,
        onInteract: {
            onOpen: (canvas, ctx, player, unlockedSlots) => {
                console.log("function call=>", canvas, ctx, player, unlockedSlots);
                createModal('gasStove1', grillTemplate, canvas, ctx, player, 3, unlockedSlots);
            },
        }
    }, 
    bench11: {
        col: 6.75, row: 5.1, collisionWidth: 70, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    payment1: {
        col: 6.2, row: 4.8, collisionWidth: 70, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    divider1: {
        col: 0.4, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider2: {
        col: 1.9, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider3: {
        col: 3.4, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider4: {
        col: 4.9, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider5: {
        col: 8.6, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider6: {
        col: 10.1, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider7: {
        col: 11.6, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider8: {
        col: 13.1, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
    },
    divider9: {
        col: 14.6, row: 5.2, collisionWidth: 45, collisionHeight: 25,
        offsetX: 0, offsetY: 0,
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