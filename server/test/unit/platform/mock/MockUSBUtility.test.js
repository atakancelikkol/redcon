const MockUSBUtility = require('../../../../src/platform/mock/MockUSBUtility');

describe('MockUSBUtility test', () => {
  it('it tests mock sync', () => {
    const mockUSBUtility = new MockUSBUtility();
    expect(mockUSBUtility.extractUsbState('mountPath', 'device')).toEqual({
      device: '', isAvailable: true, mountedPath: '', usbErrorString: '', usbName: 'testUsbName',
    });
    const mockUsbState = { isAvailable: 'mockAvailability' };
    return expect(mockUSBUtility.syncUsbDevice(mockUsbState)).resolves.toBe();
  });

  it('it tests mock eject', () => new Promise((done) => {
    const mockUSBUtility = new MockUSBUtility();
    expect(mockUSBUtility.extractUsbState('mountPath', 'device')).toEqual({
      device: '', isAvailable: true, mountedPath: '', usbErrorString: '', usbName: 'testUsbName',
    });
    const mockUsbState = { isAvailable: 'mockAvailability' };
    mockUSBUtility.ejectUSBDriveSafely(mockUsbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));
});
