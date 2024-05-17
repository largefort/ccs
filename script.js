let taxRate = 10; // Initial tax rate per house
let taxAmount = 0; // Initial tax amount
let houseCost = 50; // Cost to add a new house
let taxUpgradeCost = 100; // Cost to upgrade tax rate
let collectionSpeedUpgradeCost = 200; // Cost to upgrade collection speed
let collectionInterval = 1000; // Initial tax collection interval (ms)
let lastCollectionTime = 0; // Last time taxes were collected

const cityElement = document.getElementById('city');
const taxAmountElement = document.getElementById('tax-amount');
const addHouseButton = document.getElementById('add-house');
const upgradeTaxButton = document.getElementById('upgrade-tax');
const upgradeCollectionButton = document.getElementById('upgrade-collection');

// Load game state from localStorage
function loadGameState() {
    const savedState = JSON.parse(localStorage.getItem('gameState'));
    if (savedState) {
        taxRate = savedState.taxRate || taxRate;
        taxAmount = savedState.taxAmount || taxAmount;
        houseCost = savedState.houseCost || houseCost;
        taxUpgradeCost = savedState.taxUpgradeCost || taxUpgradeCost;
        collectionSpeedUpgradeCost = savedState.collectionSpeedUpgradeCost || collectionSpeedUpgradeCost;
        collectionInterval = savedState.collectionInterval || collectionInterval;

        // Recreate houses
        if (savedState.houses && savedState.houses.length > 0) {
            savedState.houses.forEach(() => createHouse());
        }
        updateTaxCounter();
    }
}

// Save game state to localStorage
function saveGameState() {
    const gameState = {
        taxRate,
        taxAmount,
        houseCost,
        taxUpgradeCost,
        collectionSpeedUpgradeCost,
        collectionInterval,
        houses: Array.from(document.querySelectorAll('.house')).map(() => ({}))
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

// Function to create houses
function createHouse() {
    const house = document.createElement('div');
    house.className = 'house';
    cityElement.appendChild(house);

    const dollarSign = document.createElement('div');
    dollarSign.className = 'dollar-sign';
    dollarSign.innerText = `$${taxRate}`;
    house.appendChild(dollarSign);
}

// Function to simulate tax collection
function collectTaxes() {
    const currentTime = performance.now();
    if (currentTime - lastCollectionTime >= collectionInterval) {
        const houses = document.querySelectorAll('.house');
        houses.forEach((house, index) => {
            const dollarSign = house.querySelector('.dollar-sign');
            setTimeout(() => {
                house.style.backgroundColor = '#90EE90'; // Light green
                dollarSign.style.top = '50px';
                dollarSign.style.opacity = '1';
                setTimeout(() => {
                    house.style.backgroundColor = '#ADD8E6'; // Light blue
                    dollarSign.style.top = '-20px';
                    dollarSign.style.opacity = '0';
                    taxAmount += taxRate;
                    updateTaxCounter();
                    saveGameState();
                }, 500);
            }, index * collectionInterval / houses.length);
        });
        lastCollectionTime = currentTime;
    }
}

// Function to update the tax counter
function updateTaxCounter() {
    taxAmountElement.innerText = taxAmount;
}

// Function to add a new house
function addHouse() {
    if (taxAmount >= houseCost) {
        taxAmount -= houseCost;
        createHouse();
        updateTaxCounter();
        saveGameState();
    } else {
        alert('Not enough funds to add a house!');
    }
}

// Function to upgrade tax rate
function upgradeTaxRate() {
    if (taxAmount >= taxUpgradeCost) {
        taxAmount -= taxUpgradeCost;
        taxRate += 5; // Increase tax rate
        updateTaxCounter();
        saveGameState();
        // Update dollar sign text for all houses
        document.querySelectorAll('.house .dollar-sign').forEach(sign => {
            sign.innerText = `$${taxRate}`;
        });
    } else {
        alert('Not enough funds to upgrade tax rate!');
    }
}

// Function to upgrade collection speed
function upgradeCollectionSpeed() {
    if (taxAmount >= collectionSpeedUpgradeCost) {
        taxAmount -= collectionSpeedUpgradeCost;
        collectionInterval = Math.max(500, collectionInterval - 100); // Increase speed by reducing interval
        updateTaxCounter();
        saveGameState();
    } else {
        alert('Not enough funds to upgrade collection speed!');
    }
}

// Game loop using requestAnimationFrame for smooth performance
function gameLoop() {
    collectTaxes(); // Collect taxes based on the interval
    requestAnimationFrame(gameLoop);
}

// Event listeners for buttons
addHouseButton.addEventListener('click', addHouse);
upgradeTaxButton.addEventListener('click', upgradeTaxRate);
upgradeCollectionButton.addEventListener('click', upgradeCollectionSpeed);

// Load game state on page load
loadGameState();

// Create initial houses if none are loaded
if (cityElement.children.length === 0) {
    for (let i = 0; i < 10; i++) {
        createHouse();
    }
    saveGameState();
}

// Start the game loop
requestAnimationFrame(gameLoop);
