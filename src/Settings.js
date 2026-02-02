import { hideStartPage, showStartPage } from "./StartPage.js";

const settingsSprite = new Image();
settingsSprite.src = 'assets/Settings.png';

const sliderSprite = new Image();
sliderSprite.src = 'assets/slider-Photoroom.png';

const closeSprite = new Image();
closeSprite.src = 'assets/Main_tiles.png';

let globalSound = 0.5;
let globalMusic = 0.5;
let masterGain = null;

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 3;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (settingsSprite.complete) loadedCount++; else settingsSprite.onload = onload;
        if (sliderSprite.complete) loadedCount++; else sliderSprite.onload = onload;
        if (closeSprite.complete) loadedCount++; else closeSprite.onload = onload;

        if (loadedCount === totalImages) resolve();
    });
};

function drawPixelButton(canvas, text, theme, dpr, scale, isDisabled = false) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const logicalW = 130;
    const logicalH = 40;

    canvas.width = logicalW * dpr * scale;
    canvas.height = logicalH * dpr * scale;
    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr * scale, dpr * scale);
    ctx.imageSmoothingEnabled = false;

    const colors = {
        green: { main: '#4caf50', light: '#80e27e', dark: '#087f23', border: '#1b5e20', text: '#fff' },
        red: { main: '#d32f2f', light: '#ff6659', dark: '#9a0007', border: '#5d1010', text: '#fff' },
        gray: { main: '#555555', light: '#777777', dark: '#333333', border: '#222222', text: '#aaaaaa' },
        blue: { main: '#2196f3', light: '#64b5f6', dark: '#0d47a1', border: '#1565c0', text: '#fff' },
        orange: { main: '#ff9800', light: '#ffb74d', dark: '#e65100', border: '#bf360c', text: '#fff' }
    };

    let p = isDisabled ? colors.gray : colors[theme];
    if (!p) p = colors.gray;

    const w = logicalW;
    const h = logicalH;

    ctx.clearRect(0, 0, w, h);

    // Border
    ctx.fillStyle = p.border;
    ctx.fillRect(2, 0, w - 4, h);
    ctx.fillRect(0, 2, w, h - 4);
    ctx.fillRect(1, 1, w - 2, h - 2);
    // Main Body
    ctx.fillStyle = p.main;
    ctx.fillRect(2, 2, w - 4, h - 4);
    // Highlights
    ctx.fillStyle = p.light;
    ctx.fillRect(2, 2, w - 6, 2);
    ctx.fillRect(2, 2, 2, h - 6);
    // Shadows
    ctx.fillStyle = p.dark;
    ctx.fillRect(4, h - 4, w - 6, 2);
    ctx.fillRect(w - 4, 4, 2, h - 6);

    ctx.fillStyle = p.text;
    ctx.font = "16px 'Pixelify Sans', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.border;
    ctx.fillText(text, (w / 2) + 2, (h / 2) + 2);
    ctx.fillStyle = p.text;
    ctx.fillText(text, w / 2, h / 2);

    canvas.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
}

export async function showSettingsPage(location) {
    await imagesLoaded();

    let settingsOverlay = document.createElement('div');
    settingsOverlay.id = 'settings-overlay';
    Object.assign(settingsOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '9999',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
    });

    let settingsModal = document.createElement('div');
    Object.assign(settingsModal.style, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '500px',
        padding: '40px 20px',
        backgroundColor: '#eec39a',
        borderRadius: '12px',
        border: '4px solid #5D4037',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
    });

    const title = document.createElement('div');
    title.textContent = 'SETTINGS';
    Object.assign(title.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#5D4037', 
        marginBottom: '20px',
        textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
    });
    settingsModal.appendChild(title);

    const scale = 1.5;
    const canvasLogicalW = 250; 
    const canvasLogicalH = 100;
    const dpr = window.devicePixelRatio || 1;

    const sliderCanvas = document.createElement('canvas');
    sliderCanvas.width = canvasLogicalW * dpr * scale;
    sliderCanvas.height = canvasLogicalH * dpr * scale;
    sliderCanvas.style.width = `${canvasLogicalW * scale}px`;
    sliderCanvas.style.height = `${canvasLogicalH * scale}px`;

    const ctx = sliderCanvas.getContext('2d');
    ctx.scale(dpr * scale, dpr * scale);
    ctx.imageSmoothingEnabled = false;

    const coords = {
        musicIcon: { x: 0, y: 242, w: 13, h: 13 },
        soundIcon: { x: 0, y: 227, w: 13, h: 12 },
        tube: { x: 298, y: 251, w: 203, h: 46, sw: 100, sh: 16 }, 
        knob: { x: 520, y: 238, w: 46, h: 72, sw: 10, sh: 22 }
    };

    const row1Y = 20;
    const row2Y = 60;
    const iconX = 10;
    const tubeX = 40;
    const tubeWidth = 150;
    const knobMinX = tubeX;
    const knobMaxX = tubeX + tubeWidth - coords.knob.sw;
    const textX = tubeX + tubeWidth + 20;

    let currentSound = globalSound;
    let currentMusic = globalMusic;
    let activeKnobId = null;

    const drawSliders = () => {
        ctx.clearRect(0, 0, canvasLogicalW, canvasLogicalH);

        ctx.drawImage(settingsSprite, coords.soundIcon.x, coords.soundIcon.y, coords.soundIcon.w, coords.soundIcon.h, iconX, row1Y, 18, 18);
        ctx.drawImage(sliderSprite, coords.tube.x, coords.tube.y, coords.tube.w, coords.tube.h, tubeX, row1Y, tubeWidth, 16);
        const soundKnobX = knobMinX + (currentSound * (knobMaxX - knobMinX));
        ctx.drawImage(sliderSprite, coords.knob.x, coords.knob.y, coords.knob.w, coords.knob.h, soundKnobX, row1Y - 3, coords.knob.sw, coords.knob.sh);
        
        ctx.fillStyle = '#5D4037';
        ctx.font = "bold 12px 'Pixelify Sans', sans-serif";
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.floor(currentSound * 100)}%`, textX, row1Y + 8);

        ctx.drawImage(settingsSprite, coords.musicIcon.x, coords.musicIcon.y, coords.musicIcon.w, coords.musicIcon.h, iconX, row2Y, 18, 18);
        ctx.drawImage(sliderSprite, coords.tube.x, coords.tube.y, coords.tube.w, coords.tube.h, tubeX, row2Y, tubeWidth, 16);
        const musicKnobX = knobMinX + (currentMusic * (knobMaxX - knobMinX));
        ctx.drawImage(sliderSprite, coords.knob.x, coords.knob.y, coords.knob.w, coords.knob.h, musicKnobX, row2Y - 3, coords.knob.sw, coords.knob.sh);
        
        ctx.fillText(`${Math.floor(currentMusic * 100)}%`, textX, row2Y + 8);
    };

    drawSliders();
    settingsModal.appendChild(sliderCanvas);

    const getMousePos = (e) => {
        const rect = sliderCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale
        };
    };

    sliderCanvas.addEventListener('mousedown', (e) => {
        const pos = getMousePos(e);
        
        const sKnobX = knobMinX + (currentSound * (knobMaxX - knobMinX));
        if (pos.x >= sKnobX && pos.x <= sKnobX + coords.knob.sw && pos.y >= row1Y - 3 && pos.y <= row1Y + 20) {
            activeKnobId = 'sound';
        }

        const mKnobX = knobMinX + (currentMusic * (knobMaxX - knobMinX));
        if (pos.x >= mKnobX && pos.x <= mKnobX + coords.knob.sw && pos.y >= row2Y - 3 && pos.y <= row2Y + 20) {
            activeKnobId = 'music';
        }
    });

    const handleMove = (e) => {
        const pos = getMousePos(e);

        if (activeKnobId) {
            let pct = (pos.x - knobMinX) / (knobMaxX - knobMinX);
            pct = Math.max(0, Math.min(1, pct));

            if (activeKnobId === 'sound') {
                currentSound = pct;
                setGameVolume(currentSound);
            } else if (activeKnobId === 'music') {
                currentMusic = pct;
            }
            drawSliders();
            sliderCanvas.style.cursor = 'grabbing';
        } else {
            const sKnobX = knobMinX + (currentSound * (knobMaxX - knobMinX));
            const mKnobX = knobMinX + (currentMusic * (knobMaxX - knobMinX));
            
            const onSound = pos.x >= sKnobX && pos.x <= sKnobX + coords.knob.sw && pos.y >= row1Y - 3 && pos.y <= row1Y + 20;
            const onMusic = pos.x >= mKnobX && pos.x <= mKnobX + coords.knob.sw && pos.y >= row2Y - 3 && pos.y <= row2Y + 20;
            
            sliderCanvas.style.cursor = (onSound || onMusic) ? 'grab' : 'default';
        }
    };

    const stopDrag = () => { activeKnobId = null; };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', stopDrag);

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
    });

    const saveBtn = document.createElement('canvas');
    drawPixelButton(saveBtn, 'SAVE', 'green', dpr, 1);
    saveBtn.onclick = () => {
        globalSound = currentSound;
        globalMusic = currentMusic;
        console.log("Settings Saved", globalSound, globalMusic);
        cleanup();
    };

    const declineBtn = document.createElement('canvas');
    drawPixelButton(declineBtn, 'DECLINE', 'red', dpr, 1);
    declineBtn.onclick = () => {
        setGameVolume(globalSound); 
        cleanup();
    };

    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(declineBtn);
    settingsModal.appendChild(btnContainer);

    const closeCanvas = document.createElement('canvas');
    const closeW = 9;
    const closeH = 9;
    const closeScale = 4; 
    const closeLogicalW = closeW * closeScale;
    const closeLogicalH = closeH * closeScale;

    closeCanvas.width = closeLogicalW * dpr;
    closeCanvas.height = closeLogicalH * dpr;
    Object.assign(closeCanvas.style, {
        width: `${closeLogicalW}px`,
        height: `${closeLogicalH}px`,
        position: 'absolute',
        top: '15px',
        right: '15px',
        cursor: 'pointer'
    });

    const closectx = closeCanvas.getContext('2d');
    closectx.imageSmoothingEnabled = false;
    closectx.scale(dpr * closeScale, dpr * closeScale); 

    closectx.drawImage(
        closeSprite,
        356, 291, closeW, closeH,
        0, 0, closeW, closeH
    );

    closeCanvas.onclick = () => {
        setGameVolume(globalSound);
        cleanup();
    };

    settingsModal.appendChild(closeCanvas);
    
    settingsOverlay.appendChild(settingsModal);
    document.getElementById('game-container').appendChild(settingsOverlay);

    function cleanup() {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', stopDrag);
        hideSettingsPage();
        if (location === 'start') {
            showStartPage();
        }
    }
}

export function hideSettingsPage() {
    const settingsOverlay = document.getElementById('settings-overlay');
    if (settingsOverlay) {
        settingsOverlay.remove();
    }
}

export function setGameVolume(volume) {
    if (window.audioContext && masterGain) {
        masterGain.gain.value = volume;
    }
}