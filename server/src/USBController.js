// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { execSync } = require('child_process');
const nodePath = require('path');

const USB_KVM_PIN = [33];
//const USB_RELAY_PIN_ARRAY = [29, 31, 33, 35];
// const USB_RELAY_Vcc = 37;  Not sure whether should plug Vcc pin of the relay to the GPIO or not

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.usbState = {
      isAvailable: false,
      pluggedDevice: 'rpi', // or 'none', 'ecu'
      poweredOn: true,
      mountedPath: [],
      usbName: [],
    };
    this.timeToCheckSafety = 0;
  }

  init() {
    console.log("initializing USBController");
    //USB_RELAY_PIN_ARRAY.forEach((pinNum) => {
      //if (isNaN(pinNum) == false) {
        // open all ports regarding default value
        //rpio.open(pinNum, rpio.OUTPUT, rpio.HIGH);
     //}
    //});
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
      }
      else if (obj.usb.action == 'detectUsbDevice') {
        this.detectUsbDevice();
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
    } else if ((new Date().valueOf() - this.timeToCheckSafety) > 1000) { // Safety Margin is increased due to design
      this.timeToCheckSafety = new Date().valueOf();
      return true;
    } else {
      return false;
    }
  }

  pinPlugSequence(deviceString) {
    let state = (deviceString == 'rpi') ? 0 : 1;
    if (state == 0) {
      rpio.open(USB_KVM_PIN, rpio.OUTPUT, rpio.LOW);
      rpio.msleep(200);
      rpio.close(USB_KVM_PIN);
      this.poweredOn = false; // for now its false but switching direction btw rpi-ecu -> this will be true
    }
    else if (state == 1) {
      rpio.open(USB_KVM_PIN, rpio.OUTPUT, rpio.LOW);
      rpio.msleep(200);
      rpio.close(USB_KVM_PIN);
      this.poweredOn = true; 
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