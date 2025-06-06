import { shadowCart, updateCartCount } from "./navbar.module.js";

// Global variables for menu logic
let allMeals = []; // All fetched meals
let filteredCategories = []; // Selected filters
let categoryCache = {}; // Cache to avoid redundant API calls
let currentPage = 1; // For pagination
const itemsPerPage = 9; // Meals per page
let maxPrice = 100; // Default max price
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from local storage or set empty

// DOM elements for filter controls
let closeFilter = document.getElementById("close-filter");
let filterIcon = document.getElementById("filter-icon");
let filterMenu = document.querySelector(".filter-menu");
export function menuSection() {
   // DOM elements needed in this section
  const slider = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const container = document.querySelector(".menu-meals .row");
  const paginationList = document.querySelector(".pagination");
  const filterText = document.querySelector(".filter-text");
  const categoryLinks = document.querySelectorAll(".filter-menu a");
  const inputSearch = document.getElementById("inputSearch");
  const errorDiv = document.getElementById("error");

  let currentMeals = [];  // Currently displayed meals
  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  // Add a meal to the cart if it's not already added
  function addToCart(recipe) {
    const mealExists = cart.find(item => item.recipe_id === recipe.recipe_id);
    if (!mealExists) {
      cart.push(recipe);
      saveCart();
    } else {
      alert("Meal is already in cart.");
    }
  }
  // Fetch meals from Forkify API and cache them by category
  async function getAllMenu(query) {
     const loading = document.querySelector(".loading");
    loading.classList.replace("d-none", "d-flex");
    if (categoryCache[query]) return categoryCache[query];

    const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
    const data = await res.json().finally(()=>{
      loading.classList.replace("d-flex", "d-none");
    document.body.style.overflow = 'auto';
    });
    const recipes = data.recipes.map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * (100 - 5 + 1)) + 5,   // Generate random price
      category: query,
    }));
    categoryCache[query] = recipes;
    return recipes;
  }
  // Render meals to the DOM based on current filters and pagination
  function displayMeals(meals = null) {
    if (!container) return;
    container.innerHTML = "";
    let mealsToDisplay = meals ?? [...allMeals];
    // Apply category and price filters if no specific meals passed
    if (!meals) {
      if (filteredCategories.length > 0) {
        mealsToDisplay = mealsToDisplay.filter(meal =>
          filteredCategories.some(cat => meal.title.toLowerCase().includes(cat))
        );
      }
      mealsToDisplay = mealsToDisplay.filter(meal => meal.price <= maxPrice);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      currentMeals = mealsToDisplay.slice(startIndex, endIndex);
    } else {
      currentMeals = mealsToDisplay;
    }
     // Show "No results" if empty
    if (currentMeals.length === 0) {
      container.innerHTML = `<div class="text-center text-danger fw-bold py-5">No meals found for current filters!</div>`;
      return;
    }
    // Create meal cards
    currentMeals.forEach(recipe => {
      const div = document.createElement("div");
      div.classList.add("col-xl-4", "col-md-6", "col-12", "p-md-4", "p-sm-5", "p-2");
      div.innerHTML = `
        <div class="recipe-content w-100 h-100 p-3">
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

      div.querySelector("img").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipe.category}`;
      });

      div.querySelector(".recipe-link").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipe.category}`;
      });

      div.querySelector(".add-cart-btn").addEventListener("click", () => {
        addToCart(recipe);
        updateCartCount();
        shadowCart();
      });

      container.appendChild(div);
    });
  }
  // Generate pagination based on filtered meals
  function setupPagination() {
    if (!paginationList) return;
    paginationList.innerHTML = "";
    let mealsToPaginate = [...allMeals];
    // Apply category and price filters before paginating
    if (filteredCategories.length > 0) {
      mealsToPaginate = mealsToPaginate.filter(meal =>
        filteredCategories.some(cat => meal.title.toLowerCase().includes(cat))
      );
    }

    mealsToPaginate = mealsToPaginate.filter(meal => meal.price <= maxPrice);
    const totalPages = Math.ceil(mealsToPaginate.length / itemsPerPage);
    // Generate a pagination button
    function createPageItem(page) {
      const li = document.createElement("li");
      li.className = `page-item ${currentPage === page ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage = page;
        displayMeals();
        setupPagination();
        scrollToSection();
      });
      return li;
    }
     // Previous button
    const prev = document.createElement("li");
    prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
    prev.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        displayMeals();
        setupPagination();
        scrollToSection();
      }
    });
    paginationList.appendChild(prev);

    paginationList.appendChild(createPageItem(1));
    if (currentPage > 3) paginationList.appendChild(createDots());
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) paginationList.appendChild(createPageItem(i));
    }
    if (currentPage < totalPages - 2) paginationList.appendChild(createDots());
    if (totalPages > 1) paginationList.appendChild(createPageItem(totalPages));
     // Next button
    const next = document.createElement("li");
    next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
    next.innerHTML = `<a class="page-link" href="#">Next</a>`;
    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        displayMeals();
        setupPagination();
        scrollToSection();
      }
    });
    paginationList.appendChild(next);
  }
   // Create pagination ellipses (...)
  function createDots() {
    const dots = document.createElement("li");
    dots.className = "page-item disabled";
    dots.innerHTML = `<a class="page-link">...</a>`;
    return dots;
  }
   // Scroll to menu section when pagination changes
  function scrollToSection() {
    const section = document.querySelector(".menu-section");
    if (section) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }
  }
   // Update selected filters UI (category tags)
  function updateFilterContentUI() {
    if (filterText) {
      filterText.innerHTML = "";
      filteredCategories.forEach(category => {
        const span = document.createElement("span");
        span.className = "filter-content py-1 px-2 m-2";
        span.innerHTML = `${category}<i class="fa-solid fa-xmark ps-2"></i>`;
        span.querySelector("i").addEventListener("click", () => {
          filteredCategories = filteredCategories.filter(cat => cat !== category);
          currentPage = 1;
          displayMeals();
          setupPagination();
          updateFilterContentUI();
        });
        filterText.appendChild(span);
      });
    }
  }
  // Handle price range slider
  if (slider && priceValue) {
    priceValue.textContent = slider.value;
    slider.addEventListener("input", () => {
      maxPrice = parseInt(slider.value);
      priceValue.textContent = slider.value;
      currentPage = 1;
      displayMeals();
      setupPagination();
    });
  }
   // Handle category links (sidebar filter)
  categoryLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      filterMenu.style.left = "-100%";
      const category = link.textContent.trim().toLowerCase();
      if (!filteredCategories.includes(category)) {
        if (!categoryCache[category]) {
          const meals = await getAllMenu(category);
          allMeals.push(...meals);
        }
        filteredCategories.push(category);
        currentPage = 1;
        updateFilterContentUI();
        displayMeals();
        setupPagination();
      }
    });
  });
 // Open/close sidebar filter
  if (filterIcon) {
    filterIcon.addEventListener("click", () => {
      filterMenu.style.left = "0%";
    });
  }

  if (closeFilter) {
    closeFilter.addEventListener("click", () => {
      filterMenu.style.left = "-100%";
    });
  }
  // Search functionality
  if (inputSearch) {
    inputSearch.addEventListener("keyup", () => {
      const value = inputSearch.value.trim().toLowerCase();
      const matchedMeals = allMeals.filter(meal =>
        meal.title.toLowerCase().includes(value)
      );
      if (value === "") {
        displayMeals();
        setupPagination();
        errorDiv.classList.add("d-none");
        return;
      }
      if (matchedMeals.length === 0) {
        errorDiv.textContent = "Meal not found!";
        errorDiv.classList.remove("d-none");
        container.innerHTML = "";
        return;
      }
      displayMeals(matchedMeals);
      setupPagination();
      errorDiv.classList.add("d-none");
    });
  }
   // Get category from URL (deep linking support)
  function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category")?.toLowerCase() || null;
}
// If URL has category, apply it as default filter
 const urlCategory = getCategoryFromURL();
  if (urlCategory && !filteredCategories.includes(urlCategory)) {
    filteredCategories.push(urlCategory);
  }
  // Initial load of meals after filters
  (async () => {
    if (filteredCategories.length > 0) {
      for (const cat of filteredCategories) {
        if (!categoryCache[cat]) {
          const meals = await getAllMenu(cat);
          allMeals.push(...meals);
        }
      }
    } else {
      if (!categoryCache["pizza"]) {
        const meals = await getAllMenu("pizza");
        allMeals.push(...meals);
      }
    }
    displayMeals();
    setupPagination();
    updateFilterContentUI();
  })();
}
