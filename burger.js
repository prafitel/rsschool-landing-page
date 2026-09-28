const burgerMenuBtn = document.querySelector('.burger__menu');
const body = document.body;
const navLinks = document.querySelectorAll('.nav__link');

const toggleMenu = () => {
  const isOpen = body.classList.toggle('body_menu-open');

  if (isOpen) {
    window.addEventListener('keydown', handleEscClose);
  } else {
    window.removeEventListener('keydown', handleEscClose);
  }
}

const closeMenu = () => {
  if (body.classList.contains('body_menu-open')) {
    body.classList.remove('body_menu-open');
    window.removeEventListener('keydown', handleEscClose);
  }
}

const handleEscClose = (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
}

if (burgerMenuBtn) {
  burgerMenuBtn.addEventListener('click', toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 769) {
    closeMenu();
  }
});
