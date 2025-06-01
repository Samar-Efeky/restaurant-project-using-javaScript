// Import utility functions to update cart count and visual shadow effect
import { shadowCart, updateCartCount } from "./navbar.module.js";

// Main function to display and manage cart content
export function displayCart() {
  const cartContainer = document.querySelector(".table-cart"); // Table body where cart items will be rendered
  const totalPrice = document.getElementById("total-price"); // Element to display the total cart price
  const updateCartBtn = document.getElementById("update-cart"); // Button to clear the entire cart
  const checkoutBtn=document.getElementById("subtotal-cart");  // Button checkout in cart 
  // Get cart data from localStorage or initialize as empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Helper function to update localStorage whenever the cart changes
  function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Calculate and update the total price displayed in the UI
  function updateTotalPrice() {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (totalPrice) totalPrice.textContent = `${total}$`;
  }

  // Function to render the entire cart UI
  function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = ""; // Clear previous cart content

    // Show or hide the "Clear Cart" button based on cart length
    if (updateCartBtn) updateCartBtn.style.display = cart.length === 0 ? "none" : "inline-block";

    // Handle empty cart state
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">Your cart is empty.</td>
        </tr>
      `;
      if (totalPrice) totalPrice.textContent = "0$";
      return;
    }

    // Loop through each cart item and generate its row
    cart.forEach((item, index) => {
      // Ensure quantity exists (default to 1)
      if (!item.quantity) item.quantity = 1;

      const subtotal = item.price * item.quantity;

      // Create table row for item
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="cart-image px-2">
          <img src="${item.image_url}" alt="${item.title}" style="cursor:pointer"/>
        </td>
        <td class="pt-4">
          <p style="cursor:pointer">${item.title.split(" ").slice(0, 2).join(" ")}</p>
        </td>
        <td class="pt-4">${item.price}$</td>
        <td>
          <div class="quantity-box cart-quantity mt-2">
            <button class="qty-btn decrease-btn">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="qty-btn increase-btn">+</button>
          </div>
        </td>
        <td class="pt-4 subtotal">${subtotal}$</td>
        <td class="p-4">
          <i class="fa-solid fa-xmark remove-btn" style="cursor:pointer"></i>
        </td>
      `;

      // Navigate to meal details page when clicking image or title
      row.querySelector("img").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${item.recipe_id}&q=${item.category}`;
      });
      row.querySelector("p").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `meal.details.html?id=${item.recipe_id}&q=${item.category}`;
      });

      // Remove item from cart
      row.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        updateLocalStorage();
        updateCartCount(); // Update cart badge or counter
        shadowCart(); // Visual cart indicator
        renderCart(); // Re-render updated cart
      });

      // Increase item quantity
      row.querySelector(".increase-btn").addEventListener("click", () => {
        cart[index].quantity += 1;
        updateLocalStorage();
        updateCartCount();
        shadowCart();
        renderCart();
      });

      // Decrease item quantity (minimum is 1)
      row.querySelector(".decrease-btn").addEventListener("click", () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
          updateLocalStorage();
          updateCartCount();
          shadowCart();
          renderCart();
        }
      });

      // Append the constructed row to the cart container
      cartContainer.appendChild(row);
    });

    // Update total price after all items rendered
    updateTotalPrice();
  }

  // Listen for click on "Clear Cart" button
  if (updateCartBtn) {
    updateCartBtn.addEventListener("click", () => {
      cart = [];
      updateLocalStorage();
      updateCartCount();
      shadowCart();
      renderCart();
    });
  }

  // Initial cart render on page load
  renderCart();
  // Check if the checkout button exists
  if(checkoutBtn){
    // Add a click event listener to the checkout button
    checkoutBtn.addEventListener("click",()=>{
      // Redirect the user to the order.html page
      window.location.href='order.html';
    });
  };
}
