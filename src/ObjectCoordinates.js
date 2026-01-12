import { drawSprite } from "./SceneCreation.js";

const objectCoordinates = {
    grillLevel1: { col: 3, row: 2 }
};
export function renderObject() {
    Object.entries(objectCoordinates).forEach(([key, value]) => {
        drawSprite(key,value.col, value.row);
    });

}

export function updateRenderObjectCoordinates(){

}