const GPIOController = require('../../src/GPIOController');
const gpioController = new GPIOController({});


describe("GPIOController", () => {
  test("should return true", () => {
    expect(gpioController.isAuthRequired()).toBe(true);
  });

});