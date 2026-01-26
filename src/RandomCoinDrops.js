let activeCoins = []

const coinSpriteSheet = new Image();
coinSpriteSheet.src = 'assets/coin1-Photoroom.png';
//function to spawn coin
export function spawncoin() {
     const coin = document.createElement('canvas');

     coin.width = 32;
     coin.height = 32;

     coin.style.width = '8px';
     coin.style.height = '8px';
     coin.id = `coin-canvas-${Date.now()}`;
     coin.className = 'coin';

     const coinctx = coin.getContext('2d');

     coinctx.imageSmoothingEnabled = false;

     coinctx.drawImage(
          coinSpriteSheet,
          215, 228, 212, 195,
          0, 0, 32, 32
     )

     const centerX = 400;
     const centerY = 120;
     const radius = 60;

     const angle = Math.random() * Math.PI * 2;
     const distance = Math.sqrt(Math.random()) * radius;

     const randomX = centerX + (Math.cos(angle) * distance);
     const randomY = centerY + (Math.sin(angle) * distance);
     coin.style.left = randomX + 'px';
     coin.style.bottom = randomY + 'px';

     document.body.appendChild(coin);
     coin.style.animation = 'popup 1.5s ease-out forwards';

     const spawnTime = Date.now();

     const fadeTimeout = setTimeout(() => {
          coin.style.transition = 'opacity 1s ease-out';
          coin.style.opacity = '0';
     }, 9000);

     const removeTimeout = setTimeout(() => {
          coin.remove();
          activeCoins = activeCoins.filter(c => c.element !== coin);
     }, 10000);
     activeCoins.push(
          {
               element: coin,
               fadeTimeout: fadeTimeout,
               removeTimeout: removeTimeout,
               spawnTime: spawnTime,
               pauseTime: null
          }
     )
}

//helper function to set the upper and lower bound for the random function
export function randomInt(min, max) {
     return Math.floor(Math.random() * (max - min + 1) + min);
}

export function pauseAllCoins() {
     const now = Date.now()
     activeCoins.forEach(coinData => {
          clearTimeout(coinData.fadeTimeout);
          clearTimeout(coinData.removeTimeout);
          coinData.pauseTime = now;
     });
}

export function resumeAllCoins() {
     activeCoins.forEach(coinData => {
          if (!coinData.pauseTime) return;
          const elapsedBeforePause = coinData.pauseTime - coinData.spawnTime;
          const remainingFadeOut = 9000 - elapsedBeforePause;
          const remainingRemoveTimeOut = 10000 - elapsedBeforePause;

          if (remainingFadeOut > 0) {
               coinData.fadeTimeout = setTimeout(() => {
                    coinData.element.style.transition = 'opacity 1s ease-out';
                    coinData.element.style.opacity = '0';
               }, remainingFadeOut);
          }
          if (remainingRemoveTimeOut > 0) {
               coinData.removeTimeout = setTimeout(() => {
                    coinData.element.remove();
                    activeCoins = activeCoins.filter(c => c.element !== coinData.element);
               }, remainingRemoveTimeOut)
          } else {
               coinData.element.remove();
               activeCoins = activeCoins.filter(c => c.element !== coinData.element);
          }

          coinData.pauseTime = null;
     })
}

export function removeAllCoins() {
     activeCoins.forEach(coinData => {
          coinData.element.remove();
     });
     activeCoins = [];
}