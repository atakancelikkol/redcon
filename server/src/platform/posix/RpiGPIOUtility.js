const rpio = require('rpio');
const IGPIOUtility = require('../interfaces/IGPIOUtility');

/**
 * GPIOUtility implementation for Raspberry PI
 */
class RpiGPIOUtility extends IGPIOUtility {
  openForOutput(portPinNumber, initialState) {
    rpio.open(portPinNumber, rpio.OUTPUT, initialState);
  }

  openForInput(portPinNumber, initialState) {
    rpio.open(portPinNumber, rpio.INPUT, initialState);
  }

  read(portPinNumber) {
    return rpio.read(portPinNumber);
  }

  write(portPinNumber, state) {
    rpio.write(portPinNumber, state);
  }

  close(portPinNumber) {
    rpio.close(portPinNumber);
  }
}

module.exports = RpiGPIOUtility;
