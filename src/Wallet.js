let currentMoney = 0;

export function initWallet(startAmount = 0) {
    currentMoney = startAmount;
    currentBalance();
}

export function getBalance() {
    return currentMoney;
}

export function currentBalance() {
    let wallet = document.getElementById('walletBalance');
    if (!wallet) {
        wallet = document.createElement('div');
        wallet.className = 'wallet';
        wallet.id = 'walletBalance'
        wallet.textContent = `$${currentMoney.toFixed(2)}`;
        document.getElementById('game-container').appendChild(wallet);
    } else {
        wallet.textContent = `$${currentMoney.toFixed(2)}`;
    }

}

export function addBalance(amount = 2) {
    currentMoney += amount;
    currentBalance();
}

export function deductBalance(amount) {
    if (currentMoney >= amount) {
        currentMoney -= amount;
        currentBalance();
        return true;
    }
    return false;
}

export function displayBalance() {
    const wallet = document.getElementById('walletBalance');
    wallet.style.display = 'block'
}

export function hideBalance() {
    const wallet = document.getElementById('walletBalance');
    wallet.style.display = 'none'
}

initWallet(500);