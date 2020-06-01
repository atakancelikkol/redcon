const IGPIOUtility = require('../interfaces/IGPIOUtility');

class MockGPIOUtility extends IGPIOUtility {
  openForOutput(/* portPinNumber, initialState */) {
    // TODO: Open logs after implementing a log utility!
    // console.log("MockGPIOUtility openForOutput: ", portPinNumber, initialState);
  }

  openForInput(/* portPinNumber, initialState */) {
    // console.log("MockGPIOUtility openForInput: ", portPinNumber, initialState);
  }

  read(/* portPinNumber */) {
    // console.log("MockGPIOUtility read: ", portPinNumber);
    return true;
  }

  write(/* portPinNumber, state */) {
    // console.log("MockGPIOUtility write: ", portPinNumber, state);
  }

  close(/* portPinNumber */) {
    // console.log("MockGPIOUtility close: ", portPinNumber);
  }
}

module.exports = MockGPIOUtility;
