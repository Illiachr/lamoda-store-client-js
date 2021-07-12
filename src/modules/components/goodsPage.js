import CURRENCY from '../helpers/intl.helper';
import { GOODS_ITEM, GOODS_LIST, GOODS_TITLE } from '../helpers/name.helper';
import { getGoods } from '../models/model.local.db';
import { checkLocation, createElem, getLocationHash, setTitle } from '../utils/utils';

const goodInfo = ({ id, preview, cost, brand, name, sizes }) => `
  <article class="good">
    <a class="good__link-img" href="card-good.html#${id}">
      <img class="good__img" src="goods-image/${preview}" alt="${brand} ${name}">
    </a>
    <div class="good__description">
      <p class="good__price">${cost} ${CURRENCY}</p>
      <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
      ${
  sizes ?
    `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
      ' '
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
  const goodsList = document.querySelector(GOODS_LIST);
  goodsList.textContent = '';
  goods.forEach(item => goodsList.append(createGoodsItem(item)));
};

export default () => {
  if (!checkLocation('goods.html')) {
    return;
  }
  const goodsTitle = document.querySelector(GOODS_TITLE);

  const addItems = () => {
    const hash = getLocationHash();
    goodsTitle.textContent = setTitle(hash);
    getGoods(addGoods, hash);
  };

  addItems();
  window.addEventListener('hashchange', addItems);
};
