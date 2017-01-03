const prefix = 'my_baby_tu_';
const localStorage = window.localStorage;

export default {
  fetch (key) {
    return JSON.parse(localStorage.getItem(prefix + key));
  },
  save (key, store) {
    localStorage.setItem(prefix + key, JSON.stringify(store));
  },
  clean (key) {
    localStorage.removeItem(prefix + key);
  }
};
