//========================= TESTIMONIAL SWIPER INITIALIZATION =========================//

// This function initializes a Swiper instance for the testimonial section.
// It creates a looped carousel with autoplay, pagination, and smooth slide transitions.
export function testimonial() {
  const swiper = new Swiper('.testimonial-swiper', {
    loop: true, // Enables continuous loop mode
    grabCursor: true, // Shows a grab cursor when hovering the swiper

    // Autoplay settings
    autoplay: {
      delay: 5000, // Time between slides in milliseconds
      disableOnInteraction: false // Continue autoplay after user interaction
    },

    // Pagination settings
    pagination: {
      el: '.swiper-pagination', // Target pagination container
      clickable: true // Allows users to click on pagination bullets
    },

    // Transition effect between slides
    effect: 'slide' // Options include: 'slide', 'fade', 'cube', etc.
  });
}
