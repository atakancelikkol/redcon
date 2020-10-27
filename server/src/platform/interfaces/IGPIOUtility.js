class IGPIOUtility {
  /**
   * Opens port for write
   * @param {Number} portPinNumber
   * @param {Number} initialState
   */
  openForOutput(portPinNumber, initialState) {
    throw new Error(`openForOutput() not implemented: ${portPinNumber} ${initialState}`);
  }

  /**
   * Opens port for read
   * @param {Number} portPinNumber
   * @param {Number} initialState
   */
  openForInput(portPinNumber, initialState) {
    throw new Error(`openForInput() not implemented: ${portPinNumber} ${initialState}`);
  }

  /**
   * Reads GPIO pin for the specified port pin number
   * @param {Number} portPinNumber
   */
  read(portPinNumber) {
    throw new Error(`read() not implemented: ${portPinNumber}`);
  }

  /**
   * Writes to GPIO pin for the specified port pin number and state
   * @param {Number} portPinNumber
   * @param {Number} state
   */
  write(portPinNumber, state) {
    throw new Error(`write() not implemented: ${portPinNumber} ${state}`);
  }

  /**
   * Closes the specified GPIO port
   * @param {Number} portPinNumber
   */
  close(portPinNumber) {
    throw new Error(`close() not implemented: ${portPinNumber}`);
  }
}

module.exports = IGPIOUtility;
