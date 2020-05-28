const IPlatformUtility = require('../interfaces/IPlatformUtility');

class MockPlatformUtility extends IPlatformUtility {
  rebootSystem() {
    console.log('MockPlatformUtility rebootSystem is called!');
  }
}

module.exports = MockPlatformUtility;
