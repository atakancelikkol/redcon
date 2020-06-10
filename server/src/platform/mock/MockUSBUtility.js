const IUSBUtility = require('../interfaces/IUSBUtility');
const logger = require('../../util/Logger');

class MockUSBUtility extends IUSBUtility {
  extractUsbState(mountPath, device) {
    logger.info('MockUSBUtility extractUsbState: ', mountPath, device);
    return true;
  }

  syncUsbDevice(usbState) {
    logger.info('MockUSBUtility syncUsbDevice: ', usbState.isAvailable);
    return true;
  }

  ejectUSBDriveSafely(usbState) {
    logger.info('MockUSBUtility ejectUSBDriveSafely: ', usbState.isAvailable);
    return true;
  }
}

module.exports = MockUSBUtility;
