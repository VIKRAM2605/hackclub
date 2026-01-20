import { showRetryPage } from "./RetryPage.js";

export const health = [1, 1];


export function showHealth() {
    console.log(health);

    //here i wanna render the heart system as heart in canvas 
    //for now it will console how many hearts left once everything is finished i will update this
};

export function deductHealth() {
    if (!health) return;

    const lastIndexOfOne = health.lastIndexOf(1); // this checks whether there is one if no the function will return -1

    if (lastIndexOfOne !== -1) {
        health[lastIndexOfOne] = 0;
    }
    const dead = isDead();
    if(dead){
        console.log("Player died");
        showRetryPage();
        //in furture this if block stops the game and trigger the re-try option for now it will just console player is dead
    }
}

export function healHealth() {
    if (!health) return;

    const FirstIndexOfZero = health.indexOf(0); // gets the first occurrence of the 0 else will be -1

    if (FirstIndexOfZero !== -1) {
        health[FirstIndexOfZero] = 1;
    }
}

export function isDead() {
    if (!health) return;

    return health.every(h => h === 0);
}