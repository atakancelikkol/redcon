const { exec } = require('child_process');

class USBUtility {
  extractUsbState(mountPath) {
    return new Promise((resolve, reject) => {
      let platformUsbState;
      /* Output= D: for windows */
      mountPath = mountPath.slice(0, -1); // eslint-disable-line
      exec(`wmic logicaldisk where "deviceid='${mountPath}'" get volumename`, (err, stdout/* , stderr */) => {
        if (err) { // Handle error
          platformUsbState = {
            usbErrorString: `${err.message}Cant extractUsbStateWin32`,
          };

          reject(platformUsbState);
        }
        const usbName = stdout;
        if (!usbName) {
          reject();
        }

        const splittedUsbName = usbName.toString().split('\n');
        if (splittedUsbName.length < 2) {
          reject();
        }


        platformUsbState = {
          device: '',
          usbName: splittedUsbName[1].trim(),
          mountedPath: mountPath,
          isAvailable: true,
          usbErrorString: '',
        };

        resolve(platformUsbState);
      });
    });
  }

  syncUsbDevice(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
      }
      exec(`.\\.\\.\\bin\\win32\\sync -r ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant syncUsbDeviceWin32`;
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
      exec(`.\\.\\.\\bin\\win32\\sync -e ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant ejectUSBDriveSafelyWin32`;
          reject(usbErrorString);
        }
        console.log('ejected usb drive from windows');
        resolve();
      });
    });
  }
}

module.exports = USBUtility;
