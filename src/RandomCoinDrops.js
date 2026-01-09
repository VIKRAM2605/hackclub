
//function to spawn coin
export function spawncoin() {
     const coin = document.createElement('div');
     coin.className = 'coin';
     coin.src = '../assests/coin.webp'

     const positionX = Math.random() * (window.innerWidth - 40);
     coin.style.left = positionX + 'px';
     coin.style.bottom = '0px';

     document.body.appendChild(coin);
     coin.style.animation = 'popup 1.5s ease-out forwards';


     setTimeout(() => {
          coin.style.animation = 'popup 1.5s ease-out forwards, fadeout 1s ease-out forwards';
     }, 9000)

     //after 10sec the coin will be removed 
     setTimeout(() => {
          coin.remove()
     }, 10000)
}

//helper function to set the upper and lower bound for the random function
export function randomInt(min, max) {
     return Math.floor(Math.random() * (max - min + 1) + min);
}




