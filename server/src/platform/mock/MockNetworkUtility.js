const INetworkUtility = require('../interfaces/INetworkUtility');

class MockNetworkUtility extends INetworkUtility {
  applyPortConfiguration() {
    console.log('Port forwarding script can be used only in linux operating system.');
    return new Promise((resolve) => {
      resolve();
    });
  }
}

module.exports = MockNetworkUtility;
