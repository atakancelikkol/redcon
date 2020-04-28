// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { exec, execSync } = require('child_process');
const nodePath = require('path');
const fs = require('fs');
const formidable = require('formidable');
var usbDetect = require('usb-detection');

const USB_KVM_PIN = [33];
const toggleHoldTime = 150; //ms
const maxTryCount = 30;

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.usbState = {
      isAvailable: true,
      pluggedDevice: 'rpi', // or 'none', 'ecu'
      poweredOn: true,
      mountedPath: '',
      usbName: '',
      device: '',
      currentDirectory: '.',
      currentFiles: [],
    };
    this.timeToCheckSafety = 0;
  }

  init() {
    console.log("initializing USBController");
    usbDetect.startMonitoring();
    usbDetect.on('change', () => {
      this.detectDriveChanges();
    });
    this.detectUsbDevice().then(() => {
      if (this.usbState.isAvailable == false) {
        this.usbState.pluggedDevice = 'none';
        this.poweredOn = false;
        this.sendCurrentState();
      }
    });
  }

  getCopyState() {
    return cloneDeep(this.usbState);
  }

  appendData(obj) {
    // this function returns the initial state
    obj["usb"] = this.getCopyState();
  }

  handleMessage(obj) {
    if (typeof obj.usb != "undefined") {
      //var obj = { usb: {action, device} };
      if (obj.usb.action == 'changeDirection') {
        this.changeUsbDeviceDirection(obj.usb.device);
      } else if (obj.usb.action == 'detectUsbDevice') {
        this.detectUsbDevice();
      } else if (obj.usb.action == 'listFiles') {
        this.listUsbDeviceFiles(obj.usb.path);
      } else if(obj.usb.action == "deleteFile") {
        this.deleteUsbDeviceFile(obj.usb.path, obj.usb.fileName);
      }
    }
  }

  detectDriveChanges() {
    let lastState = this.usbState.isAvailable;
    let self = this;
    let tryCount = 0;

    setTimeout(function detectUsbInsertionInTimeIntervals() {
      self.detectUsbDevice().then(() => {
        tryCount++;
        if (self.usbState.isAvailable == lastState) {
          if (tryCount < maxTryCount) {
            setTimeout(detectUsbInsertionInTimeIntervals, 1000);
          }
          else console.log('detectUsbDevice try count has been exceeded');
        }
      });
    }, 1);
  }

  async detectUsbDevice() {
    // To get list of connected Drives
    let driveList = await drivelist.list();
    var index;
    for (index = 0; index < driveList.length; index++) {
      if (driveList[index].isUSB && (driveList[index].mountpoints[0] != "undefined")) {
        let mountPath = driveList[index].mountpoints[0].path; // Output= D:\ for windows. For now its mountpoints[0], since does not matter if it has 2 mount points
        if (process.platform == 'win32') {
          mountPath = mountPath.slice(0, -1); //Output= D: for windows
          let USBName = execSync(`wmic logicaldisk where "deviceid='${mountPath}'" get volumename`);
          this.usbState.usbName = USBName.toString().split('\n')[1].trim();
          this.usbState.mountedPath = mountPath;
          this.usbState.isAvailable = true;
          this.sendCurrentState();
        } else if (process.platform == 'linux') {
          let USBName = nodePath.basename(mountPath);
          this.usbState.device = driveList[index].device; // For safe eject, device = '/dev/sda' ...
          this.usbState.mountedPath = mountPath;
          this.usbState.usbName = USBName;
          this.usbState.isAvailable = true;
          this.sendCurrentState();
        }
        break;
      } else if (index == driveList.length - 1) {
        this.usbState.mountedPath = '';
        this.usbState.usbName = '';
        this.usbState.device = '';
        this.usbState.isAvailable = false;
        this.sendCurrentState();
      }
    }
  }

  listUsbDeviceFiles(path) {
    //console.log("list files",path,"\n",this.usbState);
    let dir = nodePath.join(this.usbState.mountedPath, path);
    let parentDir = nodePath.join(path, '..');
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
      //handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      } else {
        let filesList = [];
        if(parentDir != '..') {
          filesList.push({name: parentDir, isDirectory: true, fullPath: true});
        }

        files.forEach(file => {
          filesList.push({
            name: file.name,
            isDirectory: file.isDirectory(),
          });
        });

        filesList.sort((a,b) => {
          if (a.isDirectory && b.isDirectory) return 0;
          if (!a.isDirectory && b.isDirectory) return 1;
          return -1;
        });

        this.usbState.currentDirectory = dir;
        this.usbState.currentFiles = filesList;

        this.sendCurrentState();
      }
    });
  }

  deleteUsbDeviceFile(path, fileName) {
    let dir = nodePath.join(this.usbState.mountedPath, path, fileName);
    fs.unlink(dir, (err) => {
      if(err) {
        console.log("could not remove file! ", dir, err);
      }

      this.listUsbDeviceFiles(path);
    })
  }

  async changeUsbDeviceDirection(deviceString) {
    if (deviceString != 'rpi' && deviceString != 'none' && deviceString != 'ecu') {
      console.log("USBController: invalid device name")
    }

    if (this.usbState.pluggedDevice == deviceString) {
      return;
    }

    let safety = this.isSafeToChangeUsbDeviceDirection();
    if (safety) {
      if (this.usbState.pluggedDevice == 'rpi') {
        this.ejectUSBDriveSafely();
      }
      this.pinPlugSequence(deviceString);
      this.sendCurrentState(); // Send current state now since after change dir. there is no detect event
    } else {
      console.log("Pressing the button repeatedly Alert!");
      return;
    }
  }

  ejectUSBDriveSafely() {
    if (process.platform == 'win32') {
      //could not find right cmd on windows to eject usb drive for now
    }
    else if (process.platform == 'linux') {
      exec(`sudo eject ${this.usbState.device}`);
    }
  }

  isSafeToChangeUsbDeviceDirection() {
    if (this.timeToCheckSafety == 0) {
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else if ((new Date().valueOf() - this.timeToCheckSafety) > 1000) { // Safety Margin is increased due to design
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else {
      return false;
    }
  }

  pinPlugSequence(deviceString) {
    rpio.open(USB_KVM_PIN, rpio.OUTPUT, rpio.LOW);
    setTimeout(function () {
      rpio.close(USB_KVM_PIN);
    }, toggleHoldTime); // It should be between 10ms and 290ms
    this.usbState.poweredOn = !(this.usbState.poweredOn);

    this.usbState.pluggedDevice = deviceString;
  }

  sendCurrentState() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }

  uploadFileToUsbDevice(req, res) {
    let form = new formidable.IncomingForm();
    form.multiples = true;
    form.maxFileSize = 4 * 1024 * 1024 * 1024; // max file size, 4gb
    // parse the incoming request containing the form data
    form.parse(req, (err, fields, files) => {
      if(err) {
        console.log("error occurred during file upload!", err);
        res.status(500).send(err.toString());
        return;
      }

      let dir = nodePath.join(this.usbState.mountedPath, fields.currentDirectory);
      let fileCount = 1;
      let currentFileCounter = 0;
      const copyHandler = (file) => {
        fs.copyFile(file.path, nodePath.join(dir, file.name), (err) => {
          if(err) {
            console.log("error occured during file copy!", err)
            res.status(500).send(err.toString());
            return;
          }

          this.listUsbDeviceFiles(fields.currentDirectory);

          currentFileCounter++;
          if(currentFileCounter == fileCount) {
            res.send('done');
          }
        });
      }

      if(Array.isArray(files.uploads)) {
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

    if(!path || !fileName) {
      res.status(400).send("invalid parameters");
    }

    let dir = nodePath.join(this.usbState.mountedPath, path, fileName);
    res.download(dir, fileName);
  }
  
  onExit() {
    usbDetect.stopMonitoring();
  }
}

module.exports = USBController;