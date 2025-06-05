//========================= NAVIGATION BAR FUNCTIONALITY =========================//

// Main navigation logic
export function navbar() {
    let navbarList = document.querySelector(".icons .fa-bars");
    let closedNavbar = document.querySelector(".icons .fa-xmark");
    let sidebarIcon = document.getElementById("list-navbar");
    let closeSidebar = document.getElementById("close-side-bar");
    let sidebar = document.querySelector(".side-bar");
    let navbar = document.querySelector(".navbar-links");
    let linkNavbar = document.querySelectorAll(".navbar-links a");
    const mediaQuery = window.matchMedia("(max-width: 950px)");

    //================== HANDLE ACTIVE STATE FOR NAV LINKS ==================//
    
    // Remove 'active' class from all links
    function removeActiveClass() {
        linkNavbar.forEach(link => link.classList.remove("active"));
    };

    // Add click event for each link
    linkNavbar.forEach((link) => {
        link.addEventListener("click", (e) => {
            if (window.innerWidth <= 950) {
                navbar.style.display = "none";
                closedNavbar.style.display = "none";
                navbarList.style.display = "block";
            }
            setLinkActive();
            removeActiveClass();
            e.target.classList.add("active");
        });
    });

    // Detect current page and set the appropriate link as active
    function setLinkActive() {
        linkNavbar.forEach((link) => {
            let currentUrl = location.pathname.split("/").pop().replace("/", "");
            console.log(currentUrl);

            if (
                link.getAttribute("href") === currentUrl ||
                link.getAttribute("href") === currentUrl + location.hash
            ) {
                link.classList.add("active");
            }
            else if (
                link.getAttribute("href") === "index.html#home-page" &&
                (currentUrl === "index.html" || currentUrl === "") &&
                location.hash === ""
            ) {
                link.classList.add("active");
            }
        });
    }

    // Set active link on page load
    setLinkActive();

    //================== RESPONSIVE NAVIGATION BEHAVIOR ==================//

    // Toggle nav visibility on screen resize
    mediaQuery.addEventListener("change", (e) => {
        if (!e.matches) {
            navbar.style.display = "flex";
            navbarList.style.display = "none";
            closedNavbar.style.display = "none";
        } else {
            navbar.style.display = "none";
            navbarList.style.display = "block";
            closedNavbar.style.display = "none";
        }
    });

    // Show navigation links when menu icon is clicked
    navbarList.addEventListener("click", () => {
        navbar.style.display = "block";
        navbarList.style.display = "none";
        closedNavbar.style.display = "block";
    });

    // Hide navigation when close icon is clicked
    closedNavbar.addEventListener("click", () => {
        navbar.style.display = "none";
        navbarList.style.display = "block";
        closedNavbar.style.display = "none";
    });

    //================== SIDEBAR FUNCTIONALITY ==================//

    // Open sidebar
    sidebarIcon.addEventListener("click", () => {
        sidebar.style.right = "0%";
    });

    // Close sidebar
    closeSidebar.addEventListener("click", () => {
        sidebar.style.right = "-100%";
    });
}

//========================= CART COUNT FUNCTION =========================//

// Updates the cart icon count based on items in localStorage
export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countSpan = document.getElementById("cart-count");
    if (!countSpan) return;

    let totalQuantity = 0;

    // Calculate total items in cart
    cart.forEach(item => {
        totalQuantity += item.quantity || 1;
    });

    // Update cart count UI
    countSpan.textContent = totalQuantity;
}

//========================= CART ANIMATION FUNCTION =========================//

// Adds a temporary animation when the cart is updated
export function shadowCart() {
    const countSpan = document.getElementById("cart-count");
    countSpan.classList.add("cart-count-animation");

    setTimeout(() => {
        countSpan.classList.remove("cart-count-animation");
    }, 1000);
}
