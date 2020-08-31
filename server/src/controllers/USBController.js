// Class for Controlling the USB Flash Storage
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const nodePath = require('path');
const fs = require('fs');
const formidable = require('formidable');
const md5File = require('md5-file');
const rimraf = require('rimraf');
const getSize = require('get-folder-size');
const ControllerBase = require('../ControllerBase');
const GPIOPins = require('../GPIOPins');

const logger = require('../util/Logger');

const MAX_TRY_COUNT_DRIVE = 30; // 30 attempts attempts within 1s resulting in appr. 30s
const MAX_TRY_COUNT_LED = 200; // 200 attempts within 5ms resulting in appr. 1s
const LED_CHECK_TIME_INTERVAL = 1000; // ms
const MIN_TOGGLE_INTERVAL = 1000; // ms

class USBController extends ControllerBase {
  constructor(options) {
    super('USBController');
    this.usbState = {
      isAvailable: false,
      kvmLedStateECU: false,
      kvmLedStateRPI: false,
      mountedPath: '',
      usbName: '',
      device: '',
      currentDirectory: '.',
      currentItems: [],
      currentItemInfo: {},
      usbErrorString: '',
    };
    this.timeToCheckSafety = 0;

    this.toggleTimeoutHandle = undefined;
    this.ledReadIntervalHandle = undefined;

    if (options && options.useMockUsbDetect) {
      this.usbDetect = {
        startMonitoring: () => { },
        stopMonitoring: () => { },
        on: () => { },
      };
    } else {
      this.usbDetect = require('usb-detection'); // eslint-disable-line
    }
  }

  init() {
    logger.info('initializing USBController...');
    this.usbDetect.startMonitoring();
    this.usbDetect.on('change', () => {
      this.detectDriveChanges();
    });

    // open led gpio port to read
    this.platformObjects.getGPIOUtility().openForInput(GPIOPins.KVM_LED_RPI);
    this.platformObjects.getGPIOUtility().openForInput(GPIOPins.KVM_LED_ECU);

    this.detectUsbDevice();

    this.ledReadIntervalHandle = setInterval(this.checkKVMLedState.bind(this), LED_CHECK_TIME_INTERVAL);

    this.addHttpUploadHandler();
  }

  addHttpUploadHandler(s) {
    this.httpServer.getApp().post('/uploadFileToUsbDevice', this.uploadFileToUsbDevice.bind(this));
    this.httpServer.getApp().get('/getFileFromUsbDevice', this.getFileFromUsbDevice.bind(this));
  }

  checkKVMLedState() {
    // read led states
    const rpiLed = this.platformObjects.getGPIOUtility().read(GPIOPins.KVM_LED_RPI);
    const ecuLed = this.platformObjects.getGPIOUtility().read(GPIOPins.KVM_LED_ECU);

    if (this.usbState.kvmLedStateRPI === rpiLed && this.usbState.kvmLedStateECU === ecuLed) {
      // state is not changed
      return;
    }

    this.usbState.kvmLedStateRPI = rpiLed;
    this.usbState.kvmLedStateECU = ecuLed;

    // state changed, update clients!
    this.sendCurrentState();
  }

  getCopyState() {
    return cloneDeep(this.usbState);
  }

  appendData(obj) {
    // this function returns the initial state
    obj.usb = this.getCopyState(); // eslint-disable-line
  }

  handleMessage(obj/* , client */) {
    if (typeof obj.usb !== 'undefined') {
      // var obj = { usb: {action, device} };
      if (obj.usb.action === 'toggleDevice') {
        this.toggleUsbDevice();
      } else if (obj.usb.action === 'detectUsbDevice') {
        this.detectUsbDevice();
      } else if (obj.usb.action === 'listItems') {
        this.listUsbDeviceItems(obj.usb.path);
      } else if (obj.usb.action === 'deleteItem') {
        this.deleteUsbDeviceItem(obj.usb.path, obj.usb.itemName);
      } else if (obj.usb.action === 'getItemInfo') {
        this.getItemInfo(obj.usb.path, obj.usb.itemName);
      } else if (obj.usb.action === 'createFolder') {
        this.createUsbDeviceFolder(obj.usb.path, obj.usb.folderName);
      } else if (obj.usb.action === 'formatUsbDevice') {
        this.formatUsbDevice();
      }
    }
  }

  detectDriveChanges() {
    return new Promise((resolve, reject) => {
      const lastState = this.usbState.isAvailable;
      let tryCount = 0;

      const detectUsbInsertionInTimeIntervals = () => {
        this.detectUsbDevice().then(() => {
          tryCount += 1;
          if (this.usbState.isAvailable === lastState) {
            if (tryCount < MAX_TRY_COUNT_DRIVE) {
              setTimeout(detectUsbInsertionInTimeIntervals, 1000);
            } else {
              reject();
            }
          } else {
            logger.info('detectUsbDevice try count has been exceeded');
            resolve();
          }
        });
      };
      detectUsbInsertionInTimeIntervals();
    });
  }

  // platform
  async detectUsbDevice() {
    // To get list of connected Drives
    this.usbState.usbErrorString = '';
    const driveList = await drivelist.list();
    let isDriveFound = false;
    for (let index = 0; index < driveList.length; index += 1) {
      if (driveList[index].isUSB && driveList[index].mountpoints && (typeof driveList[index].mountpoints[0] !== 'undefined')) {
        const platformUsbState = await this.platformObjects.getUSBUtility().extractUsbState(driveList[index]); // eslint-disable-line
        this.usbState.usbErrorString = platformUsbState.usbErrorString;
        this.usbState.device = platformUsbState.device;
        this.usbState.usbName = platformUsbState.usbName;
        this.usbState.mountedPath = platformUsbState.mountedPath;
        this.usbState.isAvailable = platformUsbState.isAvailable;
        isDriveFound = true;
      }
    }

    if (!isDriveFound) {
      this.usbState.mountedPath = '';
      this.usbState.usbName = '';
      this.usbState.device = '';
      this.usbState.isAvailable = false;
    }

    this.sendCurrentState();
  }

  listUsbDeviceItems(path) {
    return new Promise((resolve, reject) => {
      this.internalListUsbDeviceItems(path, resolve, reject);
    });
  }

  internalListUsbDeviceItems(path, resolve, reject) {
    if (this.usbState.mountedPath === '') {
      // send empty item list
      this.usbState.currentDirectory = path;
      this.usbState.currentItems = [];
      this.sendCurrentState();
      resolve();
      return;
    }

    const dir = nodePath.join(this.usbState.mountedPath, path);

    const parentDir = nodePath.join(path, '..');

    fs.readdir(dir, { withFileTypes: true }, (err, items) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant listUsbDeviceItems`;
        this.sendCurrentState();
        logger.error(`Unable to scan directory: ${err}`);
        reject();
        return;
      }
      const itemsList = [];
      if (parentDir !== '..') {
        itemsList.push({
          name: parentDir, isDirectory: true, fullPath: true,
        });
      }

      items.forEach((item) => {
        itemsList.push({
          name: item.name,
          isDirectory: item.isDirectory(),
        });
      });

      itemsList.sort((a, b) => {
        if (a.isDirectory && b.isDirectory) return 0;
        if (!a.isDirectory && b.isDirectory) return 1;
        return -1;
      });

      this.usbState.currentDirectory = dir;
      this.usbState.currentItems = itemsList;

      this.sendCurrentState();
      resolve();
    });
  }

  getItemInfo(path, itemName) {
    const dir = nodePath.join(this.usbState.mountedPath, path, itemName);
    this.usbState.usbErrorString = '';
    fs.stat(dir, (err, stats) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant getFileStatus`;
        this.listUsbDeviceItems(path);
        logger.error(err);
        return;
      }

      const itemInfo = {
        path: dir,
        name: itemName,
        createDate: new Date(stats.birthtime).toLocaleString(),
        modifyDate: new Date(stats.mtime).toLocaleString(),
        size: undefined,
        md5: undefined,
      };

      if (stats.isFile()) {
        this.getFileInfo(stats, dir, itemInfo);
      } else if (stats.isDirectory()) {
        this.getFolderInfo(stats, dir, itemInfo);
      }
    });
  }

  convertItemSizeToString(sizeInBytes) { // eslint-disable-line
    let sizeString = '';
    const fileSizeInGB = (sizeInBytes / 1024 / 1024 / 1024).toFixed(2);
    if (fileSizeInGB < 1) {
      const fileSizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
      if (fileSizeInMB < 1) {
        const fileSizeInKB = (sizeInBytes / 1024).toFixed(2);
        if (fileSizeInKB < 1) {
          sizeString = `${sizeInBytes} Bytes`;
        } else {
          sizeString = `${fileSizeInKB} KB`;
        }
      } else {
        sizeString = `${fileSizeInMB} MB`;
      }
    } else {
      sizeString = `${fileSizeInGB} GB`;
    }

    return sizeString;
  }

  async getFileInfo(stats, dir, itemInfo) {
    itemInfo.md5 = await md5File(dir); // eslint-disable-line
    itemInfo.size = this.convertItemSizeToString(stats.size); // eslint-disable-line

    // send item info
    this.usbState.currentItemInfo = itemInfo;
    this.sendCurrentState();
  }

  getFolderInfo(stats, dir, itemInfo) {
    getSize(dir, (err, size) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant getFolderInfo-getSize`;
        size = 0; // eslint-disable-line
      }
      itemInfo.size = this.convertItemSizeToString(size); // eslint-disable-line
      this.usbState.currentItemInfo = itemInfo;
      this.sendCurrentState();
    });
  }

  createUsbDeviceFolder(path, folderName) {
    return new Promise((resolve, reject) => {
      this.internalCreateUsbDeviceFolder(path, folderName, resolve, reject);
    });
  }

  internalCreateUsbDeviceFolder(path, folderName, resolve, reject) {
    const dir = nodePath.join(this.usbState.mountedPath, path, folderName);

    this.usbState.usbErrorString = '';
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant createUsbDeviceFolder`;
        this.listUsbDeviceItems(path);
        logger.error(err);
        reject();
        return;
      }
      this.platformObjects.getUSBUtility().syncUsbDevice(this.usbState).catch((error) => {
        logger.error(error);
      });
      this.listUsbDeviceItems(path);
      resolve();
    });
  }

  deleteUsbDeviceItem(path, itemName) {
    const dir = nodePath.join(this.usbState.mountedPath, path, itemName);
    this.usbState.usbErrorString = '';
    fs.lstat(dir, (err, stats) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant getFileStatus`;
        this.listUsbDeviceItems(path);
        logger.error(err);
        return;
      }
      if (stats.isFile()) { // if it's a file
        this.deleteUsbDeviceFile(dir, path);
      } else if (stats.isDirectory()) { // if it's a folder
        this.deleteUsbDeviceFolder(dir, path);
      }
    });
  }

  deleteUsbDeviceFile(dir, path) {
    return new Promise((resolve, reject) => {
      this.internalDeleteUsbDeviceFile(dir, path, resolve, reject);
    });
  }

  internalDeleteUsbDeviceFile(dir, path, resolve, reject) {
    fs.unlink(dir, (err) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant deleteUsbDeviceFile`;
        logger.error('could not remove file! ', dir, err);
        reject();
        return;
      }
      this.platformObjects.getUSBUtility().syncUsbDevice(this.usbState).catch((error) => {
        logger.error(error);
      });
      this.listUsbDeviceItems(path);
      resolve();
    });
  }

  deleteUsbDeviceFolder(dir, path) {
    return new Promise((resolve, reject) => {
      this.internalDeleteUsbDeviceFolder(dir, path, resolve, reject);
    });
  }

  internalDeleteUsbDeviceFolder(dir, path, resolve, reject) {
    rimraf(dir, async (err) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = `${err.message} Cant deleteUsbDeviceFolder`;
        this.listUsbDeviceItems(path);
        logger.error('could not remove file! ', dir, err);
        reject();
        return;
      }
      await this.platformObjects.getUSBUtility().syncUsbDevice(this.usbState).catch((error) => {
        logger.error(error);
      });
      this.listUsbDeviceItems(path);
      resolve();
    });
  }

  async formatUsbDevice() {
    if (!this.usbState.isAvailable) {
      return;
    }

    await this.platformObjects.getUSBUtility().formatUSBDrive(this.usbState).catch((error) => {
      logger.error(error);
    });
    logger.debug('mountedPath:', this.usbState.mountedPath);
    this.listUsbDeviceItems('');
  }

  toggleUsbDevice() {
    if (!this.isSafeToToggleUsbDevice()) {
      return;
    }

    this.platformObjects.getUSBUtility().ejectUSBDriveSafely(this.usbState).then(() => {
      this.pinToggleSequence();
    }).catch((err) => {
      logger.error(err);
    });
  }

  isSafeToToggleUsbDevice() {
    if (this.timeToCheckSafety === 0) {
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    }
    if ((new Date().valueOf() - this.timeToCheckSafety) > MIN_TOGGLE_INTERVAL) { // Safety Margin is increased due to design
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    }
    return false;
  }

  pinToggleSequence() {
    if (this.toggleTimeoutHandle) {
      return;
    }
    const lastLedStateEcu = this.usbState.kvmLedStateECU;
    const lastLedStateRpi = this.usbState.kvmLedStateRPI;
    let tryCount = 0;

    this.platformObjects.getGPIOUtility().openForOutput(GPIOPins.KVM_TOGGLE_PIN, 0);

    const detectLedChangeInTimeIntervals = () => {
      this.checkKVMLedState();
      tryCount += 1;
      if ((lastLedStateEcu !== this.usbState.kvmLedStateECU) && (lastLedStateRpi !== this.usbState.kvmLedStateRPI)) {
        this.platformObjects.getGPIOUtility().close(GPIOPins.KVM_TOGGLE_PIN);
        this.toggleTimeoutHandle = undefined;
      } else if (tryCount < MAX_TRY_COUNT_LED) {
        this.toggleTimeoutHandle = setTimeout(detectLedChangeInTimeIntervals, 5);
      } else {
        logger.info('detectLedChange try count has been exceeded');
      }
    };
    detectLedChangeInTimeIntervals();
  }

  sendCurrentState() {
    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  uploadFileToUsbDevice(req, res) {
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.maxFileSize = 4 * 1024 * 1024 * 1024; // max file size, 4gb
    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {
      if (err) { // Handle error
        logger.error('error occurred during file upload!', err);
        res.status(500).send(err.toString());
        return;
      }

      const dir = nodePath.join(this.usbState.mountedPath, fields.currentDirectory);
      let fileCount = 1;
      let currentFileCounter = 0;
      const copyHandler = (file) => {
        fs.copyFile(file.path, nodePath.join(dir, file.name), (er) => {
          if (er) { // Handle error
            logger.error('error occured during file copy!', er);
            res.status(500).send(er.toString());
            return;
          }
          this.platformObjects.getUSBUtility().syncUsbDevice(this.usbState).catch((error) => {
            logger.error(error);
          });
          this.listUsbDeviceItems(fields.currentDirectory);

          currentFileCounter += 1;
          if (currentFileCounter === fileCount) {
            res.send('done');
          }
        });
      };

      if (Array.isArray(files.uploads)) {
        fileCount = files.uploads.length;
        files.uploads.forEach(copyHandler);
      } else {
        fileCount = 1;
        copyHandler(files.uploads);
      }
    });
  }

  getFileFromUsbDevice(req, res) {
    const { path } = req.query;
    const { fileName } = req.query;

    if (!path || !fileName) {
      res.status(400).send('invalid parameters');
      return;
    }

    const dir = nodePath.join(this.usbState.mountedPath, path, fileName);
    res.download(dir, fileName);
  }

  onExit() {
    this.usbDetect.stopMonitoring();

    if (this.ledReadIntervalHandle) {
      clearInterval(this.ledReadIntervalHandle);
    }
  }
}

module.exports = USBController;
