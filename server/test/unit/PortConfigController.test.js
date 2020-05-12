const PortConfigController = require('../../src/PortConfigController');
const portConfigController = new PortConfigController({});


describe("PortConfigController", () => {
  test("should return true", () => {
    expect(portConfigController.isAuthRequired()).toBe(true);
  });

});