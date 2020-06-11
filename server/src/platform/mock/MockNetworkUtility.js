const INetworkUtility = require('../interfaces/INetworkUtility');

class MockNetworkUtility extends INetworkUtility {
  applyPortConfiguration() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async applyNetworkConfiguration(/* config */) {
    console.log('mock applyNetworkConfiguration');
  }
}

module.exports = MockNetworkUtility;
