export function deliverySection(){
  // Select the delivery section and the image inside it
const deliverySection = document.getElementById('deliverySection');
const deliveryImg = document.querySelector('.delivery-img');

// Store the previous scroll position to detect scroll direction
let lastScrollTop = window.pageYOffset;

window.addEventListener('scroll', () => {
  if(deliverySection&&deliveryImg){
    // Get the position of the delivery section relative to the viewport
  const sectionRect = deliverySection.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const currentScrollTop = window.pageYOffset;

  // Check if the section is visible in the viewport
  if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
    // Determine the scroll direction: down or up
    const directionDown = currentScrollTop > lastScrollTop;

    // Calculate how much to move the image horizontally
    const moveX = (windowHeight - sectionRect.top) * 0.2;

    if (directionDown) {
      // If scrolling down, move image to the right
      deliveryImg.style.transform = `translateX(${moveX}px)`;
    } else {
      // If scrolling up, move image to the left
      deliveryImg.style.transform = `translateX(${-moveX}px)`;
    }
  } else {
    // If section is not visible, reset image position
    deliveryImg.style.transform = `translateX(0px)`;
  }

  // Update the last scroll position (prevent negative values)
  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }
});
}