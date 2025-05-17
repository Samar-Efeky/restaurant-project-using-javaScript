
export let allRecipes = [];
const sliderTrack = document.querySelector(".slider-track");
const circle = document.getElementById("circle");
const mainImage = document.getElementById("mainImage");
let rotation = 0;

export const getAllRecipes = async (item) => {
  try {
    const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${item}`);
    const data = await res.json();

    allRecipes = data.recipes.slice(10, 30).map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * 41) + 10,
      query: item,
    }));

    displayAllRecipes();
    updateMainImage(allRecipes[0]);

  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

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
