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
    this.gpioState = {};
    this.gpioState[29] = rpio.HIGH;    // Default State is this way.
    this.gpioState[31] = rpio.HIGH;    // Relay is switched by making LOW.
    this.gpioState[33] = rpio.HIGH;    // HIGH -> Flash Storage is on PI
    this.gpioState[35] = rpio.HIGH;    // LOW -> Flash Storage is on ECU 
    //this.gpioState[37] = rpio.HIGH; //  Not sure
    //this.startTime = 0;               // 
    //this.endTime = 0;                 // 
    this.history = [];
  }

  init() {
    console.log("initializing USBController");
    let gpioPins = Object.keys(this.gpioState);
    gpioPins.forEach((pinNum) => {
      if (isNaN(pinNum) == false) {
        // open all pins regarding default value
        rpio.open(pinNum, rpio.OUTPUT, this.gpioState[pinNum]);
      }
    });
  }

  getCopyState() {
    return {
      state: this.gpioState[29],   // O anki state'i PIN29'dan cekiyoruz
      //startTime: this.startTime,
      //endTime: this.endTime,
      history: [...this.history],
    }
  }

  appendData(obj) {
    // this function returns the initial state
    obj["usb"] = this.getCopyState();
  }

  handleMessage(obj) {
    if (typeof obj.usb != "undefined") {
      let state = obj["usb"].state ? rpio.HIGH : rpio.LOW;
      this.setGPIOPin(/*gpioPin,*/state);
    }
  }

  setGPIOPin(/*gpioPin,*/state) {

    // update state
    this.gpioState[USB_RELAY_CHANNEL1_PIN] = state;
    this.gpioState[USB_RELAY_CHANNEL2_PIN] = state;
    this.gpioState[USB_RELAY_CHANNEL3_PIN] = state;
    this.gpioState[USB_RELAY_CHANNEL4_PIN] = state;
    // write to pin
    rpio.write(USB_RELAY_CHANNEL1_PIN, state);
    setTimeout(() => { rpio.write(USB_RELAY_CHANNEL4_PIN, state); }, 250);
    setTimeout(() => { rpio.write(USB_RELAY_CHANNEL3_PIN, state); }, 250);
    setTimeout(() => { rpio.write(USB_RELAY_CHANNEL2_PIN, state); }, 250);

    /*
    if (state == rpio.LOW) {
      this.startTime = new Date();
    }

    if (state == rpio.HIGH) {
      this.endTime = new Date();
    }
    */

    this.history.unshift({ /*port: gpioPin, */state/*, date: new Date() */});
    this.history = this.history.slice(0, 10);

    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }
}

module.exports = USBController;