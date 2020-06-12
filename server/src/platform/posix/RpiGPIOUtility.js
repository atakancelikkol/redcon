const IGPIOUtility = require('../interfaces/IGPIOUtility');

/**
 * GPIOUtility implementation for Raspberry PI
 */
class RpiGPIOUtility extends IGPIOUtility {
  constructor() {
    super();
    this.rpio = require('rpio'); // eslint-disable-line
  }

  openForOutput(portPinNumber, initialState) {
    this.rpio.open(portPinNumber, this.rpio.OUTPUT, initialState);
  }

  openForInput(portPinNumber, initialState) {
    this.rpio.open(portPinNumber, this.rpio.INPUT, initialState);
  }

  read(portPinNumber) {
    return this.rpio.read(portPinNumber);
  }

  write(portPinNumber, state) {
    this.rpio.write(portPinNumber, state);
  }

  close(portPinNumber) {
    this.rpio.close(portPinNumber);
  }
}

module.exports = RpiGPIOUtility;
