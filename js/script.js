
import { categoriesSection } from "./categories.module.js";
import { getAllRecipes} from "./header.module.js";
import { navbar, updateCartCount } from "./navbar.module.js";
import { setupObserver } from "./observer.module.js";
import { recipeDetails } from "./meal.details.js";
import { menuSection } from "./menu.module.js";
import { displayCart } from "./cart.module.js";
import { deliverySection } from './deliverySection.module.js';
import { testimonial } from "./testimonial.module.js";
document.addEventListener("DOMContentLoaded", () => {
     fetch("navbar.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("navbar").innerHTML = data; 
       navbar();
       updateCartCount();
    });  
    getAllRecipes("pizza");
    setupObserver();
    categoriesSection();
    if (window.location.pathname.includes("meal.details.html")) {
      recipeDetails();
    };
    deliverySection();
    displayCart();
    menuSection();
    testimonial();
    fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
      let currentYear=new Date().getFullYear();
      document.querySelector(".copy-right-year").innerHTML=currentYear;
      scrollToPageTop();
      setupObserver();
     
  });  
 function scrollToPageTop() {
  const scrollBtn = document.querySelector(".scroll-top");

  // عند الضغط على الزر
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // عند التمرير
  window.addEventListener("scroll", () => {
    if (window.scrollY >= 600) {
      scrollBtn.style.display = "block";
    } else {
      scrollBtn.style.display = "none";
    }
  });
}


});