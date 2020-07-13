const IUSBUtility = require('../interfaces/IUSBUtility');
const logger = require('../../util/Logger');

class MockUSBUtility extends IUSBUtility {
  extractUsbState(mountPath, device) {
    logger.info('MockUSBUtility extractUsbState: ', mountPath, device);
    const platformUsbState = {
      isAvailable: true,
      mountedPath: '',
      usbName: 'testUsbName',
      device: '',
      usbErrorString: '',
    };
    return platformUsbState;
  }

  syncUsbDevice(usbState) {
    logger.info('MockUSBUtility syncUsbDevice: ', usbState.isAvailable);
    return new Promise((resolve) => {
      resolve();
      return true;
    });
  }

  ejectUSBDriveSafely(usbState) {
    logger.info('MockUSBUtility ejectUSBDriveSafely: ', usbState.isAvailable);
    return new Promise((resolve) => {
      resolve();
      return true;
    });
  }

  formatUSBDrive(usbState) {
    logger.info('MockUSBUtility formatUSBDrive: ', usbState.isAvailable);
    return new Promise((resolve) => {
      resolve();
      return true;
    });
  }
}

module.exports = MockUSBUtility;
