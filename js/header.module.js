export const headerImage = () => {
  const sliderTrack = document.querySelector(".slider-track");
  const circle = document.getElementById("circle");
  const mainImage = document.getElementById("mainImage");
  let modelBody=document.querySelector(".modal-body");
  let allRecipes = [];
  let currentIndex=0;
  let rotation = 0;
  let currentRecipeId = null; 
  const getAllRecipes = async (item) => {
      const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${item}`);
      const data = await res.json();
      allRecipes = data.recipes.slice(0, 20).map(recipe => ({
      ...recipe,
      price: Math.floor(Math.random() * 41) + 10 
    }));
      displayAllRecipes();
      if (allRecipes.length > 0) {
        mainImage.src = allRecipes[0].image_url;
        mainImage.dataset.price = allRecipes[0].price;
      };
      mainImage.addEventListener("click",()=>{
        const currentRecipe = allRecipes.find(recipe => recipe.image_url === mainImage.src);
        if(currentRecipe){
          modelBody.innerHTML=`
          <img class="w-75" height="300" src="${currentRecipe.image_url}" alt="${currentRecipe.title}">
          <h2 class="py-2">${currentRecipe.title}</h2>
          <h5 class="fw-bold">Price: ${currentRecipe.price}$</h5>`;
        }
       
      })
  };

  const displayAllRecipes = () => {
    sliderTrack.innerHTML = "";
    const sliderContent1 = document.createElement("div");
    sliderContent1.classList.add("slider-content");

    const sliderContent2 = document.createElement("div");
    sliderContent2.classList.add("slider-content");

    allRecipes.forEach(recipe => {
      const img1 = document.createElement("img");
      img1.src = recipe.image_url;
      img1.alt = "recipe image";

      const img2 = document.createElement("img");
      img2.src = recipe.image_url;
      img2.alt = "recipe image";
      [img1, img2].forEach(image => {
        image.addEventListener("click", (e) => {
          currentIndex=allRecipes.indexOf(e.target);
          rotation += 360;
          circle.style.setProperty("--rotation", `${rotation}deg`);

          setTimeout(() => {
            mainImage.src = image.src;
            currentRecipeId = recipe.recipe_id;
            mainImage.dataset.price = recipe.price;
          }, 300);
        });
      });
      sliderContent1.appendChild(img1);
      sliderContent2.appendChild(img2);
    });

    // أضف المحتوى للمسار
    sliderTrack.appendChild(sliderContent1);
    sliderTrack.appendChild(sliderContent2);
  };
  getAllRecipes("pizza");
};
