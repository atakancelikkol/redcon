const nodePath = require('path');
const { exec } = require('child_process');
const logger = require('../../util/Logger');

class USBUtility {
  extractUsbState(mountPath, device) {
    const USBName = nodePath.basename(mountPath);
    const platformUsbState = {

      device, // For safe eject, device = '/dev/sda' ...
      mountedPath: mountPath,
      usbName: USBName,
      isAvailable: true,
    };
    return platformUsbState;
  }


  syncUsbDevice(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`sync ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant syncUsbDeviceLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('synchronized usb drive');
        resolve();
      });
    });
  }

  ejectUSBDriveSafely(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`sudo eject ${usbState.device}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant ejectUSBDriveSafelyLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('ejected usb drive');
        resolve();
      });
    });
  }
}

module.exports = USBUtility;
