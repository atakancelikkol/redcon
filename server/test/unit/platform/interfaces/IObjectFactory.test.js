const IObjectFactory = require('../../../../src/platform/interfaces/IObjectFactory');

describe('IObjectFactory interface test', () => {
  it('should throw error when calling methods directly', () => {
    const iObjectFactory = new IObjectFactory();
    expect(() => {
      iObjectFactory.getPlatformString();
    }).toThrow(Error);

    expect(() => {
      iObjectFactory.createGPIOUtility();
    }).toThrow(Error);

    expect(() => {
      iObjectFactory.createNetworkUtility();
    }).toThrow(Error);

    expect(() => {
      iObjectFactory.createUSBUtility();
    }).toThrow(Error);

    expect(() => {
      iObjectFactory.createPlatformUtility();
    }).toThrow(Error);
  });
});
