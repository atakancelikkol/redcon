const INetworkUtility = require('../interfaces/INetworkUtility');

class MockNetworkUtility extends INetworkUtility {
  applyPortConfiguration() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async getNetworkInterfaces() {
    return ['mockEth0', 'mockEth1', 'mockEth2'];
  }

  async applyNetworkConfiguration(config) {
    console.log('applying configuration!', config);
  }
}

module.exports = MockNetworkUtility;
