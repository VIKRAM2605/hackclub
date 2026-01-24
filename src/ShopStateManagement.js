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
    reduceKillerChance : "reduce killer chance",
    increaseCoinDropTime : "increase coin drop time",
    reducePattyCookTime : "reduce patty cook time",
    reduceHotDogCookTime : "reduce hotdog cook time",
    buyAHeart : "revive a heart",
}

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