const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');

class Win32ObjectFactory extends IObjectFactory {
  getPlatformString() {
    return 'win32';
  }

  createGPIOUtility() {
    // there are gpio utility defined for windows
    return new MockGPIOUtility();
  }

  createNetworkUtility() {
    // TODO: this should return the class when implemented
    return {};
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

module.exports = Win32ObjectFactory;
