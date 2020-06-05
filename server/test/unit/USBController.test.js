const USBController = require('../../src/USBController');

const usbController = new USBController({ });


describe('USBController', () => {
  test('should return true', () => {
    expect(usbController.isAuthRequired()).toBe(true);
  });
});
