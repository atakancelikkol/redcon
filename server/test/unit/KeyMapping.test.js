const KeyMapping = require('../../src/util/KeyMapping');

describe('KeyMapping', () => {
  it('ConvertKey of KeyMapping', () => {
    // const dataToSend = KeyMapping.ConvertKey(keyCode, charCode, ctrlKey, shiftKey);
    expect(1).toStrictEqual(1);
  });

  it('ConvertKey of KeyMapping', () => {
    let k = 1;
    for (i = 65, j = 97; i <= 90, j <= 122; i++, j++) {
      const dataToSend = KeyMapping.ConvertKey(i, j, true);
      expect(k).toStrictEqual(dataToSend);
      k += 1;
    }
    let dataToSend2 = KeyMapping.ConvertKey(64, 97, false);
    expect(97).toStrictEqual(dataToSend2);
    dataToSend2 = KeyMapping.ConvertKey(64, -1, true); // @
    expect(0).toStrictEqual(dataToSend2);
    dataToSend2 = KeyMapping.ConvertKey(999, 999, true);// line 45
    expect(999).toStrictEqual(dataToSend2);
  });
});
