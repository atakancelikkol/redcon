const rpio = require('rpio');
const cloneDeep = require('clone-deep');

const POWER_RELAY_PIN = 3;

class GPIOController {
  constructor({ sendMessageCallback }) {
    this.sendMessageCallback = sendMessageCallback;
    this.gpioState = {};
    this.gpioState[3] = rpio.HIGH;
    this.gpioState[5] = rpio.HIGH;
    this.startTime = 0;
    this.endTime = 0;
    this.history = [];
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

  handleMessage(obj, client) {
    //Authorization check
    if (client.isAuthenticated == false) {
      console.log("Authentication required")
      return
    }
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
    if (gpioPort == POWER_RELAY_PIN && state == rpio.LOW) {
      this.startTime = new Date();
    }
    if (gpioPort == POWER_RELAY_PIN && state == rpio.HIGH) {
      this.endTime = new Date();
    }

    this.history.unshift({ port: gpioPort, state, date: new Date() });
    this.history = this.history.slice(0, 10);

    let obj = {};
    this.appendData(obj);
    this.sendMessageCallback(obj);
  }

  onExit() {

  }
}

module.exports = GPIOController;