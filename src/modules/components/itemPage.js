import { cartCheckItem, cartDeleteOne, cartState, storeCart } from '../cart/cart';
import CURRENCY from '../helpers/intl.helper';
import { BTN_BUY,
  COLOR_BTN,
  COLOR_LIST,
  ITEM_BRAND,
  ITEM_IMG,
  ITEM_PRICE,
  ITEM_TITLE,
  SELECT,
  SELECT_ITEM,
  SELECT_OPEN,
  SELECT_WRAPPER,
  SIZES_BTN,
  SIZES_LIST } from '../helpers/name.helper';
import { getOne } from '../models/model.local.db';
import { checkLocation, createElem, getLocationHash } from '../utils/utils';

const addToCart = document.querySelector(BTN_BUY);

const selectClickHandler = (e, select, i, arr) => {
  const { target } = e;
  console.log(arr);

  const selectBtn = target.closest(SELECT);
  if (selectBtn) {
    selectBtn.classList.toggle(SELECT_OPEN);
  }

  const selectItem = target.closest(`.${SELECT_ITEM}`);
  if (selectItem) {
    const selectChoise = select.querySelector(SELECT);
    selectChoise.textContent = selectItem.textContent;
    selectChoise.dataset.idx = selectItem.dataset.idx;
    selectChoise.classList.remove(SELECT_OPEN);
    const { colorId, sizeId } = [...arr].reduce((acc, elem) => {
      const selectColor = elem.querySelector(COLOR_BTN);
      const selectSize = elem.querySelector(SIZES_BTN);
      if (selectColor) {
        acc.colorId = selectColor.dataset.idx;
      }
      if (selectSize) {
        acc.sizeId = selectSize.dataset.idx;
      }
      return acc;
    }, {});
    const idx = getLocationHash();
    const inCart = cartState.cart
      .some(item => item.id === idx && item.colorId === colorId && item.sizeId === sizeId);
    if (inCart) {
      addToCart.classList.add('hide');
    } else {
      addToCart.classList.remove('hide');
    }
  }
};

const createSelectItem = (val, idx) => {
  const item = createElem('li', SELECT_ITEM);
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
  id,
  photo,
  cost,
  brand,
  name,
  color,
  sizes
}]) => {
  const itemBrand = document.querySelector(ITEM_BRAND);
  const itemTitle = document.querySelector(ITEM_TITLE);
  const itemImage = document.querySelector(ITEM_IMG);
  const itemPrice = document.querySelector(ITEM_PRICE);
  const colorSelectBtn = document.querySelector(COLOR_BTN);
  const sizesSelectBtn = document.querySelector(SIZES_BTN);
  const selectWrappers = document.querySelectorAll(SELECT_WRAPPER);
  const cardWrap = document.querySelector('.card-good__wrapper');

  itemImage.src = `goods-image/${photo}`;
  itemImage.alt = `${brand} ${name}`;
  itemBrand.textContent = brand;
  itemTitle.textContent = name;
  itemPrice.innerHTML = `${cost}&nbsp;${CURRENCY}`;

  if (color) {
    [colorSelectBtn.textContent] = color;
    colorSelectBtn.dataset.idx = 0;
    addSelectOptions(COLOR_LIST, color);
  } else {
    colorSelectBtn.style.display = 'none';
  }

  if (sizes) {
    [sizesSelectBtn.textContent] = sizes;
    sizesSelectBtn.dataset.idx = 0;
    addSelectOptions(SIZES_LIST, sizes);
  } else {
    colorSelectBtn.style.display = 'none';
  }

  const idx = getLocationHash();
  const colorIdx = colorSelectBtn.dataset.idx;
  const sizeIdx = sizesSelectBtn.dataset.idx;
  const inCart = cartCheckItem(idx, colorIdx, sizeIdx);
  if (inCart) {
    addToCart.classList.add('hide');
  }

  selectWrappers.forEach(
    (select, i, arr) => select.addEventListener('click', e => selectClickHandler(e, select, i, arr))
  );

  cardWrap.addEventListener('click', e => {
    const { target } = e;

    const showCart = target.closest('.card-good__show-cart');

    if (showCart) {
      console.log(showCart);
    }

    const cancelItem = target.closest('.card-good__cancel');
    if (cancelItem) {
      const colorId = colorSelectBtn.dataset.idx || null;
      const sizeId = sizesSelectBtn.dataset.idx || null;
      cartDeleteOne(getLocationHash(), colorId, sizeId);
    }

    if (target === addToCart) {
      const colorId = colorSelectBtn.dataset.idx || null;
      const sizeId = sizesSelectBtn.dataset.idx || null;
      const cartItemIdx = cartState.cart.findIndex(
        item => item.id === id && item.colorId === colorId && item.sizeId === sizeId
      );
      if (cartItemIdx >= 0 && cartState.cart.length > 0) {
        cartState.cart[cartItemIdx].count += 1;
      } else {
        cartState.cart.push({
          id,
          colorId,
          sizeId,
          count: 1
        });
      }
      storeCart();
      addToCart.classList.add('hide');
    }
  });
};

export default () => {
  if (!checkLocation('card-good.html')) {
    return;
  }

  getOne(renderItemCard, getLocationHash());
};
