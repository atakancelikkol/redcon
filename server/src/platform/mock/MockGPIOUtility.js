const IGPIOUtility = require('../interfaces/IGPIOUtility');
const logger = require('../../util/Logger');

class MockGPIOUtility extends IGPIOUtility {
  openForOutput(portPinNumber, initialState) {
    logger.info('MockGPIOUtility openForOutput: ', portPinNumber, initialState);
  }

  openForInput(portPinNumber, initialState) {
    logger.info('MockGPIOUtility openForInput: ', portPinNumber, initialState);
  }

  read(/* portPinNumber */) {
    // logger.info('MockGPIOUtility read: ', portPinNumber);
    return true;
  }

  write(portPinNumber, state) {
    logger.info('MockGPIOUtility write: ', portPinNumber, state);
  }

  close(portPinNumber) {
    logger.info('MockGPIOUtility close: ', portPinNumber);
  }
}

module.exports = MockGPIOUtility;
