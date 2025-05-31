import { allRecipes, getAllRecipes } from "./header.module.js";
import { shadowCart, updateCartCount } from "./navbar.module.js";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
export function categoriesSection() {
  const sections = document.querySelectorAll(".about-content");
  const links = document.querySelectorAll(".links a");
   function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function addToCart(recipe) {
    const mealExists = cart.find(item => item.recipe_id === recipe.recipe_id);
    if (!mealExists) {
      cart.push(recipe);
      saveCart();
    } else {
      alert("Meal is already in cart.");
    }
  }
  async function showSection(sectionId, clickedLink) {
    // إظهار القسم المطلوب وإخفاء الباقي
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.remove("d-none");
        section.classList.add("d-block", "show");
      } else {
        section.classList.remove("d-block", "show");
        section.classList.add("d-none");
      }
    });

    // تحديث الرابط النشط
    links.forEach(link => link.classList.remove("active"));
    clickedLink.classList.add("active");

    // استدعاء البيانات وعرضها
    await getAllRecipes(sectionId);
    displayRecipeLink(sectionId);
  }

  function displayRecipeLink(sectionId) {
    const container = document.querySelector(".category-content .row");
    if (!container) return;

    container.innerHTML = "";

    allRecipes.slice(0, 9).forEach(recipe => {
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

      // الانتقال لصفحة التفاصيل عند الضغط
      const img = div.querySelector("img");
      const title = div.querySelector(".recipe-link");

      if (img) {
        img.addEventListener("click", () => {
          window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${sectionId}`;
        });
      }

      if (title) {
        title.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${sectionId}`;
        });
      }
      div.querySelector(".add-cart-btn").addEventListener("click", () => {
              addToCart(recipe);
              updateCartCount();
              shadowCart();
      });

      container.appendChild(div);
    });
  }

  // ربط الروابط بالأقسام
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = e.target.getAttribute("href").replace("#", "");
      showSection(sectionId, e.target);
    });
  });

  // عرض القسم الأول عند بداية الصفحة
  if (links.length > 0) {
    const firstLink = links[0];
    const sectionId = firstLink.getAttribute("href").replace("#", "");
    showSection(sectionId, firstLink);
  }
}
