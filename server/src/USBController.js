// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { execSync } = require('child_process');
const nodePath = require('path');
const fs = require('fs');

const USB_RELAY_PIN_ARRAY = [29, 31, 33, 35];
// const USB_RELAY_Vcc = 37;  Not sure whether should plug Vcc pin of the relay to the GPIO or not

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.usbState = {
      isAvailable: false,
      pluggedDevice: 'none', // or 'rpi', 'ecu'
      poweredOn: false,
      mountedPath: '',
      usbName: '',
      currentDirectory: '.',
      currentFiles: [],
    };
    this.timeToCheckSafety = 0;
  }

  init() {
    console.log("initializing USBController");
    USB_RELAY_PIN_ARRAY.forEach((pinNum) => {
      if (isNaN(pinNum) == false) {
        // open all ports regarding default value
        rpio.open(pinNum, rpio.OUTPUT, rpio.HIGH);
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
        this.changeUsbDeviceDirection(obj.usb.device).then(() => {
          this.detectUsbDevice();
        });
      } else if (obj.usb.action == 'detectUsbDevice') {
        this.detectUsbDevice();
      } else if (obj.usb.action == 'listFiles') {
        this.listUsbDeviceFiles(obj.usb.path);
      } else if(obj.usb.action == "deleteFile") {
        this.deleteUsbDeviceFile(obj.usb.path, obj.usb.fileName);
      }
    }
  }

  async detectUsbDevice() {
    // To get list of connected Drives
    let driveList = await drivelist.list();
    var index;
    for (index = 0; index < driveList.length; index++) {
      if (driveList[index].isUSB) {
        let mountPath = driveList[index].mountpoints[0].path; // Output= D:\ for windows. For now its mountpoints[0], since does not matter if it has 2 mount points
        if (process.platform == 'win32') {
          mountPath = mountPath.slice(0, -1); //Output= D: for windows
          let USBName = execSync(`wmic logicaldisk where "deviceid='${mountPath}'" get volumename`);
          this.usbState.mountedPath = mountPath;
          this.usbState.usbName = USBName.toString().split('\n')[1].trim();
          this.usbState.isAvailable = true;
          this.sendCurrentState();
        } else {
          let USBName = nodePath.basename(mountPath);
          this.usbState.mountedPath = mountPath;
          this.usbState.usbName = USBName;
          this.usbState.isAvailable = true;
          this.sendCurrentState();
        }
        break;
      } else if (index == driveList.length - 1) {
        this.usbState.mountedPath = [];
        this.usbState.usbName = [];
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
      this.pinPlugSequence(deviceString);
      //this.sendCurrentState(); It's not necessary now since sending state after changing direction with the detecting usb in line 47-48
    } else {
      console.log("Pressing the button repeatedly Alert!");
      return;
    }
  }

  isSafeToChangeUsbDeviceDirection() {
    if (this.timeToCheckSafety == 0) {
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else if ((new Date().valueOf() - this.timeToCheckSafety) > 250) {
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else {
      return false;
    }
  }

  pinPlugSequence(deviceString) {
    let state = (deviceString == 'rpi') ? 0 : 1;
    if (state == 0) {
      rpio.write(USB_RELAY_PIN_ARRAY[0], state);
      rpio.write(USB_RELAY_PIN_ARRAY[3], state);
      rpio.write(USB_RELAY_PIN_ARRAY[2], state);
      rpio.write(USB_RELAY_PIN_ARRAY[1], state);
      this.poweredOn = true;
    }
    else if (state == 1) {
      rpio.write(USB_RELAY_PIN_ARRAY[1], state);
      rpio.write(USB_RELAY_PIN_ARRAY[2], state);
      rpio.write(USB_RELAY_PIN_ARRAY[3], state);
      rpio.write(USB_RELAY_PIN_ARRAY[0], state);
      this.poweredOn = false;
    }
    this.usbState.pluggedDevice = deviceString;
  }

  sendCurrentState() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }
}

module.exports = USBController;