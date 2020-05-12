const USBController = require('../../src/USBController');
const usbController = new USBController({ });


describe("USBController", () => {
  test("should return true", () => {
    expect(usbController.isAuthRequired()).toBe(true);
  });
  /*test("should initialize the instance", () => {
    usbController.init() // It's called from main.js !!
    expect(usbController.isAuthRequired()).toBe(true);
  });

  console.log(usbController.usbState)*/
});