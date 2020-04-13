// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');
const drivelist = require('drivelist');
const { execSync } = require('child_process');
const nodePath = require('path');


const USB_RELAY_PIN_ARRAY = [29, 31, 33, 35];
// const USB_RELAY_Vcc = 37;  Not sure whether should plug Vcc pin of the relay to the GPIO or not

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.usbState = {
      pluggedDevice: 'none', // or 'rpi', 'ecu'
      poweredOn: true,

    };
    this.timeToCheckSafety = 0;
    this.usbID = {
      mountedPath: [],
      usbName: [],

    };

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
          this.usbID.mountPath = mountPath;
          this.usbID.usbName = USBName.toString().split('\n')[1];
          console.log(this.usbID.mountPath);
          console.log(this.usbID.usbName);
        }
        else {
          let USBName = nodePath.basename(mountPath);
          this.usbID.mountPath = mountPath;
          this.usbID.usbName = USBName;
          console.log(this.usbID.mountPath);
          console.log(this.usbID.usbName);
        }
        break;
      }
      else if (index == driveList.length - 1) {
        this.usbID.mountPath = [];
        this.usbID.usbName = [];
        console.log("There are no USB Drives!!!");
        console.log(this.usbID.mountPath);
        console.log(this.usbID.usbName);


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
    let safety = this.isSafeTochangeUsbDeviceDirection();
    if (safety) {
      this.pinPlugSequence(deviceString);
      this.sendCurrentState();
    }
    else {
      console.log("Pressing the button repeatedly Alert!");
      return;
    }
  }

  isSafeTochangeUsbDeviceDirection() {
    if (this.timeToCheckSafety == 0) {
      this.timeToCheckSafety = new Date().valueOf();
      return 1;
    }
    else if ((new Date().valueOf() - this.timeToCheckSafety) > 250) {
      this.timeToCheckSafety = new Date().valueOf();
      return 1;
    }
    else { return 0; }
  }

  pinPlugSequence(deviceString) {
    let state = (deviceString == 'rpi') ? 0 : 1;
    if (state == 0) {
      rpio.write(USB_RELAY_PIN_ARRAY[0], state);
      rpio.write(USB_RELAY_PIN_ARRAY[3], state);
      rpio.write(USB_RELAY_PIN_ARRAY[2], state);
      rpio.write(USB_RELAY_PIN_ARRAY[1], state);
    }
    else if (state == 1) {
      rpio.write(USB_RELAY_PIN_ARRAY[1], state);
      rpio.write(USB_RELAY_PIN_ARRAY[2], state);
      rpio.write(USB_RELAY_PIN_ARRAY[3], state);
      rpio.write(USB_RELAY_PIN_ARRAY[0], state);
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