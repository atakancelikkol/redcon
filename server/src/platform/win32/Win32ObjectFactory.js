const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const Win32USBUtility = require('./Win32USBUtility');

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
    return new Win32USBUtility();
  }

  createPlatformUtility() {
    // TODO: this should return the class when implemented
    return {};
  }
}

module.exports = Win32ObjectFactory;
