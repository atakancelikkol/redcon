const IGPIOUtility = require('../interfaces/IGPIOUtility');

class MockGPIOUtility extends IGPIOUtility {
  open() {
    return true;
  }
}

module.exports = MockGPIOUtility;
