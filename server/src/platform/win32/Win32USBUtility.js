const { exec } = require('child_process');
const fs = require('fs');
const { EOL } = require('os');
const logger = require('../../util/Logger');
const ServerConfig = require('../../ServerConfig');

class USBUtility {
  extractUsbState(driveListIndex) {
    return new Promise((resolve, reject) => {
      let platformUsbState;
      const mountPath = driveListIndex.mountpoints[0].path;
      /* Output= D: for windows */
      const mountPathSubStringToExtractVolumeName = mountPath.slice(0, -1); // eslint-disable-line
      exec(`wmic logicaldisk where "deviceid='${mountPathSubStringToExtractVolumeName}'" get volumename`, (err, stdout/* , stderr */) => {
        if (err) { // Handle error
          logger.info('here!!!');
          platformUsbState = { usbErrorString: `${err.message}Cant extractUsbStateWin32` };
          reject(platformUsbState);
          return;
        }
        const usbName = stdout;
        logger.info(usbName);
        if (!usbName) {
          reject();
          return;
        }

        const splittedUsbName = usbName.toString().split('\n');
        logger.info(splittedUsbName);
        if (splittedUsbName.length < 2) {
          reject();
          return;
        }

        platformUsbState = {
          device: driveListIndex.device,
          usbName: splittedUsbName[1].trim(),
          mountedPath: mountPath,
          isAvailable: true,
          usbErrorString: '',
        };

        resolve(platformUsbState);
      });
    });
  }

  async formatUSBDrive(usbState) {
    let usbVolumeToBeFormatted = '';
    await this.getVolumeNumber(usbState).then((volumeNumber) => {
      usbVolumeToBeFormatted = volumeNumber;
    }).catch((err) => {
      logger.error(err);
    });
    const newDiskPartFileContent = this.setNewFileContentToDiskpartFile(usbState, usbVolumeToBeFormatted);
    await this.editDiskpartFileContent(usbState, newDiskPartFileContent).catch((err) => {
      logger.error(err);
    });
    await this.runEditedDiskpartFile(usbState).catch((err) => {
      logger.error(err);
    });
  }

  getVolumeNumber(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      // It gets the second parameter of the corresponding line which has the usbName
      exec(`diskpart /s ..\\scripts\\win32\\listvolume.txt | for /f "tokens=2" %a in ('findstr ${usbState.usbName}') do @echo %a`, (err, stdout) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant getVolumeNumber on diskpart listvolume.txt file`;
          usbState.usbErrorString = usbErrorString; // eslint-disable-line no-param-reassign
          reject(usbErrorString);
          return;
        }
        // if other lines contain usbName, it gives a stream with eols.
        // Get rid of these eols and select the first usbNamecontained part
        const volumeNumber = stdout.split(EOL)[0].trim();
        resolve(volumeNumber);
      });
    });
  }

  syncUsbDevice(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`.\\.\\.\\bin\\win32\\sync -r ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant syncUsbDeviceWin32`; // eslint-disable-line no-param-reassign
          reject();
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
      exec(`.\\.\\.\\bin\\win32\\sync -e ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant ejectUSBDriveSafelyWin32`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        logger.info('ejected usb drive from windows');
        resolve();
      });
    });
  }

  setNewFileContentToDiskpartFile(usbState, usbVolumeToBeFormatted) {
    if (!usbState.isAvailable) {
      return 'usb is not available!';
    }
    const diskPartFileContentLines = [];
    diskPartFileContentLines.push(`select volume ${usbVolumeToBeFormatted}`);
    diskPartFileContentLines.push(`format fs=fat32 quick label=${ServerConfig.LabelName}`);
    diskPartFileContentLines.push('exit');
    return diskPartFileContentLines.join(EOL);
  }

  editDiskpartFileContent(usbState, newDiskPartFileContent) {
    return new Promise((resolve, reject) => {
      fs.writeFile('..\\scripts\\win32\\diskpart.txt', newDiskPartFileContent, (err) => {
        if (err) {
          usbState.usbErrorString = `${err.message} Cant editDiskpartFileContent`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        resolve();
      });
    });
  }

  runEditedDiskpartFile(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec('diskpart /s ..\\scripts\\win32\\diskpart.txt', (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant executeEditedDiskpartFile`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        // logger.debug(stdout);
        usbState.usbName = ServerConfig.LabelName; // eslint-disable-line no-param-reassign
        logger.info('formatted usb drive');
        resolve();
      });
    });
  }
}

module.exports = USBUtility;
