// Array of JSON file paths in the specified order
const jsonFiles = [
   'Socks2.json', 'BottomBikini1.json', 'BottomBikini2.json',
    'TopBikini1.json',
    'OnePiece1.json',
    'Short1.json', 'Short2.json',
    'Skirt1.json',
	'Dress1.json',
    'Hat1.json', 'Hat2.json',
    'Jacket1.json', 'Jacket2.json'
];

// Helper function to set z-index for categories
function getZIndex(categoryName) {
    const zIndexMap = {
        bottombikini1: 1, // Bottom bikini layer
        bottombikini2: 1, // Same as bottom bikini
        topbikini1: 2,    // Top bikini layer
        onepiece1: 3,     // One-piece swimsuit layer
        short1: 4,        // Shorts layer
        short2: 4,        // Same layer for different shorts
        skirt1: 5,        // Skirt layer (higher than shorts)
        socks2: 6,        // Socks layer
		dress1: 7,
        jacket1: 8,       // Jacket layer
        jacket2: 8,       // Same as other jackets
        hat1: 9,          // Hat layer (always on top)
        hat2: 9           // Same as other hats
    };

    if (!zIndexMap[categoryName]) {
        console.warn(`Z-index for category "${categoryName}" is not defined. Defaulting to 0.`);
    }
    return zIndexMap[categoryName] || 0;
}

// Load each JSON file and create buttons and items
async function loadItems() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    for (const file of jsonFiles) {
        const data = await loadItemFile(file);
        const categoryName = file.replace('.json', '').toLowerCase();

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category');

        const categoryHeading = document.createElement('h3');
        categoryHeading.textContent = categoryName;
        categoryContainer.appendChild(categoryHeading);

        data.forEach(item => {
            const itemId = `${item.id}.png`;

            // Add item image
            const img = document.createElement('img');
            img.id = itemId;
            img.src = item.src;
            img.alt = item.alt;
            img.classList.add(categoryName);
            img.style.visibility = item.visibility === 'visible' ? 'visible' : 'hidden';
            img.style.position = 'absolute';
            img.style.zIndex = getZIndex(categoryName);
            baseContainer.appendChild(img);

            // Add button for the item
            const button = document.createElement('img');
            const buttonFile = item.src.replace('.png', 'b.png'); // Add 'b' to filename
            button.src = buttonFile;
            button.alt = `${item.alt} Button`;
            button.classList.add('item-button');
            button.onclick = () => toggleVisibility(itemId, categoryName);
            categoryContainer.appendChild(button);
        });

        controlsContainer.appendChild(categoryContainer);
    }
}

// Load items in batches to reduce load time and improve responsiveness
async function loadItemsInBatches(batchSize = 5) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    
    for (let i = 0; i < jsonFiles.length; i += batchSize) {
        const batch = jsonFiles.slice(i, i + batchSize);

        await Promise.all(batch.map(async file => {
            const data = await loadItemFile(file);
            const categoryName = file.replace('.json', '').toLowerCase();
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = categoryName;
            categoryContainer.appendChild(categoryHeading);

            data.forEach(item => {
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file);
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                img.style.position = 'absolute';
                img.style.zIndex = getZIndex(categoryName);
                baseContainer.appendChild(img);

                const button = document.createElement('img');
                const buttonFile = item.src.replace('.png', 'b.png');
                button.src = buttonFile;
                button.alt = item.alt + ' Button';
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(itemId, categoryName);
                categoryContainer.appendChild(button);
            });

            controlsContainer.appendChild(categoryContainer);
        }));

        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Toggle visibility of item images, ensuring mutual exclusivity between bikini and one-piece
function toggleVisibility(itemId, categoryName) {
    const categoryItems = document.querySelectorAll(`.${categoryName}`);
    categoryItems.forEach(item => {
        if (item.id !== itemId) {
            item.style.visibility = 'hidden';
        }
    });

    const selectedItem = document.getElementById(itemId);
    selectedItem.style.visibility = selectedItem.style.visibility === 'visible' ? 'hidden' : 'visible';

   if (selectedItem.style.visibility === 'visible') {
    if (['topbikini1', 'bottombikini1'].includes(categoryName)) {
        // Hide one-piece items when bikini items are selected
        hideSpecificCategories(['onepiece1']);
    } else if (categoryName === 'onepiece1') {
        // Hide bikini items when a one-piece is selected
        hideSpecificCategories(['topbikini1', 'bottombikini1']);
    } else if (categoryName === 'dress1') {
        // Hide short and skirt when dress is selected
        hideSpecificCategories(['short1', 'skirt1']);
    } else if (['short1', 'skirt1'].includes(categoryName)) {
        // Hide dress when short or skirt is selected
        hideSpecificCategories(['dress1']);
    }
}
}

// Helper function to hide items for specific categories
function hideSpecificCategories(categories) {
    categories.forEach(category => {
        const items = document.querySelectorAll(`.${category}`);
        items.forEach(item => {
            item.style.visibility = 'hidden';
        });
    });
}

// Adjust canvas layout dynamically for responsive design on smaller screens
function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    const screenWidth = window.innerWidth;

    if (screenWidth <= 600) {
        baseContainer.style.display = 'flex';
        baseContainer.style.flexWrap = 'nowrap';
        baseContainer.style.justifyContent = 'space-between';
    } else {
        baseContainer.style.display = 'block';
        baseContainer.style.width = '500px';
        baseContainer.style.height = '400px';
        controlsContainer.style.marginTop = 'auto';
    }
}

// Apply layout adjustment on load and resize
window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
};

window.addEventListener('resize', adjustCanvasLayout);

// Function to enter game mode
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}

// Load items from a JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`Failed to load ${file}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading file ${file}:`, error);
        return [];
    }
}