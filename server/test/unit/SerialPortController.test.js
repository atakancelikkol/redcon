const SerialPortController = require('../../src/SerialPortController');

describe("SerialPortController", () => {
  test("constructor", () => {
    const serialPortController = new SerialPortController({});
    expect(serialPortController.virtualDeviceInterval).toBeUndefined();
  });

  test("should return true", () => {
    expect(serialPortController.isAuthRequired()).toBe(true);
  });

  test("init does nothing", () => {

  });

  test("readOutputFiles", () => {

  });

  test("startVirtualDevice", () => {

  });

  test("stopVirtualDevice", () => {

  });

  test("getCopyState", () => {

  });

  test("appendData", () => {

  });

  test("updatePortStatus", () => {

  });

  test("handleMessage", () => {

  });

  test("listPorts", () => {

  });

  test("writeSerialPort", () => {

  });

  test("writeKeySerialPort", () => {

  });

  test("closeSerialPort", () => {

  });

  test("openWriteStream", () => {

  });

  test("openSerialPort", () => {

  });

  test("onPortOpened", () => {

  });

  test("onPortDataReceived", () => {

  });

  test("onPortClosed", () => {

  });

  test("onExit doesn nothing", () => {

  });
});