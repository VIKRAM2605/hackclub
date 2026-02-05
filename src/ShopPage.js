import { player } from "./CharacterMovement.js";
import { playClickSound, playUnlockSound } from "./MusicAndSound.js";
import { objectCoordinates } from "./ObjectCoordinates.js";
import { sprites, spriteSheet } from "./SceneCreation.js";
import { attemptSkillUpgrade, attemptUpgrade, getNextUpgradeForObject, getNextUpgradeForSkills, skillNameForUpgrades, skillSpriteForUpgrades, skillUpgrades } from "./ShopStateManagement.js";
import { getBalance } from "./Wallet.js";

const closeSprite = new Image();
closeSprite.src = 'assets/Main_tiles.png';

const shopSprite = new Image();
shopSprite.src = 'assets/shopbutton-Photoroom.png';

const ribbonSprite = new Image();
ribbonSprite.src = 'assets/ribbon-banners-Photoroom.png';

const bgSprite = new Image();
bgSprite.src = 'assets/Shop.png';

const imagesLoaded = () => {
    return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = 4;
        const onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
        };

        if (closeSprite.complete) loadedCount++; else closeSprite.onload = onload;
        if (shopSprite.complete) loadedCount++; else shopSprite.onload = onload;
        if (ribbonSprite.complete) loadedCount++; else ribbonSprite.onload = onload;
        if (bgSprite.complete) loadedCount++; else bgSprite.onload = onload;

        if (loadedCount === totalImages) resolve();
    });
};

function toTitleCase(str) {
    return str.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function setupCanvas(canvas, sourceW, sourceH) {
    const dpr = window.devicePixelRatio || 1;
    const scale = 4;

    const logicalW = sourceW * scale;
    const logicalH = sourceH * scale;

    canvas.width = logicalW * dpr;
    canvas.height = logicalH * dpr;

    canvas.style.width = `${logicalW}px`;
    canvas.style.height = `${logicalH}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;

    return ctx;
}

export function initStartPageButton() {
    buildStartPageButton();
}

export function buildStartPageButton() {
    let pageBtn = document.getElementById('main-shop-button-div');
    if (pageBtn) return;

    pageBtn = document.createElement('div');
    pageBtn.id = "main-shop-button-div";

    document.body.appendChild(pageBtn);

    pageBtn.style.position = 'absolute';
    pageBtn.style.cursor = 'pointer';

    const shopBtnCanvas = document.createElement('canvas');
    shopBtnCanvas.id = 'shop-canvas-btn';

    shopBtnCanvas.width = 40;
    shopBtnCanvas.height = 40;

    const shopctx = shopBtnCanvas.getContext('2d');

    const drawShopBtn = () => {
        shopctx.drawImage(
            shopSprite,
            69, 69, 122, 120,
            0, 0, 40, 40
        );
    };

    if (shopSprite.complete) {
        drawShopBtn();
    } else {
        shopSprite.onload = drawShopBtn;
    }

    pageBtn.appendChild(shopBtnCanvas);

    const updatePosition = () => {
        const rect = document.getElementById('canvas1').getBoundingClientRect();
        const scale = 2.3;

        const finalTop = rect.top + (10 * scale);
        const finalLeft = rect.right - (70 * scale);

        pageBtn.style.top = `${finalTop}px`;
        pageBtn.style.left = `${finalLeft}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    shopBtnCanvas.onclick = (e) => {
        playClickSound();
        e.stopPropagation();
        showShopModal();
    };
}

export function showShopBtn() {
    const showShopBtn = document.getElementById('main-shop-button-div');
    if (showShopBtn) {
        showShopBtn.style.display = 'block';
    }
}

export function hideShopBtn() {
    const hideShopBtn = document.getElementById('main-shop-button-div');
    if (hideShopBtn) {
        hideShopBtn.style.display = 'none';
    }
}

export async function showShopModal() {
    await imagesLoaded();

    let shopOverlay = document.createElement('div');
    shopOverlay.id = 'shop-overlay';
    Object.assign(shopOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1000',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none' 
    });

    let shopModal = document.createElement('div');
    Object.assign(shopModal.style, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '700px',
        maxHeight: '85vh',
        padding: '40px 30px 30px 30px',
        backgroundColor: '#eec39a',
        borderRadius: '12px',
        border: '4px solid #5D4037',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none' 
    });

    const title = document.createElement('div');
    title.textContent = 'SHOP';
    Object.assign(title.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: '10px',
        textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
    });
    shopModal.appendChild(title);

    const moneyDisplay = document.createElement('div');
    const updateMoneyDisplay = () => {
        moneyDisplay.textContent = `Your Money: $${getBalance().toFixed(2)}`;
    };
    updateMoneyDisplay();
    
    Object.assign(moneyDisplay.style, {
        fontFamily: "'Pixelify Sans', sans-serif",
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: '30px'
    });
    shopModal.appendChild(moneyDisplay);

    const itemsContainer = document.createElement('div');
    Object.assign(itemsContainer.style, {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '20px',
        maxHeight: '60vh',
        overflow: 'auto',
        padding: '10px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none' 
    });

    const updateShopUI = () => {
        updateMoneyDisplay();
        itemsContainer.innerHTML = '';

        for (let objName in objectCoordinates) {
            const obj = objectCoordinates[objName];

            if (obj.unlockedSlots && obj.unlockedSlots < 4) {
                const nextLevel = obj.unlockedSlots + 1;
                const cost = getNextUpgradeForObject(objName);

                const itemCard = createUpgradeCard(
                    objName,
                    toTitleCase(obj.name),
                    `Unlock Slot ${nextLevel}`,
                    cost,
                    'object',
                    () => {
                        playUnlockSound();
                        const result = attemptUpgrade(objName);
                        if (result.success) {
                            console.log("Upgraded!");
                            updateShopUI();
                        } else {
                            console.log(result.msg);
                        }
                    }
                );

                itemsContainer.appendChild(itemCard);
            }
        }

        for (let skillName in skillUpgrades) {
            if (skillName === "buyAHeart") continue;

            const currentSkillLvl = player[skillName];
            if (currentSkillLvl && currentSkillLvl < 4) {
                const nextSkillLvl = currentSkillLvl + 1;
                const cost = getNextUpgradeForSkills(skillName);

                const itemCard = createUpgradeCard(
                    skillName,
                    toTitleCase(skillNameForUpgrades[skillName]),
                    `Level ${nextSkillLvl}`,
                    cost,
                    'skill',
                    () => {
                        playUnlockSound();
                        const result = attemptSkillUpgrade(skillName);
                        if (result.success) {
                            console.log("Upgraded!");
                            updateShopUI();
                        } else {
                            console.log(result.msg);
                        }
                    }
                );

                itemsContainer.appendChild(itemCard);
            }
        }
    };

    function createUpgradeCard(id, name, description, price, type, onBuy) {
        const itemCard = document.createElement('div');
        Object.assign(itemCard.style, {
            backgroundColor: '#d4a574',
            border: '3px solid #5D4037',
            borderRadius: '8px',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        });

        const iconCanvas = document.createElement('canvas');
        const cardBaseSize = 50;
        const iconCtx = setupCanvas(iconCanvas, cardBaseSize, cardBaseSize);

        iconCtx.drawImage(
            bgSprite,
            357, 161, 21, 21,
            0, 0, cardBaseSize, cardBaseSize
        );

        if (type === 'object') {
            const sprite = sprites[id.slice(0, -1)];
            if (sprite) {
                iconCtx.drawImage(
                    spriteSheet,
                    sprite.x, sprite.y, sprite.w, sprite.h,
                    (cardBaseSize / 2) - (sprite.w / 2), (cardBaseSize / 2) - (sprite.h / 2),
                    sprite.w, sprite.h
                );
            }
        } else if (type === 'skill') {
            const sprite = skillSpriteForUpgrades[id];
            if (sprite) {
                iconCtx.drawImage(
                    sprite.img,
                    sprite.x, sprite.y, sprite.w, sprite.h,
                    (cardBaseSize / 2) - (sprite.sw / 2), (cardBaseSize / 2) - (sprite.sh / 2),
                    sprite.sw, sprite.sh
                );
            }
        }

        iconCtx.drawImage(
            ribbonSprite,
            34, 102, 156, 44,
            0, -3, 50, 15
        );

        iconCtx.fillStyle = "black";
        iconCtx.textAlign = "center";
        iconCtx.textBaseline = "middle";
        iconCtx.font = "bold 5px 'Pixelify Sans', sans-serif";
        iconCtx.fillText(name.length > 12 ? name.substring(0, 12) + '...' : name, cardBaseSize / 2, 3);

        itemCard.appendChild(iconCanvas);

        const itemName = document.createElement('div');
        itemName.textContent = description;
        Object.assign(itemName.style, {
            fontFamily: "'Pixelify Sans', sans-serif",
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#5D4037',
            textAlign: 'center'
        });
        itemCard.appendChild(itemName);

        const priceBtn = document.createElement('div');
        const canAfford = getBalance() >= price;
        priceBtn.textContent = `$${price}`;
        Object.assign(priceBtn.style, {
            fontFamily: "'Pixelify Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 'bold',
            color: canAfford ? '#087f23' : '#d32f2f',
            backgroundColor: canAfford ? '#c8e6c9' : '#ffcdd2',
            padding: '8px 16px',
            borderRadius: '6px',
            border: `2px solid ${canAfford ? '#087f23' : '#d32f2f'}`,
            cursor: canAfford ? 'pointer' : 'not-allowed',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
        });

        if (canAfford) {
            priceBtn.onclick = onBuy;
            priceBtn.onmouseenter = () => {
                priceBtn.style.backgroundColor = '#a5d6a7';
            };
            priceBtn.onmouseleave = () => {
                priceBtn.style.backgroundColor = '#c8e6c9';
            };
        }

        itemCard.appendChild(priceBtn);

        return itemCard;
    }

    updateShopUI();
    shopModal.appendChild(itemsContainer);

    const dpr = window.devicePixelRatio || 1;
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
        playClickSound();
        hideShopModal();
    };

    shopModal.appendChild(closeCanvas);

    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            hideShopModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    shopOverlay.appendChild(shopModal);
    document.getElementById('game-container').appendChild(shopOverlay);
}

export function hideShopModal() {
    const shopOverlay = document.getElementById('shop-overlay');
    if (shopOverlay) {
        shopOverlay.remove();
    }
}