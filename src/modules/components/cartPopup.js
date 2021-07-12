import { cartState, cartDeleteById, resetCart } from '../cart/cart';
import CURRENCY from '../helpers/intl.helper';
import { CART_BTN, CART_BTN_CLEAR, CART_BTN_CONTINUE,
  CART_BTN_DELETE, CART_CLOSE, CART_LIST, CART_OPEN, CART_OVERLAY } from '../helpers/name.helper';
import { getOrder } from '../models/model.local.db';
import { disableScroll, enableScroll } from '../utils/utils';

const eventHandlers = [];

const crateListItem = ({ brand, name, color, sizes, cost, count }, idx) => `
  <tr>
    <td>${idx + 1}</td>
    <td>${brand} ${name}</td>
    <td>${color || '-'}</td>
    <td>${sizes || '-'}</td>
    <td>${count}</td>
    <td>${cost} ${CURRENCY}</td>
    <td>${cost * count} ${CURRENCY}</td>
    <td><button class=${CART_BTN_DELETE} data-idx=${idx}>&times;</button></td>
  </tr>`;

const renderRows = (data = []) => {
  const cartList = document.querySelector(CART_LIST);
  const cartCost = document.querySelector('.cart__total-cost');

  cartList.textContent = '';

  if (!data.length) {
    cartList.textContent = 'Корзина пуста';
    return;
  }

  const totalCost = data.reduce((acc, item) => acc + (item.cost * item.count), 0);

  data.forEach((item, idx) => cartList.insertAdjacentHTML('beforeend', crateListItem(item, idx)));
  cartCost.innerHTML = `${totalCost} ${CURRENCY}`;
};

export default () => {
  const cartOverlay = document.querySelector(CART_OVERLAY);

  const cartClickHandler = e => {
    const { target } = e;
    console.log(e);
    const cartClick = eventHandlers.find(
      handler => handler.type === 'cartClick'
    );

    if (target.matches(`.${CART_BTN_CLEAR}`)) {
      resetCart();
      renderRows();
    }

    if (target.closest(CART_CLOSE) ||
        target === cartOverlay ||
        target.matches(CART_BTN_CONTINUE)) {
      cartOverlay.classList.remove(CART_OPEN);
      cartClick.unsub();
      enableScroll();
    }

    const btnDelete = target.closest(`.${CART_BTN_DELETE}`);
    if (btnDelete) {
      cartDeleteById(btnDelete.dataset.idx);
      getOrder(renderRows, cartState.cart);
    }
  };

  const cartBtnClickHandler = () => {
    getOrder(renderRows, cartState.cart);
    cartOverlay.classList.add(CART_OPEN);
    cartOverlay.addEventListener('click', cartClickHandler);
    const unsub = () => cartOverlay.removeEventListener('click', cartClickHandler);
    eventHandlers.push({ type: 'cartClick', unsub });
    disableScroll();
  };

  document
    .querySelector(CART_BTN)
    .addEventListener('click', cartBtnClickHandler);
  const showCart = document.querySelector('.card-good__show-cart');
  if (showCart) {
    showCart.addEventListener('click', cartBtnClickHandler);
  }
};
