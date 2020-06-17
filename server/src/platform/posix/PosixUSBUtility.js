/* eslint-disable no-async-promise-executor */
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

  formatUSBDrive(usbState) {
    return new Promise(async (resolve) => {
      await this.unmountSelectedPartition(usbState).then(async () => {
        await this.formatSelectedPartition(usbState).then(async () => {
          await this.mountSelectedPartition(usbState);
          resolve();
        });
      });
    });
  }

  getPartitionName(mountPath, usbAvailability) {
    return new Promise((resolve, reject) => {
      if (!usbAvailability) {
        resolve();
        return;
      }
      exec(`df -h | grep ${mountPath} | awk '{print $1}'`, (err, stdout /* , stderr */) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant getPartitionNameLinux`;
          reject(usbErrorString);
          return;
        }
        const partitionName = stdout.trim();
        logger.info('Partition Name obtained');
        logger.debug('partitionName', partitionName);
        logger.debug('partitionName char length ', partitionName.length);
        resolve(partitionName);
      });
    });
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
      exec(`eject ${usbState.device}`, (err/* , stdout, stderr */) => {
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

  unmountSelectedPartition(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`umount ${usbState.partition}`, (err) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant unmountUSBDriveLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('unmounted usb drive');
        resolve();
      });
    });
  }

  mountSelectedPartition(usbState) {
    return new Promise(async (resolve, reject) => {
      //  if (!usbState.isAvailable) {
      //  resolve();
      //  return;
      //  }
      await this.createMountPointForSelectedPartition(usbState);
      exec(`mount ${usbState.partition} ${usbState.mountedPath}`, (err) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant unmountUSBDriveLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('mounted usb drive to the mount point');
        resolve();
      });
    });
  }

  createMountPointForSelectedPartition(usbState) {
    return new Promise((resolve, reject) => {
      exec(`mkdir ${usbState.mountedPath}`, (err) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant unmountUSBDriveLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('created Mount Point');
        resolve();
      });
    });
  }

  formatSelectedPartition(usbState) {
    return new Promise(async (resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`mkfs -t vfat -n ${usbState.usbName} ${usbState.partition}`, (err) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant formatUSBDriveLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('formatted usb drive');
        resolve();
      });
    });
  }
}

module.exports = USBUtility;
