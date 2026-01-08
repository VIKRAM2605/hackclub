//function to spawn coin
function spawncoin(){
 const coin = document.createElement('div');
 coin.className='coin';
 coin.src='../assests/coin.webp'

 const positionX=Math.random()*(window.innerWidth-40);
 coin.style.left=positionX+'px';
 coin.style.top='0px';
 
 document.body.appendChild(coin);
 coin.style.animation='fall 3s linear';
}

//helper function to set the upper and lower bound for the random function
function randomInt(min,max){
     return Math.floor(Math.random()*(max-min+1)+min);
}

//time to spawn the coin with upper and lower bound
setInterval(()=>{
    spawncoin();
},randomInt(50000,100000));

