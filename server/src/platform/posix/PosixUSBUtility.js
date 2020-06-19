/* eslint-disable no-async-promise-executor */
const { exec } = require('child_process');
const logger = require('../../util/Logger');
const ServerConfig = require('../../ServerConfig');

class USBUtility {
  extractUsbState(mountPath, labelName, device) {
    const platformUsbState = {

      device, // For safe eject, device = '/dev/sda' ...
      mountedPath: mountPath,
      usbName: labelName,
      isAvailable: true,
    };
    return platformUsbState;
  }

  async formatUSBDrive(usbState) {
    await this.unmountSelectedPartition(usbState);
    await this.formatSelectedPartition(usbState);
    await this.mountSelectedPartition(usbState);
  }

  getPartitionName(mountPath, usbAvailability) {
    return new Promise((resolve, reject) => {
      if (!usbAvailability) {
        resolve();
        return;
      }
      exec(`df -h | grep ${mountPath} | awk '{print $1}'`, (err, stdout, stderr) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant getPartitionNameLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('stdout', stdout);
        logger.info('stderr', stderr);
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
      exec(`sudo sync ${usbState.mountedPath}`, (err/* , stdout, stderr */) => {
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
      this.unmountAllPartitionsOfTheDevice(usbState).then(() => {
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
    });
  }

  unmountAllPartitionsOfTheDevice(usbState) {
    return new Promise((resolve, reject) => {
      if (!usbState.isAvailable) {
        resolve();
        return;
      }
      exec(`sudo umount ${usbState.device}?*`, (err, stdout, stderr) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant unmountAllPartitionsOfTheDevice`;
          reject(usbErrorString);
          return;
        }
        logger.info('stdout', stdout);
        logger.info('stderr', stderr);
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
      exec(`sudo umount ${usbState.partition}`, (err, stdout, stderr) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant unmountUSBDriveLinux`;
          reject(usbErrorString);
          return;
        }
        logger.info('stdout', stdout);
        logger.info('stderr', stderr);
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
      exec(`sudo mount ${usbState.partition} ${ServerConfig.MountPoint}`, (err, stdout, stderr) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant mountSelectedPartition`;
          reject(usbErrorString);
          return;
        }
        logger.info('stdout', stdout);
        logger.info('stderr', stderr);
        logger.info('mounted usb drive to the mount point');
        resolve();
      });
    });
  }

  createMountPointForSelectedPartition(usbState) {
    return new Promise((resolve, reject) => {
      exec(`sudo mkdir -p ${ServerConfig.MountPoint}`, (err, stdout, stderr) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant createMountPointForSelectedPartition`;
          reject(usbErrorString);
          return;
        }
        usbState.mountedPath = ServerConfig.MountPoint; // eslint-disable-line no-param-reassign
        logger.info('stdout', stdout);
        logger.info('stderr', stderr);
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
      exec(`sudo mkfs -t vfat -n ${usbState.usbName} ${usbState.partition}`, (err, stdout, stderr) => {
        if (err) { // Handle error
          const usbErrorString = `${err.message} Cant formatSelectedPartition`;
          reject(usbErrorString);
          return;
        }
        logger.info('stdout', stdout);
        logger.info('stderr', stderr);
        logger.info('formatted usb drive');
        resolve();
      });
    });
  }
}

module.exports = USBUtility;
