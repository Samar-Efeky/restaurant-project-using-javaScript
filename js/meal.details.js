export async function recipeDetails(){
     const urlParams = new URLSearchParams(window.location.search);
     const recipeId = urlParams.get("id");
     const recipeType = urlParams.get("q");
     if(recipeId){
        const res = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${recipeId}`);
        const data = await res.json();
        const recipe = data.recipe;
        const container = document.querySelector(".meal-details");
        if (!container) return; 
        container.innerHTML=`
                <div class="col-xl-5 p-3">
                    <div class="image-meal-details">
                        <img src="${recipe.image_url}" class="w-100" alt="${recipe.title}">
                    </div>
                </div>
                <div class="col-xl-7 p-3 ">
                     <div class=" meal-details-content">
                        <h2 class="fw-bold">${recipe.title}</h2>
                        <div class="stars-icons py-2">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <h4 class="py-2 fw-bolder">${Math.floor(Math.random() * 41) + 10}$</h4>
                        <ul class="py-1 fw-bold list-unstyled">
                            ${recipe.ingredients.map(ing => `<li class="py-2">${ing}</li>`).join('')}
                        </ul>
                        <button class="px-4 py-2">Add to cart</button>
                    </div>
                </div>`;
    };
    // 🟣 Fetch other recipes of the same type
  const relatedRes = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${recipeType}`);
  const relatedData = await relatedRes.json();
  const relatedRecipes = relatedData.recipes
    .filter(r => r.recipe_id !== recipeId)
    .slice(0, 10)
    .map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * 41) + 10,
    }));

  // 🟣 Display in Swiper slider (you must have Swiper initialized in HTML)
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  if (swiperWrapper) {
    swiperWrapper.innerHTML = "";
    relatedRecipes.forEach(recipe => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.innerHTML = `
       <div class="recipe-content  p-3">
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
      slide.querySelector("img").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipeType}`;
      });
      slide.querySelector("a").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${recipe.recipe_id}&q=${recipeType}`;
      });
      swiperWrapper.appendChild(slide);
    });

    // ✅ Reinitialize swiper if needed (optional)
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
          0:{slidesPerView: 1},
          600: { slidesPerView: 2 },
          950: { slidesPerView: 3 },
          1300: { slidesPerView: 4 },
        },
      });
    }
  }
    
}