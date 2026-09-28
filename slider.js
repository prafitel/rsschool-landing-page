const track = document.querySelector('.slider__track');
const slides = document.querySelectorAll('.slider__item');
const nextBtn = document.querySelector('[data-action="next"]');
const prevBtn = document.querySelector('[data-action="prev"]');
const paginationItems = document.querySelectorAll('[data-slide]');

let currentIndex = 0;
const maxIndex = slides.length - 1;

const updateSlider = () => {
  if (!track || slides.length === 0) {
    return;
  }

  const slideWidth = slides[0].clientWidth;

  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  paginationItems.forEach((item) => {
    const slideIndex = parseInt(item.getAttribute('data-slide'), 10);

    if (slideIndex === currentIndex) {
      item.classList.add('pagination__item_active');
    } else {
      item.classList.remove('pagination__item_active');
    }
  });
}

const showNextSlide = () => {
  if (currentIndex < maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }

  updateSlider();
}

const showPrevSlide = () => {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = maxIndex;
  }
  
  updateSlider();
}

if (nextBtn) {
  nextBtn.addEventListener('click', showNextSlide);
}

if (prevBtn) {
  prevBtn.addEventListener('click', showPrevSlide);
}

paginationItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    currentIndex = parseInt(event.target.getAttribute('data-slide'), 10);
    updateSlider();
  });
});

window.addEventListener('resize', () => {
  track.style.transition = 'none';
  updateSlider();

  setTimeout(() => {
    track.style.transition = '';
  }, 50);
});

