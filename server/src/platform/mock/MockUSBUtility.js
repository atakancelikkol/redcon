const IUSBUtility = require('../interfaces/IUSBUtility');

class MockUSBUtility extends IUSBUtility {
  extractUsbState(/* mountPath, device */) {
    // console.log("MockUSBUtility extractUsbState: ", mountPath, device);
    const platformUsbState = {

      device: '/dev/sda', // For safe eject, device = '/dev/sda' ...
      mountedPath: 'testPath',
      usbName: 'testName',
      isAvailable: true,
    };
    return platformUsbState;
  }

  syncUsbDevice(/* usbState */) {
    // console.log("MockUSBUtility syncUsbDevice: ", usbState.isAvailable);
  }

  ejectUSBDriveSafely(/* usbState */) {
    // console.log("MockUSBUtility ejectUSBDriveSafely: ", usbState.isAvailable);

  }
}

module.exports = MockUSBUtility;
