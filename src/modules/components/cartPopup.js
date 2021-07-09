import {
  CART_BTN,
  CART_CLOSE,
  CART_OPEN,
  CART_OVERLAY
} from '../helpers/name.helper';
import { disableScroll, enableScroll } from '../utils/utils';

const eventHandlers = [];

export default () => {
  const cartOverlay = document.querySelector(CART_OVERLAY);

  const cartClickHandler = e => {
    const { target } = e;

    const cartClick = eventHandlers.find(
      handler => handler.type === 'cartClick'
    );

    const closeBtn = target.closest(CART_CLOSE);
    if (closeBtn || target === cartOverlay) {
      cartOverlay.classList.remove(CART_OPEN);
      cartClick.unsub();
      enableScroll();
    }
  };

  const cartBtnClickHandler = () => {
    cartOverlay.classList.add(CART_OPEN);
    cartOverlay.addEventListener('click', cartClickHandler);
    const unsub = () => cartOverlay.removeEventListener('click', cartClickHandler);
    eventHandlers.push({ type: 'cartClick', unsub });
    disableScroll();
  };

  document
    .querySelector(CART_BTN)
    .addEventListener('click', cartBtnClickHandler);
};
