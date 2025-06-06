// Exporting an empty array to hold all recipes
export let allRecipes = [];

// DOM elements
const sliderTrack = document.querySelector(".slider-track");
const circle = document.getElementById("circle");
const mainImage = document.getElementById("mainImage");
const headerSearch = document.getElementById("header-search");
const searchResults = document.getElementById("searchResults");

// Initialize rotation angle for image transition effect
let rotation = 0;

// Cache object to store fetched recipes for each search query
const recipeCache = {};

/**
 * Fetches recipes based on the provided item (query),
 * uses cache if available, otherwise fetches from API,
 * processes and displays recipes.
 */
export const getAllRecipes = async (item) => {
   const loading = document.querySelector(".loading");
    loading.classList.replace("d-none", "d-flex");
  try {
    // Use cached recipes if available
    if (recipeCache[item]) {
      allRecipes = [...recipeCache[item]];
      displayAllRecipes();
      updateMainImage(allRecipes[0]);
      return;
    }

    // Fetch recipes from Forkify API
    const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${item}`);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json().finally(()=>{
      loading.classList.replace("d-flex", "d-none");
    document.body.style.overflow = 'auto';
    });

    // Validate the response structure
    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error("No recipes data found");
    }

    // Add price and query to each recipe, then store in cache
    allRecipes = data.recipes.map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * (100 - 5 + 1)) + 5, // Random price between 5 and 100
      query: item,
    }));
    recipeCache[item] = [...allRecipes];

    // Render recipes in the slider and update the main image
    displayAllRecipes();
    updateMainImage(allRecipes[0]);

  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

// Fetch default recipes on initial load
getAllRecipes("pizza");

/**
 * Updates the main image with the selected recipe's data.
 */
function updateMainImage(recipe) {
  if (!mainImage || !recipe) return;

  mainImage.src = recipe.image_url;
  mainImage.dataset.price = recipe.price;
  mainImage.dataset.recipeId = recipe.recipe_id;
  mainImage.dataset.query = recipe.query;
}

/**
 * Displays all recipes inside the slider.
 * Adds image click functionality with rotation animation.
 */
function displayAllRecipes() {
  if (!sliderTrack) return;
  sliderTrack.innerHTML = "";

  const sliderContent1 = document.createElement("div");
  const sliderContent2 = document.createElement("div");
  sliderContent1.classList.add("slider-content");
  sliderContent2.classList.add("slider-content");

  allRecipes.forEach(recipe => {
    // Function to create an image element for each recipe
    const createImage = () => {
      const img = document.createElement("img");
      img.src = recipe.image_url;
      img.alt = "recipe image";

      // Rotate circle and update main image on click
      img.addEventListener("click", () => {
        rotation += 360;
        circle.style.setProperty("--rotation", `${rotation}deg`);
        setTimeout(() => updateMainImage(recipe), 300);
      });

      return img;
    };

    // Duplicate content for slider loop effect
    sliderContent1.appendChild(createImage());
    sliderContent2.appendChild(createImage());
  });

  // Append slider content to track
  sliderTrack.appendChild(sliderContent1);
  sliderTrack.appendChild(sliderContent2);
}

// Handle click on main image to navigate to details page
if (mainImage) {
  mainImage.addEventListener("click", () => {
    const recipeId = mainImage.dataset.recipeId;
    const q = mainImage.dataset.query;
    if (recipeId && q) {
      window.location.href = `meal.details.html?id=${recipeId}&q=${q}`;
    }
  });

  // Setup live search functionality
  if (headerSearch && searchResults) {
    headerSearch.addEventListener("input", () => {
      const query = headerSearch.value.toLowerCase().trim();
      searchResults.innerHTML = "";

      if (!query) return;

      // Filter recipes by search query
      const filteredRecipes = allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(query)
      );

      // Render matching recipes as search suggestions
      filteredRecipes.forEach(recipe => {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.style.cursor = "pointer";
        li.textContent = recipe.title;

        // Navigate to recipe details on click
        li.addEventListener("click", () => {
          window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipe.query}`;
          headerSearch.value = "";
          searchResults.innerHTML = "";
        });

        searchResults.appendChild(li);
      });
    });
  }
}
