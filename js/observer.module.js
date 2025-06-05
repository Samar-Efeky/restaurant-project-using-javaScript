//========================= SECTION REVEAL ON SCROLL =========================//

// This function sets up the IntersectionObserver to reveal sections
// when they are at least 30% visible in the viewport.
export function setupObserver() {
  // Select all elements with the 'show-section' class
  const sectionView = document.querySelectorAll(".show-section");

  // Create a new IntersectionObserver
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Check if the element is at least 30% visible
      if (entry.intersectionRatio >= 0.3) {
        // Add 'show' class to trigger animation or visibility
        entry.target.classList.add('show');

        // Stop observing this element after it's revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3 // Trigger when 30% of the element is in view
  });

  // Attach observer to each target section
  sectionView.forEach(section => {
    observer.observe(section);
  });
}

