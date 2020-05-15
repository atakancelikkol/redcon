const SerialPortController = require('../../src/SerialPortController');
const serialPortController = new SerialPortController({});


describe("SerialPortController", () => {
  test("should return true", () => {
    expect(serialPortController.isAuthRequired()).toBe(true);
  });

});