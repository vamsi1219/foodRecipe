const url = 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'aea7819c52msh2057957da71cf21p1899a8jsndb2a86843663',
        'x-rapidapi-host': 'tasty.p.rapidapi.com'
    }
};

let recipes = [];

// Function to fetch recipes
async function fetchRecipes() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        recipes = result.results;
        populateSelectOptions(); // Call this function after fetching recipes
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to populate select options with recipe names
function populateSelectOptions() {
    const foodSelect = document.getElementById('food');
    foodSelect.innerHTML = ''; // Clear any existing options

    recipes.forEach(recipe => {
        if (recipe.name) {
            const option = document.createElement('option');
            option.value = recipe.id; // Use recipe.id or another unique identifier
            option.textContent = recipe.name;
            foodSelect.appendChild(option);
        }
    });

    // Add an event listener to the select element
    foodSelect.addEventListener('change', (event) => {
        const selectedRecipeId = event.target.value;
        const selectedRecipe = recipes.find(recipe => recipe.id == selectedRecipeId);
        if (selectedRecipe) {
            displayRecipeDetails(selectedRecipe); // Call method to display recipe details
        }
    });
}


// Function to display recipe details
function displayRecipeDetails(recipe) {
    const recipeDetailsContainer = document.getElementById('recipeDetails');
    recipeDetailsContainer.innerHTML = '';

    if (recipe) {
        const img = document.createElement('img');
        img.src = recipe.thumbnail_url;
        img.alt = recipe.name || 'Recipe Image';
        img.classList.add('detailsImg');
        img.style.borderRadius = '8px';
        const div1 = document.createElement('div');
        div1.classList.add('detailsImg-div');
        div1.appendChild(img);

        // Create and append recipe details
        const recipeCard = document.createElement('div');
        recipeCard.className = 'card mb-3';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = recipe.name;

        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = recipe.description || 'No description available';

        const a = document.createElement('a');
        a.innerText = "Read More";
        a.href = "#";
        a.addEventListener('click', (event) => {
            event.preventDefault();

            // Display instructions
            const instructionDiv = document.getElementById('instruction');
            instructionDiv.innerHTML = '';

            if (recipe.instructions) {
                const ul = document.createElement('ul');
                const loHead = document.createElement('li');
                loHead.innerText = recipe.name;
                loHead.className = 'instruction-heading'; // Apply style class
                ul.appendChild(loHead);

                recipe.instructions.forEach((instruction, index) => {
                    const li = document.createElement('li');
                    li.innerText = `${index + 1}. ${instruction.display_text}`;
                    li.className = 'instruction-item'; // Apply style class
                    ul.appendChild(li);
                });

                instructionDiv.appendChild(ul);
                instructionDiv.style.display = 'block'; // Show the instruction div

                // Create close button
                const closeButton = document.createElement('button');
                closeButton.innerText = 'Close';
                closeButton.className = 'btn btn-danger'; // Style as a danger button
                closeButton.addEventListener('click', () => {
                    instructionDiv.style.display = 'none'; // Hide the instruction div
                });
                instructionDiv.appendChild(closeButton);
            } else {
                instructionDiv.innerText = 'No instructions available.';
                instructionDiv.style.display = 'block'; // Show the instruction div
            }
        });
        description.appendChild(a);

        cardBody.appendChild(div1);
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        recipeCard.appendChild(cardBody);
        recipeDetailsContainer.appendChild(recipeCard);
    }
}

// Function to display recipes in a grid
function displayRecipes() {
    const recipeImageContainer = document.getElementById('recipeImage');
    recipeImageContainer.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row';

    recipes.forEach((recipe, index) => {
        if (recipe.thumbnail_url && recipe.name) {
            const img = document.createElement('img');
            img.src = recipe.thumbnail_url;
            img.alt = recipe.name || 'Recipe Image';
            img.className = 'img-fluid';

            // Create a container for the image and title
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // Create and style the image title
            const imageTitle = document.createElement('div');
            imageTitle.className = 'image-title';
            imageTitle.textContent = recipe.name;

            imageContainer.appendChild(img);
            imageContainer.appendChild(imageTitle);

            imageContainer.classList.add('recipe-card');
            imageContainer.dataset.recipeIndex = index;

            // Create a div to contain the image container
            const col = document.createElement('div');
            col.classList.add('col-md-6', 'mb-3');
            col.appendChild(imageContainer);

            // Add click event listener
            imageContainer.addEventListener('click', () => {
                const index = imageContainer.dataset.recipeIndex;
                displayRecipeDetails(recipes[index]);
            });

            row.appendChild(col);

            // Add row to the container every 2 items
            if ((index + 1) % 2 === 0) {
                recipeImageContainer.appendChild(row);
                row.className = 'row'; // Reset row class for the next set of images
            }
        }
    });
}

// Initialize the application
async function init() {
    await fetchRecipes();
    displayRecipes();
}

// Call the init function to fetch recipes and display them
init();

// Add event listener to the select element
document.getElementById('food').addEventListener('change', (event) => {
    const selectedRecipeId = event.target.value;
    const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId);
    if (selectedRecipe) {
        displayRecipeDetails(selectedRecipe);
    }
});

// Search input event listeners
const searchInput = document.querySelector('.search-results'); // Ensure this selector matches your HTML
const searchResultsContainer = document.getElementById('searchResults'); // Ensure this ID matches your HTML

searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    if (query) {
        displaySearchResults(query);
    } else {
        searchResultsContainer.style.display = 'none';
    }
});

searchInput.addEventListener('focus', () => {
    const query = searchInput.value;
    if (query) {
        displaySearchResults(query);
    }
    searchResultsContainer.style.display = 'block';
});

// Hide search results when clicking outside
document.addEventListener('click', (event) => {
    if (!searchInput.contains(event.target) && !searchResultsContainer.contains(event.target)) {
        searchResultsContainer.style.display = 'none';
    }
});
