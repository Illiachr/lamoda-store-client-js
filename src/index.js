import './index.html';
import './goods.html';
import './card-good.html';
import './scss/style.scss';
import { GOODS_ITEM } from './modules/helpers/nameHelper';

const CART = 'consumerCart';

const cart = [];
const eventHandlers = [];
const currency = '&#8372;';

// component methotds

const goodInfo = ({
  id, preview, cost, brand, name, sizes,
}) => `
  <article class="good">
    <a class="good__link-img" href="card-good.html#${id}">
      <img class="good__img" src="goods-image/${preview}" alt="${brand} ${name}">
    </a>
    <div class="good__description">
      <p class="good__price">${cost} ${currency}</p>
      <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
      ${
  sizes ?
    `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
      ' ',
    )}</span></p>` :
    ''
}
      <a class="good__link" href="card-good.html#${id}">Подробнее</a>
    </div>
  </article>
`;

const createGoodsItem = data => {
  const item = createElem('li', { cls: GOODS_ITEM });
  item.innerHTML = goodInfo(data);
  return item;
};

const addGoods = goods => {
  const goodsList = document.querySelector(CLS_NAMES.GOODS_LIST);
  goodsList.textContent = '';
  goods.forEach(item => goodsList.append(createGoodsItem(item)));
};

const headerActions = () => {
  const headerCityBtn = document.querySelector(CLS_NAMES.CITY_BTN);

  const headerClickHandler = e => {
    const { target } = e;

    if (target === headerCityBtn) {
      const location = prompt('Укадите Ваш город');
      if (location) {
        target.textContent = location;
        localStorage.setItem('cunsomerLocation', location);
      }
    }
  };

  headerCityBtn.textContent =
    localStorage.getItem('cunsomerLocation') || 'Ваш город?';

  document
    .querySelector('.header')
    .addEventListener('click', headerClickHandler);
};

const cartPopup = () => {
  const cartOverlay = document.querySelector(CLS_NAMES.CART_OVERLAY);

  const cartClickHandler = e => {
    const { target } = e;

    const cartClick = eventHandlers.find(
      handler => handler.type === 'cartClick',
    );

    const closeBtn = target.closest(CLS_NAMES.CART_CLOSE);
    if (closeBtn || target === cartOverlay) {
      cartOverlay.classList.remove(CLS_NAMES.CART_OPEN);
      cartClick.unsub();
      enableScroll();
    }
  };

  const cartBtnClickHandler = e => {
    cartOverlay.classList.add(CLS_NAMES.CART_OPEN);
    cartOverlay.addEventListener('click', cartClickHandler);
    unsub = () => cartOverlay.removeEventListener('click', cartClickHandler);
    eventHandlers.push({ type: 'cartClick', unsub });
    disableScroll();
  };

  document
    .querySelector(CLS_NAMES.CART_BTN)
    .addEventListener('click', cartBtnClickHandler);
};

// goodsPage
const goodsPage = () => {
  if (!checkLocation('goods.html')) {
    return;
  }
  const goodsTitle = document.querySelector(CLS_NAMES.GOODS_TITLE);

  const addItems = () => {
    const hash = getLocationHash();
    goodsTitle.textContent = setTitle(hash);
    getGoods(addGoods, hash);
  };

  addItems();
  window.addEventListener('hashchange', addItems);
};

// itemPage
const selectClickHandler = (e, select) => {
  const { target } = e;

  const selectBtn = target.closest(CARD_CLS.SELECT);
  if (selectBtn) {
    selectBtn.classList.toggle(CARD_CLS.SELECT_OPEN);
  }

  const selectItem = target.closest(`.${CARD_CLS.SELECT_ITEM}`);
  if (selectItem) {
    const selectChoise = select.querySelector(CARD_CLS.SELECT);
    selectChoise.textContent = selectItem.textContent;
    selectChoise.dataset.idx = selectItem.dataset.idx;
    selectChoise.classList.remove(CARD_CLS.SELECT_OPEN);
  }
};

const createSelectItem = (val, idx) => {
  const item = createElem('li', CARD_CLS.SELECT_ITEM);
  item.textContent = val;
  item.dataset.idx = idx;
  return item;
};
const addSelectOptions = (selector, data) => {
  const selectList = document.querySelector(selector);
  data.forEach((val, idx) => {
    const option = createSelectItem(val, idx);
    selectList.append(option);
  });
};

const renderItemCard = ([{
  id, photo, cost, brand, name, color, sizes,
}]) => {
  const itemBrand = document.querySelector(CARD_CLS.ITEM_BRAND);
  const itemTitle = document.querySelector(CARD_CLS.ITEM_TITLE);
  const itemImage = document.querySelector(CARD_CLS.ITEM_IMG);
  const itemPrice = document.querySelector(CARD_CLS.ITEM_PRICE);
  const colorSelectBtn = document.querySelector(CARD_CLS.COLOR_BTN);
  const sizesSelectBtn = document.querySelector(CARD_CLS.SIZES_BTN);
  const selectWrappers = document.querySelectorAll(CARD_CLS.SELECT_WRAPPER);
  const addToCart = document.querySelector(CARD_CLS.BTN_BUY);

  itemImage.src = `goods-image/${photo}`;
  itemImage.alt = `${brand} ${name}`;
  itemBrand.textContent = brand;
  itemTitle.textContent = name;
  itemPrice.innerHTML = `${cost}&nbsp;${currency}`;

  if (color) {
    colorSelectBtn.textContent = color[0];
    colorSelectBtn.dataset.idx = 0;
    addSelectOptions(CARD_CLS.COLOR_LIST, color);
  } else {
    colorSelectBtn.style.display = 'none';
  }

  if (sizes) {
    sizesSelectBtn.textContent = sizes[0];
    sizesSelectBtn.dataset.idx = 0;
    addSelectOptions(CARD_CLS.SIZES_LIST, sizes);
  } else {
    colorSelectBtn.style.display = 'none';
  }

  selectWrappers.forEach(select => select.addEventListener('click', e => selectClickHandler(e, select)));

  addToCart.addEventListener('click', () => {
    const colorId = colorSelectBtn.dataset.idx || null;
    const sizeId = sizesSelectBtn.dataset.idx || null;
    const cartItemIdx = cart.findIndex(
      item => item.id === id && item.colorId === colorId && item.sizeId === sizeId,
    );
    if (cartItemIdx >= 0 && cart.length > 0) {
      cart[cartItemIdx].count++;
    } else {
      const cartItem = {
        id,
        colorId,
        sizeId,
        count: 1,
      };
      cart.push(cartItem);
    }
    localStorage.setItem(CART, JSON.stringify(cart));
  });
};

const itemPage = () => {
  if (!checkLocation('card-good.html')) {
    return;
  }

  getOne(renderItemCard, getLocationHash());
};

// init

const getCart = () => {
  const storedCartJSON = localStorage.getItem(CART);
  if (storedCartJSON) {
    JSON.parse(storedCartJSON).forEach(item => cart.push(item));
  }
  console.log(cart);
};

(() => {
  getCart();
  headerActions();
  cartPopup();
  goodsPage();
  itemPage();
})();
