const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('./MockGPIOUtility');
const MockNetworkUtility = require('./MockNetworkUtility');

class MockObjectFactory extends IObjectFactory {
  getPlatformString() {
    return 'mock';
  }

  createGPIOUtility() {
    return new MockGPIOUtility();
  }

  createNetworkUtility() {
    return new MockNetworkUtility();
  }

  createUSBUtility() {
    // TODO: replace with mock object
    return {};
  }

  createPlatformUtility() {
    // TODO: replace with mock object
    return {};
  }
}

module.exports = MockObjectFactory;
