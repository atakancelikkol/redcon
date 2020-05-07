


export default class Localstorage {
  constructor() {
  }

  getItem(itemTag) {
    return localStorage.getItem(itemTag);
  }

  setItem(itemTag, item) {
    localStorage.setItem(itemTag, item);
  }

  removeItem(itemTag) {
    localStorage.removeItem(itemTag);
  }

  clearall() {
    localStorage.clear();
  }
}