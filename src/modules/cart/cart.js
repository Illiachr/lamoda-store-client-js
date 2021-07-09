export const CART_ITEM_NAME = 'consumerCart';
export const cart = [];

export const getCart = () => {
  const storedCartJSON = localStorage.getItem(CART_ITEM_NAME);
  if (storedCartJSON) {
    JSON.parse(storedCartJSON).forEach(item => cart.push(item));
  }
  console.log(cart);
};
