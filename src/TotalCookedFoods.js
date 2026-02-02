export let cookedFoodCount = {
    cookedPatty: 0,
    cookedHotDog: 0,
    cookedSoup: 0

};

export function updateCookedFoodCount(foodName) {
    if (!foodName) return;
    const food = cookedFoodCount[foodName];
    cookedFoodCount[food] += 1;
    return cookedFoodCount[food];
};

export function resetCookedFoodCount() {
    cookedFoodCount.cookedPatty = 0;
    cookedFoodCount.cookedHotDog = 0;
    cookedFoodCount.cookedSoup = 0;
}