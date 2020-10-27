const INetworkUtility = require('../interfaces/INetworkUtility');
const logger = require('../../util/Logger');

class MockNetworkUtility extends INetworkUtility {
  async applyNetworkConfiguration(/* config */) {
    logger.info('mock applyNetworkConfiguration');
  }

  async removeNetworkConfiguration(/* config */) {
    logger.info('mock removeNetworkConfiguration');
  }
}

module.exports = MockNetworkUtility;
