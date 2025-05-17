export function setupObserver() {
  const sectionView = document.querySelectorAll(".show-section");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.3) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3 
  });

  sectionView.forEach(section => {
    observer.observe(section);
  });
}
