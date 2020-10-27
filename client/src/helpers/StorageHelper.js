
class StorageHelper {
  getItem(itemTag) {
    return localStorage.getItem(itemTag);
  }

  setItem(itemTag, item) {
    localStorage.setItem(itemTag, item);
  }

  removeItem(itemTag) {
    localStorage.removeItem(itemTag);
  }

  clear() {
    localStorage.clear();
  }
}

const instance = new StorageHelper();
export default instance;
