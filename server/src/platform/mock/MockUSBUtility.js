const IUSBUtility = require('../interfaces/IUSBUtility');

class MockUSBUtility extends IUSBUtility {
  open() {
    return true;
  }
}

module.exports = MockUSBUtility;
