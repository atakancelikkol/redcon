const MockUSBUtility = require('../../../../src/platform/mock/MockUSBUtility');

describe('MockUSBUtility test', () => {
  it('methods should be called without an error', () => {
    const mockUSBUtility = new MockUSBUtility();
    expect(mockUSBUtility.extractUsbState('mockMountPath,mockDevice')).toEqual(true);
    const mockUsbState = { isAvailable: 'mockAvailability' };
    expect(mockUSBUtility.syncUsbDevice(mockUsbState)).toEqual(true);
    expect(mockUSBUtility.ejectUSBDriveSafely(mockUsbState)).toEqual(true);
  });
});
