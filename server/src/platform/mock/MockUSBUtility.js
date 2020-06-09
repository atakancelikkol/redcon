const IUSBUtility = require('../interfaces/IUSBUtility');

class MockUSBUtility extends IUSBUtility {
  extractUsbState(/* mountPath, device */) {
    // console.log("MockUSBUtility extractUsbState: ", mountPath, device);
    const platformUsbState = {
      isAvailable: true,
      mountedPath: '',
      usbName: 'testUsbName',
      device: '',
      usbErrorString: '',
    };
    return platformUsbState;
  }

  syncUsbDevice(/* usbState */) {
    // console.log("MockUSBUtility syncUsbDevice: ", usbState.isAvailable);
    return true;
  }

  ejectUSBDriveSafely(/* usbState */) {
    // console.log("MockUSBUtility ejectUSBDriveSafely: ", usbState.isAvailable);
    return new Promise((resolve) => {
      resolve();
      return true;
    });
  }
}

module.exports = MockUSBUtility;
