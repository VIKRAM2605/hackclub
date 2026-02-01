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
        col: 4, row: 0.2, collisionWidth: 31, collisionHeight: 44,
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