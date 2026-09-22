const themeContainer = document.querySelector('.header__theme');
const lightItem = document.querySelector('.header__theme-item_light');
const darkItem = document.querySelector('.header__theme-item_dark');

const enableDarkTheme = () => {
  document.documentElement.classList.add('theme__dark');
  localStorage.setItem('theme', 'dark');
  lightItem.classList.remove('header__theme_active');
  darkItem.classList.add('header__theme_active');
};

const disableDarkTheme = () => {
  document.documentElement.classList.remove('theme__dark');
  localStorage.setItem('theme', 'light');
  darkItem.classList.remove('header__theme_active');
  lightItem.classList.add('header__theme_active');
};

let savedTheme = localStorage.getItem('theme');

if (!savedTheme) {
  localStorage.setItem('theme', 'light');
  savedTheme = 'light';
}


if (savedTheme === 'dark') {
  enableDarkTheme();
} else {
  disableDarkTheme();
}

if (themeContainer) {
  themeContainer.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
      disableDarkTheme();
    } else {
      enableDarkTheme();
    }
  });
}
