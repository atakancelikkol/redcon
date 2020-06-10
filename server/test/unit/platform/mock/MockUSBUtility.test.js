const MockUSBUtility = require('../../../../src/platform/mock/MockUSBUtility');

describe('MockUSBUtility test', () => {
  it('methods should be called without an error', () => new Promise((done) => {
    const mockUSBUtility = new MockUSBUtility();
    expect(mockUSBUtility.extractUsbState('mountPath', 'device')).toEqual({
      device: '', isAvailable: true, mountedPath: '', usbErrorString: '', usbName: 'testUsbName',
    });
    const mockUsbState = { isAvailable: 'mockAvailability' };
    expect(mockUSBUtility.syncUsbDevice(mockUsbState)).toEqual(true);
    mockUSBUtility.ejectUSBDriveSafely(mockUsbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));
});
