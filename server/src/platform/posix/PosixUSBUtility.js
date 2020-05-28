const nodePath = require('path');
const { exec } = require('child_process');

class USBUtility {
  constructor() {
  }

  extractUsbState(mountPath, device) {
    let platformUsbState
    const USBName = nodePath.basename(mountPath);
    platformUsbState = {

      device: device, // For safe eject, device = '/dev/sda' ...
      mountedPath: mountPath,
      usbName: USBName,
      isAvailable: true
    }
    return platformUsbState
  }


  syncUsbDevice(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
      }
      exec(`sync ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          let usbErrorString = `${err.message} Cant syncUsbDeviceLinux`;
          reject(usbErrorString);
        }
        console.log('synchronized usb drive');
        resolve();
      });

    });
  }

  ejectUSBDriveSafely(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
      }
      exec(`sudo eject ${usbState.device}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          let usbErrorString = `${err.message} Cant ejectUSBDriveSafelyLinux`;
          reject(usbErrorString);
        }
        console.log('ejected usb drive');
        resolve();
      });

    });
  }


}

module.exports = USBUtility;
