import { objectCoordinates } from "./ObjectCoordinates";
import { getBalance, deductBalance } from "./wallet";

export const upgrades = {
    grill: {
        2: 100,
        3: 400,
        4: 900,
    }
}

let maxSlots = 4;

export function getNextUpgradeForObject(objName) {
    const currentSlots = objectCoordinates[objName].unlockedSlots;

    const nextLevel = currentSlots + 1;

    if (nextLevel > maxSlots) return null;

    return upgrades[objName][nextLevel];
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