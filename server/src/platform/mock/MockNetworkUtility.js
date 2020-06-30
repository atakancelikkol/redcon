const INetworkUtility = require('../interfaces/INetworkUtility');
const logger = require('../../util/Logger');

class MockNetworkUtility extends INetworkUtility {
  async applyNetworkConfiguration(/* config */) {
    logger.info('mock applyNetworkConfiguration');
  }
}

module.exports = MockNetworkUtility;
