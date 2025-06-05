//========================= MODULE IMPORTS =========================//
// Import individual section modules to modularize and organize the app logic
import { categoriesSection } from "./categories.module.js";
import { getAllRecipes } from "./header.module.js";
import { navbar, updateCartCount } from "./navbar.module.js";
import { setupObserver } from "./observer.module.js";
import { recipeDetails } from "./meal.details.js";
import { menuSection } from "./menu.module.js";
import { displayCart } from "./cart.module.js";
import { deliverySection } from './deliverySection.module.js';
import { testimonial } from "./testimonial.module.js";

//========================= PAGE LOADING =========================//
// Remove loading animation once the page is fully loaded
window.addEventListener('load', () => {
  const loading = document.querySelector(".loading");
  loading.classList.replace("d-flex", "d-none");
  document.body.style.overflow = 'auto';
});

//========================= DOM READY =========================//
document.addEventListener("DOMContentLoaded", () => {
  
  //================== NAVBAR SECTION ==================//
  // Fetch and insert the navbar HTML, then initialize related behavior
  fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
      navbar(); // Initialize navbar toggle and active link logic
      updateCartCount(); // Update the shopping cart item count
    });

  //================== INITIAL FETCH ==================//
  getAllRecipes("pizza"); // Load initial recipes (pizza category)

  //================== OBSERVER SECTION ==================//
  setupObserver(); // Animate sections when they come into view

  //================== CATEGORIES SECTION ==================//
  categoriesSection(); // Display recipe categories

  //================== RECIPE DETAILS PAGE ==================//
  if (window.location.pathname.includes("meal.details.html")) {
    recipeDetails(); // Load dynamic meal details if on the detail page
  }

  //================== TESTIMONIAL SECTION ==================//
  if (window.location.pathname.includes("meal.details.html") || window.location.pathname.includes("index.html")) {
    testimonial(); // Initialize testimonial swiper on relevant pages
  }

  //================== DELIVERY SECTION ==================//
  deliverySection(); // Display delivery info/features section

  //================== CART DISPLAY ==================//
  displayCart(); // Render cart content if needed

  //================== MENU SECTION ==================//
  menuSection(); // Load and render the menu section

  //================== FOOTER SECTION ==================//
  // Load and insert footer HTML and initialize scroll-to-top functionality
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;

      // Set the current year dynamically
      const currentYear = new Date().getFullYear();
      document.querySelector(".copy-right-year").innerHTML = currentYear;

      // Scroll to top button logic
      scrollToPageTop();

      // Re-initialize observer (in case footer has show-section elements)
      setupObserver();
    });

  //================== SCROLL TO TOP ==================//
  function scrollToPageTop() {
    const scrollBtn = document.querySelector(".scroll-top");

    // Scroll smoothly to top when the button is clicked
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    // Show/hide the scroll button based on scroll position
    window.addEventListener("scroll", () => {
      scrollBtn.style.display = window.scrollY >= 600 ? "block" : "none";
    });
  }

});
