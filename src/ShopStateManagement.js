import { player } from "./CharacterMovement.js";
import { objectCoordinates } from "./ObjectCoordinates.js";
import { getBalance, deductBalance } from "./Wallet.js";

export const upgrades = {
    grillLevel1: {
        2: 100,
        3: 400,
        4: 900,
    }
}

export const skillUpgrades = {
    reduceKillerChance: {
        2: 600,
        3: 900,
        4: 1500,
    },
    increaseCoinDropTime: {
        2: 800,
        3: 1000,
        4: 1300,
    },
    buyAHeart: {
        1: 2000,
    },
    reducePattyCookTime: {
        2: 1000,
        3: 2000,
        4: 4000,
    },
    reduceHotDogCookTime: {
        2: 1200,
        3: 2200,
        4: 4300,
    },

}
export const skillNameForUpgrades = {
    reduceKillerChance: "killer chance",
    increaseCoinDropTime: "coin drop",
    reducePattyCookTime: "patty cook",
    reduceHotDogCookTime: "hotdog cook",
    buyAHeart: "heart",
}

export const skillSpriteForUpgrades = {
    reduceKillerChance: {
        img: new Image(),
        x: 76, y: 59, w: 111, h: 147, sw: 32, sh: 32
    },
    increaseCoinDropTime: {
        img: new Image(),
        x: 215, y: 228, w: 212, h: 195, sw: 32, sh: 32
    },
    reducePattyCookTime: {
        img: new Image(),
        x: 196, y: 39, w: 887, h: 1202, sw: 32, sh: 38
    },
    reduceHotDogCookTime: {
        img: new Image(),
        x: 196, y: 39, w: 887, h: 1202, sw: 32, sh: 38
    },
    buyAHeart: {
        img: new Image(),
        x: 11, y: 14, w: 42, h: 39, sw: 32, sh: 32
    }
};

skillSpriteForUpgrades.reduceKillerChance.img.src = 'assets/killer-Photoroom.png';
skillSpriteForUpgrades.increaseCoinDropTime.img.src = 'assets/coin1-Photoroom.png';
skillSpriteForUpgrades.reducePattyCookTime.img.src = 'assets/timer-Photoroom.png';
skillSpriteForUpgrades.reduceHotDogCookTime.img.src = 'assets/timer-Photoroom.png';
skillSpriteForUpgrades.buyAHeart.img.src = 'assets/hearttype1.png';

let maxSlots = 4;

export function getNextUpgradeForObject(objName) {
    const currentSlots = objectCoordinates[objName].unlockedSlots;

    const nextLevel = currentSlots + 1;

    if (nextLevel > maxSlots) return null;

    return upgrades[objName.slice(0, -1)][nextLevel];
}
export function getNextUpgradeForSkills(skill) {
    const currentLvl = player[skill];
    console.log(currentLvl);

    const nextLevel = currentLvl + 1;

    if (nextLevel > maxSlots) return null;

    return skillUpgrades[skill][nextLevel];
}

export function attemptUpgrade(objName) {
    const cost = getNextUpgradeForObject(objName);
    if (cost == null) return { success: false, msg: "Max Level Reached" };

    if (deductBalance(cost)) {
        objectCoordinates[objName].unlockedSlots++;

        return { success: true, msg: "Successfully Bought" }
    } else {
        return { success: false, msg: "Insufficient Balance" }
    }
}

export function attemptSkillUpgrade(skill) {
    const cost = getNextUpgradeForSkills(skill);

    if (cost === null) return { success: false, msg: "Max Level Reached" };

    if (deductBalance(cost)) {
        player[skill]++;
        return { success: true, msg: "Successfully Bought" };
    } else {
        return { success: false, msg: "Insufficient Balance" };
    }
}