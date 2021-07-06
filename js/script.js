const CLS_NAMES = {
  CITY_BTN: ".header__city-button",
  CART: ".cart",
  CART_BTN: ".subheader__cart",
  CART_OVERLAY: ".cart-overlay",
  CART_OPEN: "cart-overlay-open",
  CART_CLOSE: ".cart__btn-close"
};

const eventHandlers = [];

// utils
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

// component methotds

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

// init

(() => {
  headerActions();
  cartPopup();
})();
