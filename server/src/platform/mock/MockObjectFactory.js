const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('./MockGPIOUtility');
const MockUSBUtility = require('./MockUSBUtility');
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
    return new MockUSBUtility();
  }

  createPlatformUtility() {
    return new MockPlatformUtility();
  }
}

module.exports = MockObjectFactory;
