// Import necessary modules: recipes logic and cart UI functions
import { allRecipes, getAllRecipes } from "./header.module.js";
import { shadowCart, updateCartCount } from "./navbar.module.js";

// Initialize cart from localStorage or default to empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/**
 * Displays dynamic sections based on selected category link.
 * Handles content rendering, tab switching, and cart interaction.
 */
export function categoriesSection() {
  const sections = document.querySelectorAll(".about-content"); // All content sections
  const links = document.querySelectorAll(".links a"); // Category navigation links

  // Save current cart state to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Add selected recipe to cart, prevent duplicates
  function addToCart(recipe) {
    const mealExists = cart.find(item => item.recipe_id === recipe.recipe_id);
    if (!mealExists) {
      cart.push(recipe);
      saveCart();
    } else {
      alert("Meal is already in cart.");
    }
  }

  /**
   * Show specific category section and hide others
   * @param {string} sectionId - ID of the section to show
   * @param {Element} clickedLink - The clicked link element for styling
   */
  async function showSection(sectionId, clickedLink) {
    // Toggle visibility of each section based on selection
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.remove("d-none");
        section.classList.add("d-block", "show");
      } else {
        section.classList.remove("d-block", "show");
        section.classList.add("d-none");
      }
    });

    // Update active state for navigation links
    links.forEach(link => link.classList.remove("active"));
    clickedLink.classList.add("active");

    // Fetch recipes from API/storage and render UI
    await getAllRecipes(sectionId);
    displayRecipeLink(sectionId);
  }

  /**
   * Render recipe cards dynamically for selected category
   * @param {string} sectionId - ID of the current active category
   */
  function displayRecipeLink(sectionId) {
    const container = document.querySelector(".category-content .row");
    if (!container) return;

    container.innerHTML = ""; // Clear previous content

    // Loop through recipes and create their HTML elements
    allRecipes.slice(0, 6).forEach(recipe => {
      const div = document.createElement("div");
      div.className = "col-xl-4 col-md-6 col-12 p-lg-3 p-2";

      div.innerHTML = `
        <div class="recipe-content h-100 p-3">
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

      // Navigate to recipe details page on image click
      const img = div.querySelector("img");
      if (img) {
        img.addEventListener("click", () => {
          window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${sectionId}`;
        });
      }

      // Navigate to recipe details page on title click
      const title = div.querySelector(".recipe-link");
      if (title) {
        title.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${sectionId}`;
        });
      }

      // Handle add-to-cart button click
      div.querySelector(".add-cart-btn").addEventListener("click", () => {
        addToCart(recipe);
        updateCartCount(); // Update count in the navbar
        shadowCart(); // Show cart icon effect
      });

      container.appendChild(div);
    });
  }

  // Bind click event for each category link
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = e.target.getAttribute("href").replace("#", "");
      showSection(sectionId, e.target);
    });
  });

  // Load and display the first category section by default
  if (links.length > 0) {
    const firstLink = links[0];
    const sectionId = firstLink.getAttribute("href").replace("#", "");
    showSection(sectionId, firstLink);
  }
}
