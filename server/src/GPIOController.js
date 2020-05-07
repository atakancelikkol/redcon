const rpio = require('rpio');
const GPIOPins = require('./GPIOPins');

class GPIOController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.gpioState = {};
    this.gpioState[GPIOPins.RELAY_POWER_PIN] = rpio.HIGH;
    this.gpioState[GPIOPins.RELAY_CONTACT_PIN] = rpio.HIGH;
    this.startTime = 0;
    this.endTime = 0;
    this.history = [];
  }

  isAuthRequired(){
    return true
  }

  init() {
    console.log("initializing GPIOController");
    let gpioPorts = Object.keys(this.gpioState);
    gpioPorts.forEach((portNum) => {
      if (isNaN(portNum) == false) {
        // open all ports regarding default value
        rpio.open(portNum, rpio.OUTPUT, this.gpioState[portNum]);
      }
    });
  }

  getCopyState() {
    return {
      state: { ...this.gpioState },
      startTime: this.startTime,
      endTime: this.endTime,
      history: [...this.history],
    }
  }

  appendData(obj) {
    // this function returns the initial state
    obj["gpio"] = this.getCopyState();
  }

  handleMessage(obj) {
    
    if (obj["gpio"]) {
      let gpioPort = obj["gpio"].port;
      let state = obj["gpio"].state ? rpio.HIGH : rpio.LOW;
      this.setGPIOPort(gpioPort, state);
    }
  }

  setGPIOPort(gpioPort, state) {
    if (this.gpioState[gpioPort] == undefined) {
      return;
    }

    // update state
    this.gpioState[gpioPort] = state;
    // write to port
    rpio.write(gpioPort, state);

    //
    if (gpioPort == GPIOPins.RELAY_POWER_PIN && state == rpio.LOW) {
      this.startTime = new Date();
    }
    if (gpioPort == GPIOPins.RELAY_POWER_PIN && state == rpio.HIGH) {
      this.endTime = new Date();
    }

    this.history.unshift({ port: gpioPort, state, date: new Date() });
    this.history = this.history.slice(0, 10);

    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }

  onExit() {

  }
}

module.exports = GPIOController;