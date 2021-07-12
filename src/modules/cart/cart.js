export const CART_ITEM_NAME = 'consumerCart';
export const cartState = { cart: [] };

export const storeCart = () => localStorage.setItem(CART_ITEM_NAME, JSON.stringify(cartState.cart));

export const getCart = () => {
  const cart = localStorage.getItem(CART_ITEM_NAME);
  if (cart) {
    cartState.cart = [...JSON.parse(cart)];
  }
};

export const cartDeleteById = id => {
  const temp = cartState.cart.filter((item, i) => i !== id);
  cartState.cart = [...temp];
  console.log(temp);
  storeCart(temp);
  getCart();
};

export const cartDeleteOne = (id, colorId, sizeId) => {
  const temp = cartState.cart.filter(item => item.id !== id && item.colorId !== colorId && item.sizeId !== sizeId);
  cartState.cart = [...temp];
  console.log(temp);
  storeCart(temp);
  getCart();
};

export const resetCart = () => {
  cartState.cart = [];
  localStorage.removeItem(CART_ITEM_NAME);
};

export const cartCheckItem = (id, colorId, sizeId) => cartState.cart
  .some(item => item.id === id && item.colorId === colorId && item.sizeId === sizeId);
