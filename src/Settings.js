import { hideStartPage, showStartPage } from "./StartPage.js";

const settingsSprite = new Image();
settingsSprite.src = 'assets/Settings.png';

const inventorySprite = new Image();
inventorySprite.src = 'assets/Inventory.png';

const buttonsSprite = new Image();
buttonsSprite.src = 'assets/Buttons.png';

const sliderSprite = new Image();
sliderSprite.src = 'assets/slider-Photoroom.png';

let globalSound = 0.5;
let globalMusic = 0.5;

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 4;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (inventorySprite.complete) loadedCount++;
        else inventorySprite.onload = onload;

        if (buttonsSprite.complete) loadedCount++;
        else buttonsSprite.onload = onload;

        if (settingsSprite.complete) loadedCount++;
        else settingsSprite.onload = onload;

        if (sliderSprite.complete) loadedCount++;
        else sliderSprite.onload = onload;


        if (loadedCount === totalImages) resolve();
    });
};

export async function showSettingsPage(location) {

    let settingsPage = document.createElement('div');
    settingsPage.id = 'settings-page';

    Object.assign(settingsPage.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1000',
        cursor: 'default'
    });

    if (location === 'start') {
        hideStartPage();
    }

    const scale = 4;
    const sourceW = 98;
    const sourceH = 149;

    const dpr = window.devicePixelRatio || 1;
    const logicalW = sourceW * scale;
    const logicalH = sourceH * scale;

    const settingsCanvas = document.createElement('canvas');
    settingsCanvas.width = logicalW * dpr;
    settingsCanvas.height = logicalH * dpr;

    settingsCanvas.style.width = `${logicalW}px`;
    settingsCanvas.style.height = `${logicalH}px`;

    const settingsctx = settingsCanvas.getContext('2d');

    settingsctx.scale(dpr, dpr);

    settingsctx.imageSmoothingEnabled = false;
    settingsctx.mozImageSmoothingEnabled = false;
    settingsctx.webkitImageSmoothingEnabled = false;

    const startSoundX = 30 + (globalSound * 45);
    const startMusicX = 30 + (globalMusic * 45);

    let currentSound = globalSound;
    let currentMusic = globalMusic;

    const settingsSpriteLocation = {
        music: { x: 0, y: 242, w: 13, h: 13 },
        sound: { x: 0, y: 227, w: 13, h: 12 },
        btn: { x: 196, y: 162, w: 39, h: 13 },
        tube: { x: 298, y: 251, w: 203, h: 46, sw: 50, sh: 8 },
        soundKnob: { id: 'sound', x: 520, y: 238, w: 46, h: 72, sw: 5, sh: 11, posX: startSoundX, posY: 20 },
        musicKnob: { id: 'music', x: 520, y: 238, w: 46, h: 72, sw: 5, sh: 11, posX: startMusicX, posY: 46 },
        closeBtn: { x: 144, y: 112, w: 25, h: 16 }
    }

    const centerXForBtn = (sourceW / 2) - (settingsSpriteLocation['btn'].w / 2);
    const centerYForBtn = (sourceH / 2) - (settingsSpriteLocation['btn'].h / 2);

    const centerYForBtnOffset = -1


    const draw = () => {
        settingsctx.clearRect(0, 0, logicalW, logicalH);

        settingsctx.save();
        settingsctx.scale(scale, scale);

        settingsctx.drawImage(
            settingsSprite,
            7, 0, sourceW, sourceH,
            0, 0, sourceW, sourceH
        )

        settingsctx.drawImage(
            inventorySprite,
            settingsSpriteLocation['closeBtn'].x, settingsSpriteLocation['closeBtn'].y, settingsSpriteLocation['closeBtn'].w, settingsSpriteLocation['closeBtn'].h,
            sourceW - settingsSpriteLocation['closeBtn'].w, 0, settingsSpriteLocation['closeBtn'].w, settingsSpriteLocation['closeBtn'].h
        )

        settingsctx.drawImage(
            settingsSprite,
            settingsSpriteLocation['sound'].x, settingsSpriteLocation['sound'].y, settingsSpriteLocation['sound'].w, settingsSpriteLocation['sound'].h,
            10, 20, settingsSpriteLocation['sound'].w, settingsSpriteLocation['sound'].h
        )

        settingsctx.drawImage(
            sliderSprite,
            settingsSpriteLocation['tube'].x, settingsSpriteLocation['tube'].y, settingsSpriteLocation['tube'].w, settingsSpriteLocation['tube'].h,
            30, 21.5, settingsSpriteLocation['tube'].sw, settingsSpriteLocation['tube'].sh
        )

        settingsctx.drawImage(
            sliderSprite,
            settingsSpriteLocation['soundKnob'].x, settingsSpriteLocation['soundKnob'].y, settingsSpriteLocation['soundKnob'].w, settingsSpriteLocation['soundKnob'].h,
            settingsSpriteLocation['soundKnob'].posX, settingsSpriteLocation['soundKnob'].posY, settingsSpriteLocation['soundKnob'].sw, settingsSpriteLocation['soundKnob'].sh
        )

        settingsctx.drawImage(
            settingsSprite,
            settingsSpriteLocation['music'].x, settingsSpriteLocation['music'].y, settingsSpriteLocation['music'].w, settingsSpriteLocation['music'].h,
            9, 45, settingsSpriteLocation['music'].w, settingsSpriteLocation['music'].h
        )

        settingsctx.drawImage(
            sliderSprite,
            settingsSpriteLocation['tube'].x, settingsSpriteLocation['tube'].y, settingsSpriteLocation['tube'].w, settingsSpriteLocation['tube'].h,
            30, 47.5, settingsSpriteLocation['tube'].sw, settingsSpriteLocation['tube'].sh
        );

        settingsctx.drawImage(
            sliderSprite,
            settingsSpriteLocation['musicKnob'].x, settingsSpriteLocation['musicKnob'].y, settingsSpriteLocation['musicKnob'].w, settingsSpriteLocation['musicKnob'].h,
            settingsSpriteLocation['musicKnob'].posX, settingsSpriteLocation['musicKnob'].posY, settingsSpriteLocation['musicKnob'].sw, settingsSpriteLocation['musicKnob'].sh
        )

        settingsctx.drawImage(
            settingsSprite,
            settingsSpriteLocation['btn'].x, settingsSpriteLocation['btn'].y, settingsSpriteLocation['btn'].w, settingsSpriteLocation['btn'].h,
            centerXForBtn, centerYForBtn + 25, settingsSpriteLocation['btn'].w, settingsSpriteLocation['btn'].h
        )

        settingsctx.drawImage(
            settingsSprite,
            settingsSpriteLocation['btn'].x, settingsSpriteLocation['btn'].y, settingsSpriteLocation['btn'].w, settingsSpriteLocation['btn'].h,
            centerXForBtn, centerYForBtn + 45, settingsSpriteLocation['btn'].w, settingsSpriteLocation['btn'].h
        );

        settingsctx.fillStyle = 'black';
        settingsctx.textAlign = 'center';
        settingsctx.textBaseline = 'middle';

        settingsctx.font = `bold 6px 'Pixelify Sans', sans-serif`;


        settingsctx.fillText("Save", centerXForBtn + (settingsSpriteLocation['btn'].w / 2), centerYForBtn + 25 + centerYForBtnOffset + (settingsSpriteLocation['btn'].h / 2) + 0.5);

        settingsctx.fillText("Decline", centerXForBtn + (settingsSpriteLocation['btn'].w / 2), centerYForBtn + 45 + centerYForBtnOffset + (settingsSpriteLocation['btn'].h / 2) + 0.5);

        settingsctx.restore();


    }

    let activeKnob = null;
    let dragOffsetX = 0;

    await imagesLoaded();
    draw();

    settingsPage.appendChild(settingsCanvas);
    document.getElementById('game-container').appendChild(settingsPage);

    const getGameMousePos = (e) => {
        const rect = settingsCanvas.getBoundingClientRect();

        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        return { x: mouseX, y: mouseY };
    };

    settingsCanvas.addEventListener('mousedown', (e) => {
        const pos = getGameMousePos(e);

        const sKnob = settingsSpriteLocation.soundKnob;
        const mKnob = settingsSpriteLocation.musicKnob
        if (pos.x >= sKnob.posX && pos.x <= sKnob.posX + sKnob.sw &&
            pos.y >= sKnob.posY && pos.y <= sKnob.posY + sKnob.sh) {
            activeKnob = sKnob;
            dragOffsetX = pos.x - sKnob.posX;
            e.preventDefault();
            console.log('Drag started');
        }
        if (pos.x >= mKnob.posX && pos.x <= mKnob.posX + mKnob.sw &&
            pos.y >= mKnob.posY && pos.y <= mKnob.posY + mKnob.sh) {
            activeKnob = mKnob;
            dragOffsetX = pos.x - mKnob.posX;
            e.preventDefault();
            console.log('Drag started');
        }
        if (pos.x >= centerXForBtn && pos.x <= centerXForBtn + settingsSpriteLocation['btn'].w &&
            pos.y >= centerYForBtn + 25 && pos.y <= centerYForBtn + 25 + settingsSpriteLocation['btn'].h) {
            globalSound = currentSound;
            globalMusic = currentMusic;
            console.log("Settings Saved", globalSound, globalMusic);
            hideSettingsPage();
            if (location == 'start') {
                showStartPage();
            }
            return;
        }
        if (pos.x >= centerXForBtn && pos.x <= centerXForBtn + settingsSpriteLocation['btn'].w &&
            pos.y >= centerYForBtn + 45 && pos.y <= centerYForBtn + 45 + settingsSpriteLocation['btn'].h) {
            setGameVolume(globalSound);
            hideSettingsPage();
            if (location == 'start') {
                showStartPage();
            }
            return;
        }
        if (pos.x >= sourceW - settingsSpriteLocation['closeBtn'].w + 12 && pos.x <= sourceW &&
            pos.y >= 0 && pos.y <= 0 + settingsSpriteLocation['closeBtn'].h) {
            hideSettingsPage();
            if (location == 'start') {
                showStartPage();
            }
            return;
        }
    });

    settingsCanvas.addEventListener('mousemove', (e) => {
        const pos = getGameMousePos(e);

        if (activeKnob) {

            const minX = 30;
            const maxX = 75;

            let newKnobX = pos.x - dragOffsetX;

            activeKnob.posX = Math.max(minX, Math.min(maxX, newKnobX));

            const vol = (activeKnob.posX - minX) / (maxX - minX);

            if (activeKnob.id === 'sound') {
                setGameVolume(vol);
                currentSound = vol;
            } else if (activeKnob.id === 'music') {
                currentMusic = vol;
                console.log(`Music Vol: ${(vol * 100).toFixed(0)}%`);
            }

            draw();
            settingsCanvas.style.cursor = 'grabbing';

        }

        const sKnob = settingsSpriteLocation.soundKnob;
        const mKnob = settingsSpriteLocation.musicKnob;

        const onSound = pos.x >= sKnob.posX && pos.x <= sKnob.posX + sKnob.sw &&
            pos.y >= sKnob.posY && pos.y <= sKnob.posY + sKnob.sh;

        const onMusic = pos.x >= mKnob.posX && pos.x <= mKnob.posX + mKnob.sw &&
            pos.y >= mKnob.posY && pos.y <= mKnob.posY + mKnob.sh;

        const onSave = pos.x >= centerXForBtn && pos.x <= centerXForBtn + settingsSpriteLocation['btn'].w &&
            pos.y >= centerYForBtn + 25 && pos.y <= centerYForBtn + 25 + settingsSpriteLocation['btn'].h;

        const onDecline = pos.x >= centerXForBtn && pos.x <= centerXForBtn + settingsSpriteLocation['btn'].w &&
            pos.y >= centerYForBtn + 45 && pos.y <= centerYForBtn + 45 + settingsSpriteLocation['btn'].h;

        const onClose = pos.x >= sourceW - settingsSpriteLocation['closeBtn'].w + 12 && pos.x <= sourceW &&
            pos.y >= 0 && pos.y <= 0 + settingsSpriteLocation['closeBtn'].h;

        settingsCanvas.style.cursor = (onSound || onMusic) ? 'grab' : (onSave || onDecline || onClose) ? 'pointer' : 'default';
    });

    const stopDrag = () => {
        if (activeKnob) {
            activeKnob = null;
            settingsCanvas.style.cursor = 'grab';
        }
    }
    settingsCanvas.addEventListener('mouseup', stopDrag);
    settingsCanvas.addEventListener('mouseleave', stopDrag);
    document.addEventListener('mouseup', stopDrag);

}

export function hideSettingsPage() {
    const settingsPage = document.getElementById('settings-page');
    if (settingsPage) {
        settingsPage.remove();
    }
}

export function setGameVolume(volume) {
    if (window.audioContext) {
        masterGain.gain.value = volume;
    }
    console.log(`Volume: ${(volume * 100).toFixed(0)}%`);
}
