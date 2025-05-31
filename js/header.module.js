export let allRecipes = [];

const sliderTrack = document.querySelector(".slider-track");
const circle = document.getElementById("circle");
const mainImage = document.getElementById("mainImage");
let rotation = 0;
const recipeCache = {};

export const getAllRecipes = async (item) => {
  try {
    if (recipeCache[item]) {
      allRecipes = [...recipeCache[item]];
      displayAllRecipes();
      updateMainImage(allRecipes[0]);
      return;
    }

    const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${item}`);

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();

    if (!data.recipes || !Array.isArray(data.recipes)) {
      throw new Error("No recipes data found");
    }

    allRecipes = data.recipes.map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * (100 - 5 + 1)) + 5,
      query: item,
    }));
    recipeCache[item] = [...allRecipes];

    displayAllRecipes();
    updateMainImage(allRecipes[0]);

  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

getAllRecipes("pizza");

function updateMainImage(recipe) {
  if (!mainImage || !recipe) return;

  mainImage.src = recipe.image_url;
  mainImage.dataset.price = recipe.price;
  mainImage.dataset.recipeId = recipe.recipe_id;
  mainImage.dataset.query = recipe.query;
}

function displayAllRecipes() {
  if (!sliderTrack) return;
  sliderTrack.innerHTML = "";

  const sliderContent1 = document.createElement("div");
  const sliderContent2 = document.createElement("div");
  sliderContent1.classList.add("slider-content");
  sliderContent2.classList.add("slider-content");

  allRecipes.forEach(recipe => {
    const createImage = () => {
      const img = document.createElement("img");
      img.src = recipe.image_url;
      img.alt = "recipe image";

      img.addEventListener("click", () => {
        rotation += 360;
        circle.style.setProperty("--rotation", `${rotation}deg`);
        setTimeout(() => updateMainImage(recipe), 300);
      });

      return img;
    };

    sliderContent1.appendChild(createImage());
    sliderContent2.appendChild(createImage());
  });

  sliderTrack.appendChild(sliderContent1);
  sliderTrack.appendChild(sliderContent2);
}

if (mainImage) {
  mainImage.addEventListener("click", () => {
    const recipeId = mainImage.dataset.recipeId;
    const q = mainImage.dataset.query;
    if (recipeId && q) {
      window.location.href = `meal.details.html?id=${recipeId}&q=${q}`;
    }
  });
}
