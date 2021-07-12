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

    handler(getItemsByKey(goodsAll, val, 'category'));
  } catch (err) {
    console.warn(err);
  }
};

export const getOne = async (handler, val, url = dbURL) => {
  try {
    const data = await getData(url);
    handler(getItemsByKey(data, val, 'id'));
  } catch (err) {
    console.error(err);
  }
};

export const getItemList = (orderList, dbItems) => {
  const itemList = [];
  orderList.forEach(record => {
    const item = {};
    const { id, colorId, sizeId, count } = record;
    const [itemTemp] = getItemsByKey(dbItems, id, 'id');
    const keys = Object.keys(itemTemp).filter(key => key !== 'photo' || key !== 'preview');
    keys.forEach(key => {
      if (key === 'color') {
        item.color = itemTemp.color[colorId];
      } else if (key === 'sizes') {
        item.sizes = itemTemp.sizes[sizeId];
      } else { item[key] = itemTemp[key]; }
    });
    itemList.push({ ...item, count });
  });
  return itemList;
};

// eslint-disable-next-line consistent-return
export const getOrder = async (handler, orderList, url = dbURL) => {
  try {
    if (!orderList.length) {
      return handler();
    }
    const goodsAll = await getData(url);
    const itemList = getItemList(orderList, goodsAll);
    handler(itemList);
  } catch (err) {
    console.error(err);
  }
};
