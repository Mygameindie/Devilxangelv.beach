// Array of JSON file paths
const jsonFiles = [
    // Bottom underwear
    'bottomunderwear1.json', 'bottomunderwear2.json',

    // Top underwear
    'topunderwear1.json', 'topunderwear2.json',

    // Boxers
    'boxers1.json', 'boxers2.json',

    // Sweatshirts
    'sweatshirt1.json', 'sweatshirt2.json',

    // Shoes
    'shoes1.json', 'shoes2.json',

    // Pants
    'pants1.json', 'pants2.json',
	
	// Skirts
    'skirt1.json', 'skirt2.json',

    // Tops
    'top1.json', 'top2.json',

    // Dresses
    'dress1.json', 'dress2.json',

    // Jackets
    'jacket1.json', 'jacket2.json',

    // Accessories
    'accessories1.json', 'accessories2.json',

    // Hats
    'hat1.json', 'hat2.json'
];

// Helper function to set z-index for categories
function getZIndex(categoryName) {
    const zIndexMap = {
        bottomunderwear: 2, 		topunderwear: 3, 		boxer: 4, 		sweatshirt: 5, 		shoe: 6,         pants: 8,         skirt: 9,         top: 10,         dress: 11,         jacket: 12,         accessories: 13,         hat: 14,
    };

    // Return a default value if not found
    return zIndexMap[categoryName] || 0;
}

// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
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
            const categoryName = file.replace('.json', '');
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
                img.style.position = 'absolute'; // Ensure z-index applies
                img.style.zIndex = getZIndex(categoryName); // Apply z-index dynamically
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

// Toggle visibility of item images, ensuring mutual exclusivity
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
        if (categoryName === 'dress1') {
            // Hide items related to number 1 when wearing dress1
            hideSpecificCategories(['top1', 'pants1', 'skirt1', 'sweatshirt1']);
        } else if (categoryName === 'dress2') {
            // Hide items related to number 2 when wearing dress2
            hideSpecificCategories(['top2', 'pants2', 'skirt2', 'sweatshirt2']);
        } else if (categoryName.startsWith('top1') || categoryName.startsWith('pants1') || categoryName.startsWith('skirt1') || categoryName.startsWith('sweatshirt1')) {
            // Hide dress1 if any item from group 1 is selected
            hideSpecificCategories(['dress1']);
        } else if (categoryName.startsWith('top2') || categoryName.startsWith('pants2') || categoryName.startsWith('skirt2') || categoryName.startsWith('sweatshirt2')) {
            // Hide dress2 if any item from group 2 is selected
            hideSpecificCategories(['dress2']);
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
// Adjust canvas layout dynamically for responsive design
function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    const screenWidth = window.innerWidth;

    if (screenWidth <= 600) {
        baseContainer.style.display = 'flex';
        baseContainer.style.flexDirection = 'column';
        baseContainer.style.width = '90%';
        baseContainer.style.height = 'auto';
        controlsContainer.style.flexWrap = 'wrap';
    } else {
        baseContainer.style.display = 'block';
        baseContainer.style.width = '500px';
        baseContainer.style.height = '400px';
        controlsContainer.style.flexWrap = 'nowrap';
    }
}

// Apply layout adjustment on load and resize
window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
};

window.addEventListener('resize', adjustCanvasLayout);
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