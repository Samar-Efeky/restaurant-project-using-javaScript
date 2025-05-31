import { shadowCart, updateCartCount } from "./navbar.module.js";

// Main function to display recipe details and related recipes
export async function recipeDetails() {
  // Extract recipe ID and type from URL
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");
  const recipeType = urlParams.get("q");

  // Get the cart from localStorage or initialize a new one
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Save the updated cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Add a recipe to the cart
  function addToCart(recipe, quantity) {
    const mealExists = cart.find(item => item.recipe_id === recipe.recipe_id);
    if (!mealExists) {
      cart.push({ ...recipe, quantity });
      saveCart();
    } else {
      alert("Meal is already in cart.");
    }
  }

  // Display selected recipe details
  if (recipeId) {
    const res = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${recipeId}`);
    const data = await res.json();
    const recipe = data.recipe;

    // Generate a random price for the meal
    recipe.price = Math.floor(Math.random() * (100 - 5 + 1)) + 5;

    const container = document.querySelector(".meal-details");
    if (!container) return;

    // Render recipe content inside the container
    container.innerHTML = `
      <div class="col-xl-5 p-3">
        <div class="image-meal-details">
          <img src="${recipe.image_url}" class="w-100" alt="${recipe.title}">
        </div>
      </div>
      <div class="col-xl-7 p-3">
        <div class="meal-details-content">
          <h2 class="fw-bold">${recipe.title}</h2>
          <div class="stars-icons py-2">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <h4 class="py-2 fw-bolder">${recipe.price}$</h4>
          <div class="quantity-wrapper">
            <label class="fw-bold" for="quantity">QUANTITY:</label>
            <div class="quantity-box">
              <button class="qty-btn" id="decrease-btn">-</button>
              <span id="quantity">1</span>
              <button class="qty-btn" id="increase-btn">+</button>
            </div>
          </div>
          <ul class="py-1 fw-bold list-unstyled">
            ${recipe.ingredients.map(ing => `<li class="py-2">${ing}</li>`).join('')}
          </ul>
          <button class="px-4 py-2 add-cart-btn">Add to cart</button>
        </div>
      </div>`;

    // Quantity control
    let quantity = 2;
    const quantitySpan = container.querySelector("#quantity");
    const increaseBtn = container.querySelector("#increase-btn");
    const decreaseBtn = container.querySelector("#decrease-btn");

    increaseBtn.addEventListener("click", () => {
      quantity++;
      quantitySpan.textContent = quantity;
    });

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
      }
    });

    // Handle add to cart button click
    container.querySelector(".add-cart-btn").addEventListener("click", () => {
      addToCart(recipe, quantity);
      updateCartCount(); // Update the cart count on the navbar
      shadowCart(); // Show cart animation or popup
    });
  }

  // Fetch related recipes by type for the slider
  const relatedRes = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${recipeType}`);
  const relatedData = await relatedRes.json();
  const relatedRecipes = relatedData.recipes
    .filter(r => r.recipe_id !== recipeId)
    .slice(0, 10)
    .map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * (100 - 5 + 1)) + 5,
    }));

  const swiperWrapper = document.querySelector(".swiper-wrapper");

  // Render related recipes in Swiper slider
  if (swiperWrapper) {
    relatedRecipes.forEach(recipe => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.innerHTML = `
        <div class="recipe-content p-3">
          <img class="w-100" src="${recipe.image_url}" alt="${recipe.title}">
          <a class="py-2 recipe-link" href="#">${recipe.title.split(" ").slice(0, 2).join(" ")}</a>
          <div class="stars-icons">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <h4 class="py-2 fw-bolder">${recipe.price}$</h4>
          <button class="px-4 py-2 add-cart-btn">Add to cart</button>
        </div>`;

      // Redirect to meal details page when clicking image or title
      slide.querySelector("img").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipeType}`;
      });

      slide.querySelector("a").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipeType}`;
      });
       // Handle add to cart button click
    slide.querySelector(".add-cart-btn").addEventListener("click", () => {
      addToCart(recipe,1);
      updateCartCount(); // Update the cart count on the navbar
      shadowCart(); // Show cart animation or popup
    });
      swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper.js slider
    if (typeof Swiper !== "undefined") {
      new Swiper(".swiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3000,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          950: { slidesPerView: 3 },
          1300: { slidesPerView: 4 },
        },
      });
    }
  }
}
