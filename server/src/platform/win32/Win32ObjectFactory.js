const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const Win32PlatformUtility = require('./Win32PlatformUtility');

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
    return new Win32PlatformUtility();
  }
}

module.exports = Win32ObjectFactory;
