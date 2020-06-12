const INetworkUtility = require('../interfaces/INetworkUtility');
const logger = require('../../util/Logger');

class MockNetworkUtility extends INetworkUtility {
  applyPortConfiguration() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async applyNetworkConfiguration(/* config */) {
    logger.info('mock applyNetworkConfiguration');
  }
}

module.exports = MockNetworkUtility;
