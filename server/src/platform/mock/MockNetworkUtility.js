const INetworkUtility = require('../interfaces/INetworkUtility');

class MockNetworkUtility extends INetworkUtility {
  applyPortConfiguration() {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

module.exports = MockNetworkUtility;
