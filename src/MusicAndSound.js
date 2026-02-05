import { globalMusic, globalSound } from "./Settings.js";

const bgMusic = new Audio('assets/bgmusic.mp3');
bgMusic.loop = true;

const baconCooking = new Audio('assets/baconcooking.mp3');
baconCooking.loop = true;

const click = new Audio('assets/click.wav');

const coinGrap = new Audio('assets/coingrap.wav');

const hurt = new Audio('assets/hurt.wav');

const pattycooking = new Audio('assets/pattycooking.mp3');
pattycooking.loop = true;

const foodReady = new Audio('assets/ready.wav');

const soupBoiling = new Audio('assets/soupboiling.mp3');
soupBoiling.loop = true;

const unlock = new Audio('assets/unlock.wav');

const lose = new Audio('assets/lose.wav');

const slip = new Audio('assets/slipping1.m4a');

const activeCookingSounds = {};

const cookingSoundVolumes = {
    'unCookedPatty': 1.0,
    'unCookedHotDog': 1.0,
    'unCookedSoup': 0.3
};

export function startBgMusic() {
    bgMusic.volume = globalMusic;

    bgMusic.play().catch(e => console.log("failed to load music", e));
}

export function setBgMusicVolume(volume) {
    bgMusic.volume = Math.max(0, Math.min(1, volume));
}

export function playCookingSound(foodType, objectId, slotId) {
    const soundkey = `${objectId}-${slotId}`;
    if (activeCookingSounds[soundkey]) {
        return
    }
    let sound;
    if (foodType === 'unCookedPatty') {
        sound = pattycooking
    } else if (foodType === 'unCookedHotDog') {
        sound = baconCooking;
    } else if (foodType === 'unCookedSoup') {
        sound = soupBoiling
    }
    if (sound) {
        const volumeMultiplier = cookingSoundVolumes[foodType] || 1.0;
        sound.volume = globalSound * volumeMultiplier;
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Failed to play cooking sound", e));
        activeCookingSounds[soundkey] = sound;
    }
}

export function stopCookingSound(objectId, slotId) {
    const soundkey = `${objectId}-${slotId}`;
    const sound = activeCookingSounds[soundkey];

    if (sound) {
        sound.pause();
        sound.currentTime = 0;
        delete activeCookingSounds[soundkey];
    }
}
export function playLoseSound() {
    lose.volume = globalSound;
    lose.currentTime = 0;
    lose.play().catch(e => console.log("Failed to play lose sound", e));
}

export function playSlipSound() {
    slip.volume = globalSound;
    slip.currentTime = 0;
    slip.play().catch(e => console.log("Failed to play slip sound", e));
}

export function playFoodReadySound() {
    foodReady.volume = globalSound;
    foodReady.currentTime = 0;
    foodReady.play().catch(e => console.log("Failed to play ready sound", e));
}

export function playClickSound() {
    click.volume = globalSound;
    click.currentTime = 0;
    click.play().catch(e => console.log("Failed to play click sound", e));
}

export function playCoinSound() {
    coinGrap.volume = globalSound;
    coinGrap.currentTime = 0;
    coinGrap.play().catch(e => console.log("Failed to play coin sound", e));
}

export function playHurtSound() {
    hurt.volume = globalSound;
    hurt.currentTime = 0;
    hurt.play().catch(e => console.log("Failed to play hurt sound", e));
}

export function playUnlockSound() {
    unlock.volume = globalSound;
    unlock.currentTime = 0;
    unlock.play().catch(e => console.log("Failed to play unlock sound", e));
}

export function setSoundEffectsVolume(vol) {
    const volume = Math.max(0, Math.min(1, vol));

    click.volume = volume;
    coinGrap.volume = volume;
    hurt.volume = volume;
    foodReady.volume = volume;
    unlock.volume = volume;

    baconCooking.volume = volume * cookingSoundVolumes['unCookedHotDog'];
    pattycooking.volume = volume * cookingSoundVolumes['unCookedPatty'];
    soupBoiling.volume = volume * cookingSoundVolumes['unCookedSoup'];
}