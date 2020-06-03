const MockUSBUtility = require('../../../../src/platform/mock/MockUSBUtility');

describe('MockUSBUtility test', () => {
  it('methods should be called without an error', () => {
    const mockUSBUtility = new MockUSBUtility();
    expect(mockUSBUtility.extractUsbState()).toEqual(true);
    expect(mockUSBUtility.syncUsbDevice()).toEqual(true);
    expect(mockUSBUtility.ejectUSBDriveSafely()).toEqual(true);
  });
});
