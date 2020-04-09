// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');

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
      //var obj = { usb: {action:'changeDirection', device: value} };
      if (obj.usb.action == 'changeDirection') {
        this.changeUsbDeviceDirection(obj.usb.device);
      }
    }
  }

  changeUsbDeviceDirection(deviceString) {
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