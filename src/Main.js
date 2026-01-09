import {currentBalance , addBalance } from "./Wallet.js";
import { randomInt,spawncoin } from "./RandomCoinDrops.js";


currentBalance(0);

document.body.addEventListener('click',function(e){
    if(e.target.classList.contains('coin')){
        addBalance(randomInt(1,5));
        e.target.remove();
    }
})

//time to spawn the coin with upper and lower bound
setInterval(()=>{
    spawncoin();
},randomInt(5000,10000));