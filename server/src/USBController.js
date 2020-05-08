// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { exec } = require('child_process');
const nodePath = require('path');
const fs = require('fs');
const formidable = require('formidable');
const usbDetect = require('usb-detection');
const md5File = require('md5-file');
const rimraf = require('rimraf');
const getSize = require('get-folder-size');
const GPIOPins = require('./GPIOPins');

const MAX_TRY_COUNT_DRIVE = 30; // 30 attempts attempts within 1s resulting in appr. 30s
const MAX_TRY_COUNT_LED = 200; // 200 attempts within 5ms resulting in appr. 1s
const LED_CHECK_TIME_INTERVAL = 1000; //ms
const MIN_TOGGLE_INTERVAL = 1000; // ms

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
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
  }

  isAuthRequired() {
    return true
  }

  init() {
    console.log("initializing USBController");
    usbDetect.startMonitoring();
    usbDetect.on('change', () => {
      this.detectDriveChanges();
    });

    // open led gpio port to read
    rpio.open(GPIOPins.KVM_LED_RPI, rpio.INPUT);
    rpio.open(GPIOPins.KVM_LED_ECU, rpio.INPUT);

    this.detectUsbDevice();

    this.ledReadIntervalHandle = setInterval(this.checkKVMLedState.bind(this), LED_CHECK_TIME_INTERVAL);
  }

  checkKVMLedState() {
    // read led states
    const rpiLed = rpio.read(GPIOPins.KVM_LED_RPI);
    const ecuLed = rpio.read(GPIOPins.KVM_LED_ECU);

    if (this.usbState.kvmLedStateRPI == rpiLed && this.usbState.kvmLedStateECU == ecuLed) {
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
    obj["usb"] = this.getCopyState();
  }

  handleMessage(obj, client) {

    if (typeof obj.usb != "undefined") {
      //var obj = { usb: {action, device} };
      if (obj.usb.action == 'toggleDevice') {
        this.toggleUsbDevice();
      } else if (obj.usb.action == 'detectUsbDevice') {
        this.detectUsbDevice();
      } else if (obj.usb.action == 'listItems') {
        this.listUsbDeviceItems(obj.usb.path);
      } else if (obj.usb.action == "deleteItem") {
        this.deleteUsbDeviceItem(obj.usb.path, obj.usb.itemName);
      } else if (obj.usb.action == "getItemInfo") {
        this.getItemInfo(obj.usb.path, obj.usb.itemName);
      } else if (obj.usb.action == "createFolder") {
        this.createUsbDeviceFolder(obj.usb.path, obj.usb.folderName);
      }
    }
  }

  detectDriveChanges() {
    let lastState = this.usbState.isAvailable;
    let tryCount = 0;

    const detectUsbInsertionInTimeIntervals = () => {
      this.detectUsbDevice().then(() => {
        tryCount++;
        if (this.usbState.isAvailable == lastState) {
          if (tryCount < MAX_TRY_COUNT_DRIVE) {
            setTimeout(detectUsbInsertionInTimeIntervals, 1000);
          } else {
            console.log('detectUsbDevice try count has been exceeded');
          }
        }
      });
    }

    detectUsbInsertionInTimeIntervals();
  }

  async detectUsbDevice() {
    // To get list of connected Drives
    this.usbState.usbErrorString = '';
    let driveList = await drivelist.list();
    let isDriveFound = false;
    for (let index = 0; index < driveList.length; index++) {
      if (driveList[index].isUSB && driveList[index].mountpoints && (typeof driveList[index].mountpoints[0] != "undefined")) {
        let mountPath = driveList[index].mountpoints[0].path; // Output= D:\ for windows. For now its mountpoints[0], since does not matter if it has 2 mount points
        let device = driveList[index].device;
        if (process.platform == 'win32') {
          await this.extractUsbStateWin32(mountPath);
          isDriveFound = true;
        } else if (process.platform == 'linux') {
          this.extractUsbStateLinux(mountPath, device);
          isDriveFound = true;
        }
        break;
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

  extractUsbStateWin32(mountPath) {
    return new Promise((resolve, reject) => {
      mountPath = mountPath.slice(0, -1); //Output= D: for windows
      exec(`wmic logicaldisk where "deviceid='${mountPath}'" get volumename`, (err, stdout, stderr) => {
        if (err) { // Handle error
          this.usbState.usbErrorString = err.message + " Cant extractUsbStateWin32";
          reject();
        }
        let usbName = stdout;
        if (!usbName) {
          reject();
        }

        const splittedUsbName = usbName.toString().split('\n');
        if (splittedUsbName.length < 2) {
          reject();
        }

        this.usbState.device = '';
        this.usbState.usbName = splittedUsbName[1].trim();
        this.usbState.mountedPath = mountPath;
        this.usbState.isAvailable = true;
        resolve();
      });
    });
  }

  extractUsbStateLinux(mountPath, device) {
    let USBName = nodePath.basename(mountPath);
    this.usbState.device = device; // For safe eject, device = '/dev/sda' ...
    this.usbState.mountedPath = mountPath;
    this.usbState.usbName = USBName;
    this.usbState.isAvailable = true;
  }

  listUsbDeviceItems(path) {
    if (this.usbState.mountedPath == '') {
      // send empty item list
      this.usbState.currentDirectory = path;
      this.usbState.currentItems = [];
      this.sendCurrentState();
      return;
    }

    let dir = nodePath.join(this.usbState.mountedPath, path);
    let parentDir = nodePath.join(path, '..');
    fs.readdir(dir, { withFileTypes: true }, (err, items) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + ' Cant listUsbDeviceItems';
        this.sendCurrentState();
        return console.log('Unable to scan directory: ' + err);
      }
      let itemsList = [];
      if (parentDir != '..') {
        itemsList.push({ name: parentDir, isDirectory: true, fullPath: true });
      }

      items.forEach(item => {
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
    });
  }

  getItemInfo(path, itemName) {
    let dir = nodePath.join(this.usbState.mountedPath, path, itemName);
    this.usbState.usbErrorString = "";
    fs.stat(dir, (err, stats) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + ' Cant getFileStatus';
        this.listUsbDeviceItems(path);
        return console.log(err);
      }
      let itemInfo = {
        path: dir,
        name: itemName,
        createDate: new Date(stats.birthtime).toLocaleString(),
        modifyDate: new Date(stats.mtime).toLocaleString(),
        size: undefined,
        md5: undefined,
      }

      if (stats.isFile()) {
        this.getFileInfo(stats, dir, itemInfo);
      }
      else if (stats.isDirectory()) {
        this.getFolderInfo(stats, dir, itemInfo);
      }

    });
  }

  convertItemSizeToString(sizeInBytes) {
    let sizeString = '';
    const fileSizeInGB = (sizeInBytes / 1024 / 1024 / 1024).toFixed(2);
    if (fileSizeInGB < 1) {
      const fileSizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);
      if (fileSizeInMB < 1) {
        const fileSizeInKB = (sizeInBytes / 1024).toFixed(2);
        if (fileSizeInKB < 1) {
          sizeString = sizeInBytes + " Bytes";
        } else {
          sizeString = fileSizeInKB + " KB";
        }
      } else {
        sizeString = fileSizeInMB + " MB";
      }
    } else {
      sizeString = fileSizeInGB + " GB";
    }

    return sizeString;
  }

  async getFileInfo(stats, dir, itemInfo) {
    itemInfo.md5 = await md5File(dir);
    itemInfo.size = this.convertItemSizeToString(stats.size);

    // send item info
    this.usbState.currentItemInfo = itemInfo;
    this.sendCurrentState();
  }

  getFolderInfo(stats, dir, itemInfo) {
    getSize(dir, (err, size) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + " Cant getFolderInfo-getSize";
        this.listUsbDeviceItems(path);
        return console.log(err);
      }

      itemInfo.size = this.convertItemSizeToString(size);
      this.usbState.currentItemInfo = itemInfo;
      this.sendCurrentState();
    });
  }

  createUsbDeviceFolder(path, folderName) {
    let dir = nodePath.join(this.usbState.mountedPath, path, folderName);
    this.usbState.usbErrorString = "";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + " Cant createUsbDeviceFolder";
        this.listUsbDeviceItems(path);
        return console.log(err);

      }
      this.syncUsbDevice();
      this.listUsbDeviceItems(path);
    });
  }

  deleteUsbDeviceItem(path, itemName) {
    let dir = nodePath.join(this.usbState.mountedPath, path, itemName);
    this.usbState.usbErrorString = "";
    fs.lstat(dir, (err, stats) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + " Cant getFileStatus";
        this.listUsbDeviceItems(path);
        return console.log(err);
      }
      if (stats.isFile()) { // if it's a file 
        this.deleteUsbDeviceFile(dir, path);
      }
      else if (stats.isDirectory()) { // if it's a folder
        this.deleteUsbDeviceFolder(dir, path);
      }
    });
  }

  deleteUsbDeviceFile(dir, path) {
    fs.unlink(dir, (err) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + "Cant deleteUsbDeviceFile";
        console.log("could not remove file! ", dir, err);
      }
      this.syncUsbDevice();
      this.listUsbDeviceItems(path);
    })
  }

  deleteUsbDeviceFolder(dir, path) {
    rimraf(dir, async (err) => {
      if (err) { // Handle error
        this.usbState.usbErrorString = err.message + " Cant deleteUsbDeviceFolder";
        this.listUsbDeviceItems(path);
        console.log("could not remove folder! ", dir, err);
      }
      await this.syncUsbDevice();
      this.listUsbDeviceItems(path);
    })
  }

  syncUsbDevice() {
    return new Promise((resolve, reject) => {
      if (!this.usbState.isAvailable) {
        resolve();
      }
      else {
        if (process.platform == 'win32') {
          exec(`.\\bin\\win32\\sync -r ${this.usbState.mountedPath}`, (err, stdout, stderr) => {
            if (err) { // Handle error
              this.usbState.usbErrorString = err.message + " Cant syncUsbDeviceWin32";
              reject();
            }
            console.log('synchronized usb drive');
            resolve();
          });
        }
        else if (process.platform == 'linux') {
          exec(`sync ${this.usbState.mountedPath}`, (err, stdout, stderr) => {
            if (err) { // Handle error
              this.usbState.usbErrorString = err.message + " Cant syncUsbDeviceLinux";
              reject();
            }
            console.log("synchronized usb drive");
            resolve();
          });
        }
      }
    });
  }

  toggleUsbDevice() {
    if (!this.isSafeToToggleUsbDevice()) {
      return;
    }

    this.ejectUSBDriveSafely().then(() => {
      this.pinToggleSequence();
    });
  }

  ejectUSBDriveSafely() {
    return new Promise((resolve, reject) => {
      if (!this.usbState.isAvailable) {
        resolve();
      }
      else {
        if (process.platform == 'win32') {
          exec(`sync -e ${this.usbState.mountedPath}`, (err, stdout, stderr) => {
            if (err) { // Handle error
              this.usbState.usbErrorString = err.message + " Cant ejectUSBDriveSafelyWin32";
              reject();
            }
            console.log('ejected usb drive from windows');
            resolve();
          });
        }
        else if (process.platform == 'linux') {
          exec(`sudo eject ${this.usbState.device}`, (err, stdout, stderr) => {
            if (err) { // Handle error
              this.usbState.usbErrorString = err.message + " Cant ejectUSBDriveSafelyLinux";
              reject();
            }
            console.log("ejected usb drive");
            resolve();
          });
        }
      }
    });
  }

  isSafeToToggleUsbDevice() {
    if (this.timeToCheckSafety == 0) {
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else if ((new Date().valueOf() - this.timeToCheckSafety) > MIN_TOGGLE_INTERVAL) { // Safety Margin is increased due to design
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else {
      return false;
    }
  }

  pinToggleSequence() {
    if (this.toggleTimeoutHandle) {
      return;
    }
    let lastLedStateEcu = this.usbState.kvmLedStateECU;
    let lastLedStateRpi = this.usbState.kvmLedStateRPI;
    let tryCount = 0;
    rpio.open(GPIOPins.KVM_TOGGLE_PIN, rpio.OUTPUT, rpio.LOW);

    const detectLedChangeInTimeIntervals = () => {
      this.checkKVMLedState();
      tryCount++;
      if ((lastLedStateEcu != this.usbState.kvmLedStateECU) && (lastLedStateRpi != this.usbState.kvmLedStateRPI)) {
        rpio.close(GPIOPins.KVM_TOGGLE_PIN);
        this.toggleTimeoutHandle = undefined;
      }
      else {
        if (tryCount < MAX_TRY_COUNT_LED) {
          this.toggleTimeoutHandle = setTimeout(detectLedChangeInTimeIntervals, 5);
        }
        else {
          console.log('detectLedChange try count has been exceeded');
        }
      }
    }
    detectLedChangeInTimeIntervals();
  }

  sendCurrentState() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  uploadFileToUsbDevice(req, res) {
    let form = new formidable.IncomingForm();
    form.multiples = true;
    form.maxFileSize = 4 * 1024 * 1024 * 1024; // max file size, 4gb
    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {
      if (err) { // Handle error
        console.log("error occurred during file upload!", err);
        res.status(500).send(err.toString());
        return;
      }

      let dir = nodePath.join(this.usbState.mountedPath, fields.currentDirectory);
      let fileCount = 1;
      let currentFileCounter = 0;
      const copyHandler = (file) => {
        fs.copyFile(file.path, nodePath.join(dir, file.name), (err) => {
          if (err) { // Handle error
            console.log("error occured during file copy!", err)
            res.status(500).send(err.toString());
            return;
          }
          this.syncUsbDevice();
          this.listUsbDeviceItems(fields.currentDirectory);

          currentFileCounter++;
          if (currentFileCounter == fileCount) {
            res.send('done');
          }
        });
      }

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
    let path = req.query.path;
    let fileName = req.query.fileName;

    if (!path || !fileName) {
      res.status(400).send("invalid parameters");
    }

    let dir = nodePath.join(this.usbState.mountedPath, path, fileName);
    res.download(dir, fileName);
  }

  onExit() {
    usbDetect.stopMonitoring();

    if (this.ledReadIntervalHandle) {
      clearInterval(this.ledReadIntervalHandle);
    }
  }
}

module.exports = USBController;