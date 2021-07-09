export const setUID = () => "_" + Math.random().toString(36).substr(2, 9);

export const checkLocation = (val) => location.href.includes(val);

export const getLocationHash = () => location.hash.substring(1);

export const setTitle = (val) => {
  const elem = document.querySelector(`[href*="#${val}"]`);
  if (!elem) {
    return "";
  }
  return elem.textContent;
};

export const createElem = (tag, cln, stylesProps = {}, dataProps = {}) => {
  const elem = document.createElement(tag);
  elem.id = setUID();
  if (Array.isArray(cln)) {
    elem.classList = cln.join(" ");
  } else {
    elem.classList = cln;
  }
  if (stylesProps !== "_" && stylesProps.lehgth) {
    Object.keys(stylesProps).forEach((key) => {
      elem.style[key] = stylesProps[key];
    });
  }

  if (dataProps !== "_" && dataProps.lehgth) {
    Object.keys(dataProps).forEach((key) => {
      elem.dataset[key] = dataProps[key];
    });
  }
  return elem;
};

export const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
    top: ${-window.scrollY}px;
    left: 0;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `;
};

export const enableScroll = () => {
  document.body.style.cssText = `
    window.scroll({
      top: document.body.dbScrollY
    });
  `;
};
