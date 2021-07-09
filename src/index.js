import './index.html';
import './goods.html';
import './card-good.html';
import './scss/style.scss';
import headerActions from './modules/components/header';
import itemPage from './modules/components/itemPage';
import { getCart } from './modules/cart/cart';
import cartPopup from './modules/components/cartPopup';
import goodsPage from './modules/components/goodsPage';

(() => {
  getCart();
  headerActions();
  cartPopup();
  goodsPage();
  itemPage();
})();
