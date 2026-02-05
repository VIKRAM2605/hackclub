import { drawSprite } from "./SceneCreation.js";
import { showCookingModal } from "./StateManagement.js";

export const objectCoordinates = {
    grillLevel11: {
        col: 2.4, row: 0.27, collisionWidth: 31, collisionHeight: 38,
        offsetX: 0, offsetY: 0,
        unlockedSlots: 1,
        interactable: true,
        name: 'patty stn',
        cookingTime: 10,
        objectId: 1,
        onInteract: {
            onOpen: (canvas, ctx, player, unlockedSlots) => {
                console.log("function call=>", canvas, ctx, player, unlockedSlots);
                showCookingModal('grillLevel11', 1, unlockedSlots);
            },
        }
    },
    grillLevel12: {
        col: 4.8, row: 0.27, collisionWidth: 31, collisionHeight: 38,
        offsetX: 0, offsetY: 0,
        unlockedSlots: 1,
        interactable: true,
        name: 'hotdog stn',
        cookingTime: 12,
        objectId: 2,
        onInteract: {
            onOpen: (canvas, ctx, player, unlockedSlots) => {
                console.log("function call=>", canvas, ctx, player, unlockedSlots);
                showCookingModal('grillLevel12', 2, unlockedSlots);
            },
        }
    },
    gasStove1: {
        col: 8.65, row: 0.34, collisionWidth: 30, collisionHeight: 34,
        offsetX: 0, offsetY: 0,
        unlockedSlots: 1,
        interactable: true,
        name: 'Soup stn',
        cookingTime: 14,
        objectId: 3,
        onInteract: {
            onOpen: (canvas, ctx, player, unlockedSlots) => {
                console.log("function call=>", canvas, ctx, player, unlockedSlots);
                showCookingModal('gasStove1', 3, unlockedSlots);
            },
        }
    },
    drawer1: {
        col: 1.2, row: 0.35, collisionWidth: 47, collisionHeight: 34,
        offsetX: 0, offsetY: 0,
    },
    peppersTub1: {
        col: 0.7, row: 0, collisionWidth: 14, collisionHeight: 21,
        offsetX: 0, offsetY: 0,
    },
    veggiesTub1: {
        col: 1.2, row: 0, collisionWidth: 14, collisionHeight: 22,
        offsetX: 0, offsetY: 0,
    },
    unCookedMeatTub1: {
        col: 1.65, row: 0.02, collisionWidth: 14, collisionHeight: 20,
        offsetX: 0, offsetY: 0,
    },
    cupboardType11: {
        col: 3.58, row: 0.35, collisionWidth: 47, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    towel1: {
        col: 3.2, row: 0, collisionWidth: 12, collisionHeight: 15,
        offsetX: 0, offsetY: 0,
    },
    cleanPlate1: {
        col: 4, row: -0.1, collisionWidth: 14, collisionHeight: 13,
        offsetX: 0, offsetY: 0,
    },
    unCookedPatty1: {
        col: 4, row: -0.1, collisionWidth: 10, collisionHeight: 9,
        offsetX: 0, offsetY: 0,
    },
    cookedPatty1: {
        col: 3.6, row: 0.1, collisionWidth: 10, collisionHeight: 9,
        offsetX: 0, offsetY: 0,
    },
    knife1: {
        col: 4, row: 0.2, collisionWidth: 9, collisionHeight: 9,
        offsetX: 0, offsetY: 0,
    },
    cupboardType12: {
        col: 6, row: 0.35, collisionWidth: 70, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    cookedHotDog1: {
        col: 5.5, row: 0.1, collisionWidth: 6, collisionHeight: 11,
        offsetX: 0, offsetY: 0,
    },
    cookedHotDog2: {
        col: 5.75, row: 0.1, collisionWidth: 6, collisionHeight: 11,
        offsetX: 0, offsetY: 0,
    },
    ketchup1: {
        col: 6.5, row: -0.1, collisionWidth: 7, collisionHeight: 13,
        offsetX: 0, offsetY: 0,
    },
    mustard1: {
        col: 6.5, row: 0.1, collisionWidth: 7, collisionHeight: 13,
        offsetX: 0, offsetY: 0,
    },
    dirtyPlateStack1: {
        col: 6.15, row: 0, collisionWidth: 14, collisionHeight: 17,
        offsetX: 0, offsetY: 0,
    },
    typeOneLongFilledShelfHorizontal1: {
        col: 7.45, row: 0.26, collisionWidth: 47, collisionHeight: 38,
        offsetX: 0, offsetY: 0,
    },
    utensilsRack11: {
        col: 9.82, row: 0.26, collisionWidth: 47, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    cupboardType13: {
        col: 11.25, row: 0.26, collisionWidth: 47, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    mixer1: {
        col: 10.9, row: -0.25, collisionWidth: 15, collisionHeight: 32,
        offsetX: 0, offsetY: 0,
    },
    bowlMix: {
        col: 11.5, row: -0.05, collisionWidth: 14, collisionHeight: 15,
        offsetX: 0, offsetY: 0,
    },
    bench11: {
        col: 6.75, row: 5.1, collisionWidth: 70, collisionHeight: 30,
        offsetX: 0, offsetY: 0,
    },
    payment1: {
        col: 6.2, row: 4.85, collisionWidth: 12, collisionHeight: 14,
        offsetX: 0, offsetY: 0,
    },
    ketchup2: {
        col: 7.5, row: 4.85, collisionWidth: 7, collisionHeight: 13,
        offsetX: 0, offsetY: 0,
    },
    mustard2: {
        col: 7.7, row: 4.65, collisionWidth: 7, collisionHeight: 13,
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
    sink11: {
        col: 0.1, row: 1.5, collisionWidth: 27 , collisionHeight: 58,
        offsetX: 0, offsetY: 0,
    },
    DishWash11: {
        col: 0.15, row: 3, collisionWidth: 27, collisionHeight: 73,
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