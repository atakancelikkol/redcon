const IPlatformUtility = require('../interfaces/IPlatformUtility');
// const logger = require('../../util/Logger');

class MockPlatformUtility extends IPlatformUtility {
  rebootSystem() {
    // logger.info('MockPlatformUtility rebootSystem is called!');
  }
}

module.exports = MockPlatformUtility;
