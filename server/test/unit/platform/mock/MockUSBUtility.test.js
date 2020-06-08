const MockUSBUtility = require('../../../../src/platform/mock/MockUSBUtility');

describe('MockUSBUtility test', () => new Promise((done) => {
  it('methods should be called without an error', () => {
    const mockUSBUtility = new MockUSBUtility();
    expect(mockUSBUtility.extractUsbState()).toEqual({"device": "", "isAvailable": true, "mountedPath": "", "usbErrorString": "", "usbName": "testUsbName"});
    expect(mockUSBUtility.syncUsbDevice()).toEqual(true);
    mockUSBUtility.ejectUSBDriveSafely().then(() => {
      done();
    }, () => {
      throw new Error();
    });
  });
}));
