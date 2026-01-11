const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const spriteSheet = new Image();

spriteSheet.src='assets/professional_kitchen.png';

const sprites={
    cookedPatty:{x:66,y:19,w:10,h:12},
    grillLevel1:{x:305,y:164,w:31,h:44},
};

export function drawFloor(){

    const grid = 8;
    const tileSize=64;

    for(let row=0;row<grid;row++){
        for(let col=0;col<grid;col++){

            const x = col*tileSize;
            const y = row*tileSize;

            if((row+col)%2==0){
                ctx.fillStyle='#f5f5f5'
            }else{
                ctx.fillStyle='#e0e0e0';
            }
            ctx.fillRect(x,y,tileSize,tileSize);

        }
    }
}

export function drawSprite(spriteName, col = 0, row = 0) {
    const sprite = sprites[spriteName];
    const tileSize = 64;
    
    // 2D position: x = col * tileSize, y = row * tileSize
    const x = col * tileSize + (tileSize - sprite.w * 2) / 2;
    const y = row * tileSize + (tileSize - sprite.h * 2) / 2;
    
    ctx.drawImage(
        spriteSheet, 
        sprite.x, sprite.y, sprite.w, sprite.h, 
        x, y, sprite.w * 2, sprite.h * 2
    );
}

spriteSheet.onload = ()=>{
    console.log('loaded');
    drawSprite('grillLevel1',3,2);
    drawSprite('cookedPatty',2.8,1.6);
    drawSprite('cookedPatty',3.2,1.6);
    drawSprite('cookedPatty',2.8,1.9);
    drawSprite('cookedPatty',3.2,1.9);

}

