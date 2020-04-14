const CTRL_KEY_MAP= {
  "@": 0,
  "A": 1,
  "B": 2,
  "C": 3,
}
//TODO implement SHIFT_KEY_MAP
class KeyMapping {
  static ConvertKey(keyCode, charCode, ctrlKey, shiftKey) {
    let dataToSend = charCode;
    if (ctrlKey) {
      const currentKey = String.fromCharCode(keyCode);
      if(CTRL_KEY_MAP[currentKey] !== undefined) {
        dataToSend = CTRL_KEY_MAP[currentKey];
      }
    }

    return dataToSend;
  }
}

//const instance = new KeyMapping;
module.exports = KeyMapping;