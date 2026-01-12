import { drawSprite } from "./SceneCreation.js";

export const objectCoordinates = {
    grillLevel1: {
        col: 3, row: 2, collisionWidth: 30, collisionHeight: 34,
        offsetX: 2,
        offsetY: 2
    },
    cookedPatty: {
        col: 5.8, row: 1.8, collisionWidth: 12, collisionHeight: 12,
        offsetX: 0,
        offsetY: -1.5
    }
};
export function renderObject() {
    Object.entries(objectCoordinates).forEach(([key, value]) => {
        drawSprite(key, value.col, value.row);
    });

}

export function updateRenderObjectCoordinates() {

}