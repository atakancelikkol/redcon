const isRunningOnRpi = require('detect-rpi');
const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const PosixUSBUtility = require('./PosixUSBUtility');
const PosixNetworkUtility = require('./PosixNetworkUtility');
const RpiGPIOUtility = require('./RpiGPIOUtility');
const PosixPlatformUtility = require('./PosixPlatformUtility');

class PosixObjectFactory extends IObjectFactory {
  getPlatformString() {
    return 'posix';
  }

  createGPIOUtility() {
    let gpioUtility;
    if (isRunningOnRpi()) {
      gpioUtility = new RpiGPIOUtility();
    } else {
      gpioUtility = new MockGPIOUtility();
    }

    return gpioUtility;
  }

  createNetworkUtility() {
    return new PosixNetworkUtility();
  }

  createUSBUtility() {
    return new PosixUSBUtility();
  }

  createPlatformUtility() {
    return new PosixPlatformUtility();
  }
}

module.exports = PosixObjectFactory;
