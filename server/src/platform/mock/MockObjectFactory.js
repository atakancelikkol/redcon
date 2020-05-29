const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('./MockGPIOUtility');
const MockNetworkUtility = require('./MockNetworkUtility');
const MockPlatformUtility = require('./MockPlatformUtility');

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
    return new MockPlatformUtility();
  }
}

module.exports = MockObjectFactory;
