

class StorageHelper {
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

const instance = new StorageHelper();
export default instance