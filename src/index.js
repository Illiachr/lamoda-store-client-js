import "./index.html";
import "./goods.html";
import "./card-good.html";
import "./scss/style.scss";

const CART = "consumerCart";

const CLS_NAMES = {
  CITY_BTN: ".header__city-button",
  CART: ".cart",
  CART_BTN: ".subheader__cart",
  CART_OVERLAY: ".cart-overlay",
  CART_OPEN: "cart-overlay-open",
  CART_CLOSE: ".cart__btn-close",
  GOODS_TITLE: ".goods__title",
  GOODS_LIST: ".goods__list",
  GOODS_ITEM: "goods__item"
};

const CARD_CLS = {
  ITEM_BRAND: ".card-good__brand",
  ITEM_TITLE: ".card-good__title",
  ITEM_IMG: ".card-good__image",
  ITEM_PRICE: ".card-good__price",
  COLOR_BTN: ".card-good__color",
  SIZES_BTN: ".card-good__sizes",
  COLOR_LIST: ".card-good__color-list",
  SIZES_LIST: ".card-good__sizes-list",
  SELECT: ".card-good__select",
  SELECT_WRAPPER: ".card-good__select__wrapper",
  SELECT_LIST: ".card-good__select-list",
  BTN_BUY: ".card-good__buy",
  SELECT_ITEM: "card-good__select-item",
  SELECT_OPEN: "card-good__select__open"
};

const cart = [];
const eventHandlers = [];
const dbURL = "./db/db.json";
const currency = "&#8372;";

// utils

const setUID = () => "_" + Math.random().toString(36).substr(2, 9);

const checkLocation = (val) => location.href.includes(val);
const getLocationHash = () => location.hash.substring(1);
const setTitle = (val) => {
  const elem = document.querySelector(`[href*="#${val}"]`);
  if (!elem) {
    return "";
  }
  return elem.textContent;
};

const createElem = (tag, cln, stylesProps = {}, dataProps = {}) => {
  const elem = document.createElement(tag);
  elem.id = setUID();
  if (Array.isArray(cln)) {
    elem.classList = cln.join(" ");
  } else {
    elem.classList = cln;
  }
  if (stylesProps !== "_" && stylesProps.lehgth) {
    Object.keys(stylesProps).forEach((key) => {
      elem.style[key] = stylesProps[key];
    });
  }

  if (dataProps !== "_" && dataProps.lehgth) {
    Object.keys(dataProps).forEach((key) => {
      elem.dataset[key] = dataProps[key];
    });
  }
  return elem;
};

const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
    top: ${-window.scrollY}px;
    left: 0;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `;
  // position: fixed;
};

const enableScroll = () => {
  document.body.style.cssText = `
    window.scroll({
      top: document.body.dbScrollY
    });
  `;
};

// model
const getItemsByKey = (items, val, key = "category") =>
  items.filter((item) => item[key] === val);

// db request
const getData = async (url) => {
  const res = await fetch(url);
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
};

const getGoods = async (handler, val, url = dbURL) => {
  try {
    const goodsAll = await getData(url);

    if (!val) {
      return handler(goods);
    }

    handler(getItemsByKey(goodsAll, val));
  } catch (err) {
    console.warn(err);
  }
};

const getOne = async (handler, val, url = dbURL) => {
  try {
    const data = await getData(url);
    handler(getItemsByKey(data, val, "id"));
  } catch (err) {
    console.warn(err);
  }
};

// component methotds

const goodInfo = ({ id, preview, cost, brand, name, sizes }) => `
  <article class="good">
    <a class="good__link-img" href="card-good.html#${id}">
      <img class="good__img" src="goods-image/${preview}" alt="${brand} ${name}">
    </a>
    <div class="good__description">
      <p class="good__price">${cost} ${currency}</p>
      <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
      ${
        sizes
          ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
              " "
            )}</span></p>`
          : ""
      }
      <a class="good__link" href="card-good.html#${id}">Подробнее</a>
    </div>
  </article>
`;

const createGoodsItem = (data) => {
  const item = createElem("li", { cls: CLS_NAMES.GOODS_ITEM });
  item.innerHTML = goodInfo(data);
  return item;
};

const addGoods = (goods) => {
  const goodsList = document.querySelector(CLS_NAMES.GOODS_LIST);
  goodsList.textContent = "";
  goods.forEach((item) => goodsList.append(createGoodsItem(item)));
};

const headerActions = () => {
  const headerCityBtn = document.querySelector(CLS_NAMES.CITY_BTN);

  const headerClickHandler = (e) => {
    const { target } = e;

    if (target === headerCityBtn) {
      const location = prompt("Укадите Ваш город");
      if (location) {
        target.textContent = location;
        localStorage.setItem("cunsomerLocation", location);
      }
    }
  };

  headerCityBtn.textContent =
    localStorage.getItem("cunsomerLocation") || "Ваш город?";

  document
    .querySelector(".header")
    .addEventListener("click", headerClickHandler);
};

const cartPopup = () => {
  const cartOverlay = document.querySelector(CLS_NAMES.CART_OVERLAY);

  const cartClickHandler = (e) => {
    const { target } = e;

    const cartClick = eventHandlers.find(
      (handler) => handler.type === "cartClick"
    );

    const closeBtn = target.closest(CLS_NAMES.CART_CLOSE);
    if (closeBtn || target === cartOverlay) {
      cartOverlay.classList.remove(CLS_NAMES.CART_OPEN);
      cartClick.unsub();
      enableScroll();
    }
  };

  const cartBtnClickHandler = (e) => {
    cartOverlay.classList.add(CLS_NAMES.CART_OPEN);
    cartOverlay.addEventListener("click", cartClickHandler);
    unsub = () => cartOverlay.removeEventListener("click", cartClickHandler);
    eventHandlers.push({ type: "cartClick", unsub });
    disableScroll();
  };

  document
    .querySelector(CLS_NAMES.CART_BTN)
    .addEventListener("click", cartBtnClickHandler);
};

// goodsPage
const goodsPage = () => {
  if (!checkLocation("goods.html")) {
    return;
  }
  const goodsTitle = document.querySelector(CLS_NAMES.GOODS_TITLE);

  const addItems = () => {
    const hash = getLocationHash();
    goodsTitle.textContent = setTitle(hash);
    getGoods(addGoods, hash);
  };

  addItems();
  window.addEventListener("hashchange", addItems);
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
  const item = createElem("li", CARD_CLS.SELECT_ITEM);
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

const renderItemCard = ([{ id, photo, cost, brand, name, color, sizes }]) => {
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
    colorSelectBtn.style.display = "none";
  }

  if (sizes) {
    sizesSelectBtn.textContent = sizes[0];
    sizesSelectBtn.dataset.idx = 0;
    addSelectOptions(CARD_CLS.SIZES_LIST, sizes);
  } else {
    colorSelectBtn.style.display = "none";
  }

  selectWrappers.forEach((select) =>
    select.addEventListener("click", (e) => selectClickHandler(e, select))
  );

  addToCart.addEventListener("click", () => {
    const colorId = colorSelectBtn.dataset.idx || null;
    const sizeId = sizesSelectBtn.dataset.idx || null;
    const cartItemIdx = cart.findIndex(
      (item) =>
        item.id === id && item.colorId === colorId && item.sizeId === sizeId
    );
    if (cartItemIdx >= 0 && cart.length > 0) {
      cart[cartItemIdx].count++;
    } else {
      const cartItem = {
        id,
        colorId,
        sizeId,
        count: 1
      };
      cart.push(cartItem);
    }
    localStorage.setItem(CART, JSON.stringify(cart));
  });
};

const itemPage = () => {
  if (!checkLocation("card-good.html")) {
    return;
  }

  getOne(renderItemCard, getLocationHash());
};

// init

const getCart = () => {
  const storedCartJSON = localStorage.getItem(CART);
  if (storedCartJSON) {
    JSON.parse(storedCartJSON).forEach((item) => cart.push(item));
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
