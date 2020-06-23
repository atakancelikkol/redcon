/* eslint-disable no-async-promise-executor */
const { exec } = require('child_process');
const logger = require('../../util/Logger');
const ServerConfig = require('../../ServerConfig');

class USBUtility {
  constructor() {
    this.partition = '';
  }

  extractUsbState(driveListIndex) {
    const platformUsbState = {

      device: driveListIndex.device, // For safe eject, device = '/dev/sda' ...
      mountedPath: driveListIndex.mountpoints[0].path,
      usbName: driveListIndex.mountpoints[0].label,
      isAvailable: true,
    };
    return platformUsbState;
  }

  async formatUSBDrive(usbState) {
    this.partition = await this.getPartitionName(usbState);
    await this.unmountSelectedPartition(usbState);
    await this.formatSelectedPartition(usbState);
    await this.mountSelectedPartition(usbState);
  }

  getPartitionName(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`df -h | grep ${usbState.mountedPath} | awk '{print $1}'`, (err, stdout/* , stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant getPartitionNameLinux`; // eslint-disable-line no-param-reassign
          reject(usbState.usbErrorString);
          return;
        }
        const partitionName = stdout.trim();
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
      exec(`sudo sync ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant syncUsbDeviceLinux`; // eslint-disable-line no-param-reassign
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
      this.unmountAllPartitionsOfTheDevice(usbState).then(() => {
        exec(`sudo eject ${usbState.device}`, (err/* , stdout, stderr */) => {
          if (err) { // Handle error
            usbState.usbErrorString = `${err.message} Cant ejectUSBDriveSafelyLinux`; // eslint-disable-line no-param-reassign
            reject();
            return;
          }
          logger.info('ejected usb drive');
          resolve();
        });
      });
    });
  }

  unmountAllPartitionsOfTheDevice(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`sudo umount ${usbState.device}?*`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant unmountAllPartitionsOfTheDevice`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        logger.info('unmounted all the partitions of the usb drive');
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
      exec(`sudo umount ${this.partition}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant unmountUSBDriveLinux`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        logger.info('unmounted the selected partition of the usb drive');
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
      exec(`sudo mount ${this.partition} ${ServerConfig.MountPoint}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant mountSelectedPartition`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        usbState.mountedPath = ServerConfig.MountPoint; // eslint-disable-line no-param-reassign
        logger.info('mounted usb drive to the mount point');
        resolve();
      });
    });
  }

  createMountPointForSelectedPartition(usbState) {
    return new Promise((resolve, reject) => {
      exec(`sudo mkdir -p ${ServerConfig.MountPoint}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant createMountPointForSelectedPartition`; // eslint-disable-line no-param-reassign
          reject();
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
      exec(`sudo mkfs -t vfat -n ${usbState.usbName} ${this.partition}`, (err/* , stdout, stderr */) => {
        if (err) { // Handle error
          usbState.usbErrorString = `${err.message} Cant formatSelectedPartition`; // eslint-disable-line no-param-reassign
          reject();
          return;
        }
        logger.info('formatted usb drive');
        resolve();
      });
    });
  }
}

module.exports = USBUtility;
