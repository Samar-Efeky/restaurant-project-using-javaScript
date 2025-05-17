import { allRecipes, getAllRecipes } from "./header.module.js";

export function categoriesSection() {
  const sections = document.querySelectorAll(".about-content");
  const links = document.querySelectorAll(".links a");

  async function showSection(sectionId, clickedLink) {
    sections.forEach(section => {
      if (section.id === sectionId) {
        section.classList.remove("d-none");
        section.classList.add("d-block", "show");
      } else {
        section.classList.remove("d-block", "show");
        section.classList.add("d-none");
      }
    });

    links.forEach(link => link.classList.remove("active"));
    clickedLink.classList.add("active");

    await getAllRecipes(sectionId);
    displayRecipeLink(sectionId);
  }

  function displayRecipeLink(sectionId) {
    const container = document.querySelector(".category-content .row");
    if (!container) return;

    container.innerHTML = "";

    allRecipes.slice(0, 9).forEach(recipe => {
      const div = document.createElement("div");
      div.classList.add("col-xl-4", "col-md-6", "col-12", "p-lg-3", "p-2");
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
          <button class="px-4 py-2">Add to cart</button>
        </div>`;

      // Add event listeners to image and title
      div.querySelector("img").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${sectionId}`;
      });

      div.querySelector(".recipe-link").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${sectionId}`;
      });

      container.appendChild(div);
    });
  }

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = e.target.getAttribute("href").replace("#", "");
      showSection(sectionId, e.target);
    });
  });

  if (links.length > 0) {
    const firstLink = links[0];
    const sectionId = firstLink.getAttribute("href").replace("#", "");
    showSection(sectionId, firstLink);
  }
}
