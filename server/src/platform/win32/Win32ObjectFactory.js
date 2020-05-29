const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('../mock/MockGPIOUtility');
const Win32USBUtility = require('./Win32USBUtility');
const MockNetworkUtility = require('../mock/MockNetworkUtility');
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
    return new MockNetworkUtility();
  }

  createUSBUtility() {
    return new Win32USBUtility();
  }

  createPlatformUtility() {
    return new Win32PlatformUtility();
  }
}

module.exports = Win32ObjectFactory;
