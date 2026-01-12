const canvas = document.getElementById('canvas1');
export const ctx = canvas.getContext('2d');

const spriteSheet = new Image();
spriteSheet.src = 'assets/professional_kitchen.png';

const sprites = {
    cookedPatty: {x: 66, y: 19, w: 10, h: 12},
    grillLevel1: {x: 305, y: 164, w: 31, h: 44},
};

export let kitchenSpriteLoaded = false;

export function drawFloor(){
    const tileSize = 32;
    const cols = Math.floor(canvas.width / tileSize);
    const rows = Math.floor(canvas.height / tileSize);

    for(let row = 0; row < rows; row++){
        for(let col = 0; col < cols; col++){
            const x = col * tileSize;
            const y = row * tileSize;

            if((row + col) % 2 === 0){
                ctx. fillStyle = '#FFFFFF';
            } else {
                ctx.fillStyle = '#1A1A1A';
            }
            ctx.fillRect(x, y, tileSize, tileSize);
            
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx. strokeRect(x, y, tileSize, tileSize);
        }
    }
    
    const wallThickness = 5 ;
    
    // LEFT WALL
    drawWallStrip(0, 0, wallThickness, canvas.height);
    
    // RIGHT WALL  
    drawWallStrip(canvas.width - wallThickness, 0, wallThickness, canvas.height);
    
    // TOP WALL
    drawWallStrip(0, 0, canvas.width, wallThickness);
    
    // BOTTOM WALL
    drawWallStrip(0, canvas.height - wallThickness, canvas.width, wallThickness);
}

function drawWallStrip(x, y, width, height) {
    // Brown wood background
    ctx.fillStyle = '#8B5A3C';
    ctx.fillRect(x, y, width, height);
    
    // Darker brown overlay (wood grain effect)
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);
    
    // Draw horizontal lines (cabinet planks)
    ctx.strokeStyle = '#9B6A4C';
    ctx.lineWidth = 2;
    
    const plankSpacing = 32;
    for(let i = 0; i < height; i += plankSpacing){
        ctx.beginPath();
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + width, y + i);
        ctx.stroke();
    }
    
    ctx.strokeStyle = '#4A3322';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
}

export function drawSprite(spriteName, col = 0, row = 0) {
    if (! kitchenSpriteLoaded) {
        return;
    }
    
    const sprite = sprites[spriteName];
    if (!sprite) {
        console.error('Sprite not found:', spriteName);
        return;
    }
    
    const tileSize = 32;
    const x = col * tileSize + (tileSize - sprite.w) / 2;
    const y = row * tileSize + (tileSize - sprite.h) / 2;
    
    ctx.drawImage(
        spriteSheet, 
        sprite.x, sprite.y, sprite.w, sprite.h, 
        x, y, sprite.w, sprite.h
    );
}

spriteSheet.onload = () => {
    console.log('Kitchen sprites loaded! ');
    kitchenSpriteLoaded = true;
}