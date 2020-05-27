const IObjectFactory = require('../interfaces/IObjectFactory');
const MockGPIOUtility = require('./MockGPIOUtility');

class MockObjectFactory extends IObjectFactory {
  getPlatformString() {
    return 'mock';
  }

  createGPIOUtility() {
    return new MockGPIOUtility();
  }

  createNetworkUtility() {
    // TODO: replace with mock object
    return {};
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
