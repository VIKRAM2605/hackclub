export function currentBalance(balance = 0) {
    let wallet = document.getElementById('walletBalance');
    if (!wallet) {
        const wallet = document.createElement('div');
        wallet.className = 'wallet';
        wallet.id = 'walletBalance'
        wallet.textContent = `$${balance.toFixed(2)}`;
        document.body.appendChild(wallet);
    }else{
        wallet.textContent=`$${balance.toFixed(2)}`;
    }

}

export function addBalance(amount=2) {
    const wallet = document.getElementById('walletBalance');
    const balanceFloat = parseFloat(wallet.textContent.replace('$', ""));
    const formattedBalanceFloat = balanceFloat + amount;
    console.log(formattedBalanceFloat);
    currentBalance(formattedBalanceFloat)
}

currentBalance();
addBalance()

export function displayBalance(){
    const wallet = document.getElementById('walletBalance');
    wallet.style.display='block'
}

export function hideBalance(){
    const wallet = document.getElementById('walletBalance');
    wallet.style.display='none'
}