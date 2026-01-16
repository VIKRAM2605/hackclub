export const cookedFoodCount = {
    cookedPatty:0,
    cookedHotDog:0
};

export function updateCookedFoodCount(foodName){
    if (!foodName) return;
    const food = cookedFoodCount[foodName];
    cookedFoodCount[food]+=1;
    return cookedFoodCount[food];
};
    
