// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { execSync } = require('child_process');
const nodePath = require('path');
var usbDetect = require('usb-detection');

const USB_KVM_PIN = [33];
const toggleHoldTime = 150; //ms

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.usbState = {
      isAvailable: false,
      pluggedDevice: 'rpi', // or 'none', 'ecu'
      poweredOn: true,
      mountedPath: [],
      usbName: [],
      device: [],
    };
    this.timeToCheckSafety = 0;
  }

  init() {
    console.log("initializing USBController");
    usbDetect.startMonitoring();
    usbDetect.on('add', (device) => {
      this.detectDriveChanges();
    });
    usbDetect.on('remove', (device) => {
      this.detectDriveChanges();
    });
    this.detectUsbDevice();
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
      }
      else if (obj.usb.action == 'detectUsbDevice') {
        this.detectUsbDevice();
      }
    }
  }

  detectDriveChanges() {
    if ((this.usbState.usbName).length == 0) {
      var self = this;
      setTimeout(async function detectUsbInsertionInTimeIntervals() {
        await self.detectUsbDevice();
        if ((self.usbState.usbName).length == 0) {
          setTimeout(detectUsbInsertionInTimeIntervals, 1000);
        }
      }, 1000);
    }
    else {
      var self = this;
      setTimeout(async function detectUsbEjectionInTimeIntervals() {
        await self.detectUsbDevice();
        if ((self.usbState.usbName).length != 0) {
          setTimeout(detectUsbEjectionInTimeIntervals, 1000);
        }
      }, 1000);

    }
  }

  async detectUsbDevice() {
    // To get list of connected Drives
    let driveList = await drivelist.list();
    var index;
    for (index = 0; index < driveList.length; index++) {
      if (driveList[index].isUSB && this.usbState.poweredOn && (driveList[index].mountpoints[0] != "undefined")) {
        let mountPath = driveList[index].mountpoints[0].path; // Output= D:\ for windows. For now its mountpoints[0], since does not matter if it has 2 mount points
        if (process.platform == 'win32') {
          mountPath = mountPath.slice(0, -1); //Output= D: for windows
          let USBName = execSync(`wmic logicaldisk where "deviceid='${mountPath}'" get volumename`);
          this.usbState.mountedPath = mountPath;
          this.usbState.usbName = USBName.toString().split('\n')[1].trim();
          this.usbState.isAvailable = true;
          this.usbState.pluggedDevice = 'rpi';
          this.sendCurrentState();
        } else if (process.platform == 'linux') {
          let USBName = nodePath.basename(mountPath);
          this.usbState.device = driveList[index].device;
          this.usbState.mountedPath = mountPath;
          this.usbState.usbName = USBName;
          this.usbState.isAvailable = true;
          this.usbState.pluggedDevice = 'rpi';
          this.sendCurrentState();
        }
        break;
      } else if (index == driveList.length - 1) {
        this.usbState.mountedPath = [];
        this.usbState.usbName = [];
        this.usbState.device = [];
        this.usbState.isAvailable = false;
        this.usbState.pluggedDevice = 'none';
        this.sendCurrentState();
      }
    }
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

      //this.sendCurrentState(); It's not necessary now since sending state after changing direction with the detecting usb
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
      execSync(`sudo eject ${this.usbState.device}`);
      this.usbState.poweredOn = false;
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
    if (deviceString == 'none') {
      rpio.open(USB_KVM_PIN, rpio.OUTPUT, rpio.LOW);
      rpio.msleep(toggleHoldTime); // It should be between 10ms and 290ms
      rpio.close(USB_KVM_PIN);
      // this.usbState.poweredOn has already assigned to false in fnc ejectUSBDriveSafely line 119
    }
    else if (deviceString == 'rpi') {
      rpio.open(USB_KVM_PIN, rpio.OUTPUT, rpio.LOW);
      rpio.msleep(toggleHoldTime); // It should be between 10ms and 290ms
      rpio.close(USB_KVM_PIN);
      this.usbState.poweredOn = true;
    }
    this.usbState.pluggedDevice = deviceString;
  }

  sendCurrentState() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }

  onExit() {
    process.on('SIGINT', function () {
      usbDetect.stopMonitoring();
      process.exit();
    });
  }
}

module.exports = USBController;