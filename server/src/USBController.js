// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { exec } = require('child_process');
const nodePath = require('path');
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
      }
      else if (obj.usb.action == 'detectUsbDevice') {
        this.detectUsbDevice();
      }
    }
  }

  detectDriveChanges() {
    let lastState = this.usbState.isAvailable;
    let self = this;
    let tryCount = 0;

    setTimeout(async function detectUsbInsertionInTimeIntervals() {
      await self.detectUsbDevice();
      tryCount++;
      if (self.usbState.isAvailable == lastState) {
        if (tryCount < maxTryCount) {
          setTimeout(detectUsbInsertionInTimeIntervals, 1000);
        }
        else console.log('detectUsbDevice try count has been exceeded');
      }
    }, 0);
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
          let USBName = exec(`wmic logicaldisk where "deviceid='${mountPath}'" get volumename`);
          this.usbState.mountedPath = mountPath;
          this.usbState.usbName = USBName.toString().split('\n')[1].trim();
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

  onExit() {
    usbDetect.stopMonitoring();
  }
}

module.exports = USBController;