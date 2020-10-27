const GPIOPins = require('../GPIOPins');
const ControllerBase = require('../ControllerBase');

class GPIOController extends ControllerBase {
  constructor() {
    super('GPIOController');
    this.gpioState = {};
    this.gpioState[GPIOPins.RELAY_POWER_PIN] = 1;
    this.gpioState[GPIOPins.RELAY_CONTACT_PIN] = 1;
    this.startTime = 0;
    this.endTime = 0;
    this.history = [];
  }

  init() {
    const gpioUtility = this.platformObjects.getGPIOUtility();
    const gpioPorts = Object.keys(this.gpioState);
    gpioPorts.forEach((portNum) => {
      if (Number.isNaN(portNum) === false) {
        // open all ports regarding default value
        gpioUtility.openForOutput(portNum, this.gpioState[portNum]);
      }
    });
  }

  getCopyState() {
    return {
      state: { ...this.gpioState },
      startTime: this.startTime,
      endTime: this.endTime,
      history: [...this.history],
    };
  }

  appendData(obj) {
    // this function returns the initial state
    obj.gpio = this.getCopyState(); // eslint-disable-line
  }

  handleMessage(obj) {
    if (obj.gpio) {
      const gpioPort = obj.gpio.port;
      const state = obj.gpio.state ? 1 : 0;
      this.setGPIOPort(gpioPort, state);
    }
  }

  setGPIOPort(gpioPort, state) {
    if (this.gpioState[gpioPort] === undefined) {
      return;
    }

    // update state
    this.gpioState[gpioPort] = state;
    // write to port
    const gpioUtility = this.platformObjects.getGPIOUtility();
    gpioUtility.write(gpioPort, state);

    //
    if (gpioPort === GPIOPins.RELAY_POWER_PIN && state === 0) {
      this.startTime = new Date();
    }
    if (gpioPort === GPIOPins.RELAY_POWER_PIN && state === 1) {
      this.endTime = new Date();
    }

    this.history.unshift({
      port: gpioPort, state, date: new Date(),
    });
    this.history = this.history.slice(0, 10);

    const obj = {};
    this.appendData(obj);
    this.sendMessageCallback(this, obj);
  }
}

module.exports = GPIOController;
