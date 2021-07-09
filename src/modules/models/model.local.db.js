const dbURL = './db/db.json';

// model
export const getItemsByKey = (items, val, key = 'category') => items.filter(item => item[key] === val);

// db request
export const getData = async url => {
  const res = await fetch(url);
  if (res.ok) {
    return res.json();
  }
  throw new Error(`${res.status}: ${res.statusText}`);
};

// eslint-disable-next-line consistent-return
export const getGoods = async (handler, val, url = dbURL) => {
  try {
    const goodsAll = await getData(url);

    if (!val) {
      return handler(goodsAll);
    }

    handler(getItemsByKey(goodsAll, val));
  } catch (err) {
    console.warn(err);
  }
};

export const getOne = async (handler, val, url = dbURL) => {
  try {
    const data = await getData(url);
    handler(getItemsByKey(data, val, 'id'));
  } catch (err) {
    console.warn(err);
  }
};
