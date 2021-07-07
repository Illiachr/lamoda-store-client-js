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

const eventHandlers = [];
const dbURL = "./db.json";
const currency = "&#8372;";

// utils
const setUID = () => "_" + Math.random().toString(36).substr(2, 9);

const createElem = (tag, cln, options = {}) => {
  const elem = document.createElement(tag);
  elem.id = setUID();
  if (Array.isArray(cln)) {
    elem.classList = cln.join(" ");
  } else {
    elem.classList = cln;
  }
  Object.keys(options).forEach((key) => {
    elem.style[key] = options[key];
  });
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

// component methotds

const goodInfo = ({ id, preview, cost, brand, name, sizes }) => `
  <article class="good">
    <a class="good__link-img" href="card-good.html#${id}">
      <img class="good__img" src="goods-image/${preview}" alt="">
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

const setTitle = (val) =>
  val === "men" ? "Мужчинам" : val === "women" ? "Женщинам" : "Детям";

const goodsPage = () => {
  const isGoodsPage = location.href.includes("goods.html");
  if (!isGoodsPage) {
    return;
  }
  const goodsTitle = document.querySelector(CLS_NAMES.GOODS_TITLE);

  const addItems = () => {
    const hash = location.hash.substring(1);
    goodsTitle.textContent = setTitle(hash);
    getGoods(addGoods, hash);
  };

  addItems();
  window.addEventListener("hashchange", addItems);
};

// init
(() => {
  headerActions();
  cartPopup();
  goodsPage();
})();
