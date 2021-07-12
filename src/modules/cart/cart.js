export const CART_ITEM_NAME = 'consumerCart';
export const cartState = { cart: [] };

export const storeCart = () => localStorage.setItem(CART_ITEM_NAME, JSON.stringify(cartState.cart));

export const getCart = () => {
  const cart = localStorage.getItem(CART_ITEM_NAME);
  if (cart) {
    cartState.cart = [...JSON.parse(cart)];
  }
};

export const cartDeleteOne = id => {
  const temp = cartState.cart.filter(item => item.id !== id);
  cartState.cart = [...temp];
  console.log(temp);
  storeCart(temp);
  getCart();
};
