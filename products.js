import products from './products.json' with { type: 'json' };


const COFFEE_CATEGORY = 'coffee';
const DEFAULT_CATEGORY = COFFEE_CATEGORY;
const ESCAPE_KEY = 'Escape';
const QUANTITY_CARDS = 4;

const categories = document.querySelectorAll('.categories');
const productItemsWrapper = document.querySelector('.categories__list');
const modalWindow = document.querySelector('.modal');
const loadMoreBtn = document.querySelector('.categories__load');

let activeCategory = DEFAULT_CATEGORY;
let isPaginationExpanded = false;

const getProductsByActiveCategory = (category) => products.filter((item) => item.category === category);

const getProductItemByName = (productName) =>
  products.find(({ name }) => name === productName);

const insertProductsByCategory = (category) => {
  const productsByActiveCategory = getProductsByActiveCategory(category);
  const isMobileLayout = window.innerWidth <= 768;

  productItemsWrapper.replaceChildren();

  const limit =
    isMobileLayout && !isPaginationExpanded
      ? QUANTITY_CARDS
      : productsByActiveCategory.length;
  const productsToRender = productsByActiveCategory.slice(0, limit);

  productsToRender.forEach((item) => {
    productItemsWrapper.innerHTML += `
      <div class="categories__card">
        <img src="${item.src}" alt="${item.name}" class="categories__preview">
        <div class="categories__info">
          <h2 class="categories__title">${item.name}</h2>
          <p class="categories__description">${item.description}</p>
          <span class="categories__price">${item.price}</span>
        </div>
      </div>
    `;
  });

  if (
    isMobileLayout &&
    productsByActiveCategory.length > QUANTITY_CARDS &&
    !isPaginationExpanded
  ) {
    loadMoreBtn.style.display = 'flex';
  } else {
    loadMoreBtn.style.display = 'none';
  }
};

const renderModal = (cardItem) => {
  document.querySelector('.modal__content').innerHTML = `
    <div class="product">
      <div class="product__preview">
        <img src="${cardItem.src}" alt="${cardItem.name}" class="product__preview-img">
      </div>
      <div class="product__info">
        <h3 class="product__title">${cardItem.name}</h3>
        <p class="product__description">${cardItem.description}</p>

        <div class="product__size-wrapper">
          <span class="product__size-title">Size</span>
          <div class="product__size-btns">
            <button type="button" class="product__btn product__size-btn product__size-btn_active" data-mark="S" data-price="${cardItem.sizes.s['add-price']}">${cardItem.sizes.s.size}</button>
            <button type="button" class="product__btn product__size-btn" data-mark="M" data-price="${cardItem.sizes.m['add-price']}">${cardItem.sizes.m.size}</button>
            <button type="button" class="product__btn product__size-btn" data-mark="L" data-price="${cardItem.sizes.l['add-price']}">${cardItem.sizes.l.size}</button>
          </div>
        </div>

        <div class="product__additives-wrapper">
          <span class="product__additives-title">Additives</span>
          <div class="product__additives-btns">
            ${cardItem.additives
              .map((item, index) => {
                return (
                  '<button type="button" class="product__btn product__additives-btn" data-price="' +
                  item['add-price'] +
                  '" data-mark="' +
                  (index + 1) +
                  '">' +
                  item.name +
                  '</button>'
                );
              })
              .join('')}
          </div>
        </div>

        <div class="product__prize-wrapper">
          <span class="product__prize-total">Total:</span>
          <span class="product__prize" data-price="${cardItem.price}">${cardItem.price}</span>
        </div>

        <p class="product__attention">
          The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
        </p>

        <button type="button" class="product__modal-close">Close</button>
      </div>
    </div>
  `;
};

insertProductsByCategory(DEFAULT_CATEGORY);

const handleCloseModalByKey = (event) => {
  if (event.key === ESCAPE_KEY) {
    closeModal();
  }
}

const closeModal = () => {
  document.querySelector('.modal').classList.remove('modal_active');
  document.body.classList.remove('body__modal');

  window.removeEventListener('keydown', handleCloseModalByKey);
};

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    isPaginationExpanded = true;

    insertProductsByCategory(activeCategory);
  });
}

categories?.[0].addEventListener('click', (event) => {
  const clickedCategory =
    event.target.closest('.categories__item');

  const clickedCategoryValue = clickedCategory?.dataset.category;

  if (clickedCategoryValue && activeCategory !== clickedCategoryValue) {
    activeCategory = clickedCategoryValue;
    isPaginationExpanded = false;

    productItemsWrapper.replaceChildren();

    insertProductsByCategory(activeCategory);

    document
      .querySelector('.categories__item_active')
      .classList.remove('categories__item_active');

    clickedCategory.classList.add('categories__item_active');
  }  
});

window.addEventListener('resize', () => {
  insertProductsByCategory(activeCategory);
});

productItemsWrapper.addEventListener('click', (event) => {
  const clickedCard = event.target.closest('.categories__card');

  if (clickedCard) {
    const cardName = clickedCard.querySelector('.categories__title').textContent;
    const productItem = getProductItemByName(cardName);

    document.body.classList.add('body__modal');

    renderModal(productItem);

    document.querySelector('.modal').classList.add('modal_active');

    window.addEventListener('keydown', handleCloseModalByKey);
  }
});

modalWindow.addEventListener('click', (event) => {
  const clickedBtnClose = event.target.closest('.product__modal-close');

  if (
    clickedBtnClose ||
    event.target === modalWindow
  ) {
    closeModal();

    return;
  }

  const clickedSizeBtn = event.target.closest('.product__size-btn');

  if (clickedSizeBtn) {
    if (clickedSizeBtn.classList.contains('product__size-btn_active')) {
      return;
    }

    const extraPrice = clickedSizeBtn.getAttribute('data-price');

    const priceElement = document.querySelector('.product__prize'); 
    const startPrice = priceElement.getAttribute('data-price');
    let fullPrice = Number(startPrice) + Number(extraPrice);

    const extraAdditives = document.querySelectorAll('.product__additives-btn_active');

    if (extraAdditives) {
      extraAdditives.forEach(item => {
        fullPrice += Number(item.dataset.price);
      });
    }

    const sizeBtns = document.querySelectorAll('.product__size-btn');

    sizeBtns.forEach((item) => {
      if (item.classList.contains('product__size-btn_active')) {
        item.classList.remove('product__size-btn_active');
      }
    });

    clickedSizeBtn.classList.add('product__size-btn_active');

    priceElement.innerHTML = fullPrice.toFixed(2);
  }

  const clickedAdditivesBtn = event.target.closest('.product__additives-btn');

  if (clickedAdditivesBtn) {
    const extraSizePrice = document
      .querySelector('.product__size-btn_active')
      .getAttribute('data-price');

    const priceElement = document.querySelector('.product__prize');
    const startPrice = priceElement.getAttribute('data-price');

    let fullPrice = Number(startPrice) + Number(extraSizePrice);

    clickedAdditivesBtn.classList.toggle('product__additives-btn_active');

    const activeAdditives = document.querySelectorAll(
      '.product__additives-btn_active'
    );

    if (activeAdditives) {
      activeAdditives.forEach((item) => {
        fullPrice += Number(item.getAttribute('data-price'));
      });
    }

    priceElement.innerHTML = fullPrice.toFixed(2);
  }
});
