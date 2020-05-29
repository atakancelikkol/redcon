const isRunningOnRpi = require('detect-rpi');
const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const PosixNetworkUtility = require('./PosixNetworkUtility');
const RpiGPIOUtility = require('./RpiGPIOUtility');

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
    // TODO: this should return the class when implemented
    return {};
  }

  createPlatformUtility() {
    // TODO: this should return the class when implemented
    return {};
  }
}

module.exports = PosixObjectFactory;
