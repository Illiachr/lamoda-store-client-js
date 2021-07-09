export const CART = 'consumerCart';
export const cart = [];

export const getCart = () => {
  const storedCartJSON = localStorage.getItem(CART);
  if (storedCartJSON) {
    JSON.parse(storedCartJSON).forEach(item => cart.push(item));
  }
  console.log(cart);
};
