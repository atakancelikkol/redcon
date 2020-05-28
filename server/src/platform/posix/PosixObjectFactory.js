const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const PosixNetworkUtility = require('./PosixNetworkUtility');

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
