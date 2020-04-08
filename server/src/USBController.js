// Class for Controlling the USB Flash Storage
const rpio = require('rpio');
const cloneDeep = require('clone-deep');

const USB_RELAY_CHANNEL1_PIN = 29;
const USB_RELAY_CHANNEL2_PIN = 31;
const USB_RELAY_CHANNEL3_PIN = 33;
const USB_RELAY_CHANNEL4_PIN = 35;
// const USB_RELAY_Vcc = 37;  Not sure whether should plug Vcc pin of the relay to the GPIO or not

class USBController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.usbState = {
      pluggedDevice: 'rpi', // or 'ecu'
      poweredOn: true,
    };

    /*this.gpioState = {};
    this.gpioState[29] = rpio.HIGH;    // Default State is this way.
    this.gpioState[31] = rpio.HIGH;    // Relay is switched by making LOW.
    this.gpioState[33] = rpio.HIGH;    // HIGH -> Flash Storage is on PI
    this.gpioState[35] = rpio.HIGH;    // LOW -> Flash Storage is on ECU */
  }

  init() {
    console.log("initializing USBController");
    /*let gpioPins = Object.keys(this.gpioState);
    gpioPins.forEach((pinNum) => {
      if (isNaN(pinNum) == false) {
        // open all pins regarding default value
        rpio.open(pinNum, rpio.OUTPUT, this.gpioState[pinNum]);
      }
    });*/

    // Initially connect usb device to raspberry pi
    // Initially Relay's Common and NO Pins are connected
    rpio.open(USB_RELAY_CHANNEL1_PIN, rpio.OUTPUT, rpio.HIGH);
    rpio.open(USB_RELAY_CHANNEL2_PIN, rpio.OUTPUT, rpio.HIGH);
    rpio.open(USB_RELAY_CHANNEL3_PIN, rpio.OUTPUT, rpio.HIGH);
    rpio.open(USB_RELAY_CHANNEL4_PIN, rpio.OUTPUT, rpio.HIGH);
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
      let state = obj["usb"].state ? rpio.HIGH : rpio.LOW;
      //var obj = { usb: {action:'changeDirection', device: value} };
      if (obj.usb.action == 'changeDirection') {
        this.changeUsbDeviceDirection(obj.usb.device);
      }
    }
  }

  changeUsbDeviceDirection(deviceString) {
    if (deviceString != 'rpi' && deviceString != 'ecu') {
      console.log("USBController: invalid device name")
    }

    if (this.usbState.pluggedDevice == deviceString) {
      return;
    }

    this.pinPlugSequence(deviceString);
    this.sendCurrentState();
  }

  pinPlugSequence(deviceString) {
    let state = deviceString == 'rpi' ? 1 : 0;
    rpio.write(USB_RELAY_CHANNEL1_PIN, state);
    rpio.write(USB_RELAY_CHANNEL4_PIN, state);
    rpio.write(USB_RELAY_CHANNEL3_PIN, state);
    rpio.write(USB_RELAY_CHANNEL2_PIN, state);

    this.usbState.pluggedDevice = deviceString;
    /*rpio.write(USB_RELAY_CHANNEL1_PIN, state);
    await pin4();
    await pin3();
    await pin2();
    pin4 = () => {
      return new Promise(resolve => {
        setTimeout(() => { rpio.write(USB_RELAY_CHANNEL4_PIN, state); }, 500);
        console.log("500ms bekle");
      })
    }
    pin3 = () => {
      return new Promise(resolve => {
        setTimeout(() => { rpio.write(USB_RELAY_CHANNEL3_PIN, state); }, 500);
        console.log("500ms bekle");
      })
    }
    pin2 = () => {
      return new Promise(resolve => {
        setTimeout(() => { rpio.write(USB_RELAY_CHANNEL2_PIN, state); }, 500);
        console.log("500ms bekle");
      })
    }*/
  }

  sendCurrentState() {
    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }
}

module.exports = USBController;