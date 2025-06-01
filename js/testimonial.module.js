export function testimonial(){
    const swiper = new Swiper('.testimonial-swiper', {
        loop: true,
        grabCursor: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        effect: 'slide',
      });
      
}    