import { CITY_BTN } from '../helpers/name.helper';

export default () => {
  const headerCityBtn = document.querySelector(CITY_BTN);

  const headerClickHandler = e => {
    const { target } = e;

    if (target === headerCityBtn) {
      const location = prompt('Укажите Ваш город');
      if (location) {
        target.textContent = location;
        localStorage.setItem('cunsomerLocation', location);
      }
    }
  };

  headerCityBtn.textContent =
    localStorage.getItem('cunsomerLocation') || 'Ваш город?';

  document
    .querySelector('.header')
    .addEventListener('click', headerClickHandler);
};
