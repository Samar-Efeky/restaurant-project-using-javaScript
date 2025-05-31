import { shadowCart, updateCartCount } from "./navbar.module.js";

// Function to display the cart contents
export function displayCart() {
  const cartContainer = document.querySelector(".table-cart"); // Select the container where the cart items will be displayed
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve the cart from localStorage, or initialize it as an empty array if not found

  // Function to update the localStorage whenever the cart changes
  function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart back to localStorage
  }

  // Function to render the cart items on the page
  function renderCart() {
    if (!cartContainer) return; // Ensure the cart container exists before rendering

    cartContainer.innerHTML = ""; // Clear the container before re-rendering

    // If the cart is empty, display a message
    if (cart.length === 0) {
      cartContainer.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Your cart is empty.</td></tr>`;
      return;
    }

    // Loop through each item in the cart and create a row for it
    cart.forEach((item, index) => {
      // Check if the item has a quantity, and default it to 1 if not
      if (!item.quantity) item.quantity = 1;

      const subtotal = item.price * item.quantity; // Calculate the subtotal for the item (price * quantity)

      // Create a new row for the cart item
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="cart-image px-2">
          <img src="${item.image_url}" alt="${item.title}" style="cursor:pointer"/>
        </td>
        <td class="pt-4"><p style="cursor:pointer">${item.title.split(" ").slice(0, 2).join(" ")}</p></td>
        <td class="pt-4">${item.price}$</td>
        <td>
          <div class="quantity-box cart-quantity mt-2">
            <button class="qty-btn decrease-btn">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="qty-btn increase-btn">+</button>
          </div>
        </td>
        <td class="pt-4 subtotal">${subtotal}$</td>
        <td class="p-4"><i class="fa-solid fa-xmark remove-btn" style="cursor:pointer"></i></td>
      `;

      // Event listener to navigate to the product details page when the image is clicked
      row.querySelector("img").addEventListener("click", () => {
        window.location.href = `meal.details.html?id=${item.recipe_id}&q=${item.category}`;
      });

      // Event listener to navigate to the product details page when the title is clicked
      row.querySelector("p").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default behavior
        window.location.href = `meal.details.html?id=${item.recipe_id}&q=${item.category}`;
      });

      // Event listener to remove the item from the cart when the "remove" button is clicked
      row.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(index, 1); // Remove the item from the cart array
        updateLocalStorage(); // Update the cart in localStorage
        updateCartCount(); // Update the cart item count in the navbar
        renderCart(); // Re-render the cart
        shadowCart(); // Update the cart shadow (cart preview)
      });

      // Event listener to increase the quantity of the item when the "+" button is clicked
      row.querySelector(".increase-btn").addEventListener("click", () => {
        cart[index].quantity += 1; // Increase the quantity by 1
        updateLocalStorage(); // Update the cart in localStorage
        updateCartCount(); // Update the cart item count in the navbar
        renderCart(); // Re-render the cart
        shadowCart(); // Update the cart shadow (cart preview)
      });

      // Event listener to decrease the quantity of the item when the "-" button is clicked
      row.querySelector(".decrease-btn").addEventListener("click", () => {
        // Ensure that the quantity does not go below 1
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1; // Decrease the quantity by 1
          updateLocalStorage(); // Update the cart in localStorage
          updateCartCount(); // Update the cart item count in the navbar
          renderCart(); // Re-render the cart
          shadowCart(); // Update the cart shadow (cart preview)
        }
      });

      cartContainer.appendChild(row); // Append the row to the cart container
    });
  }

  renderCart(); // Call the renderCart function to display the cart
}
