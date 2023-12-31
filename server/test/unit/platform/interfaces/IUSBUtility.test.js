const IUSBUtility = require('../../../../src/platform/interfaces/IUSBUtility');

describe('IUSBUtility interface test', () => {
  it('should throw error when calling methods directly', () => {
    const iUSBUtility = new IUSBUtility();
    expect(() => {
      iUSBUtility.extractUsbState();
    }).toThrow(Error);
    expect(() => {
      iUSBUtility.syncUsbDevice();
    }).toThrow(Error);
    expect(() => {
      iUSBUtility.ejectUSBDriveSafely();
    }).toThrow(Error);
    expect(() => {
      iUSBUtility.formatUSBDrive();
    }).toThrow(Error);
  });
});
