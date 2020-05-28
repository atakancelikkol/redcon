const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const PosixUSBUtility = require('../posix/PosixUSBUtility');


class PosixObjectFactory extends IObjectFactory {
  getPlatformString() {
    return 'posix';
  }

  createGPIOUtility() {
    // TODO: detect raspberry and if available, return RaspberryGPIOUtility class
    // If not, return MockGPIOUtility
    return new MockGPIOUtility();
  }

  createNetworkUtility() {
    // TODO: this should return the class when implemented
    return {};
  }

  createUSBUtility() {
    return new PosixUSBUtility();
  }

  createPlatformUtility() {
    // TODO: this should return the class when implemented
    return {};
  }
}

module.exports = PosixObjectFactory;
