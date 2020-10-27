const Win32ObjectFactory = require('../../../../src/platform/win32/Win32ObjectFactory');

describe('Win32ObjectFactory test', () => {
  it('should return the correct platform string', () => {
    const win32ObjectFactory = new Win32ObjectFactory();
    expect(win32ObjectFactory.getPlatformString()).toEqual('win32');
  });

  it('should return the platform objects', () => {
    const win32ObjectFactory = new Win32ObjectFactory();
    expect(win32ObjectFactory.createGPIOUtility()).not.toEqual(undefined);
    expect(win32ObjectFactory.createNetworkUtility()).not.toEqual(undefined);
    expect(win32ObjectFactory.createUSBUtility()).not.toEqual(undefined);
    expect(win32ObjectFactory.createPlatformUtility()).not.toEqual(undefined);
  });
});
