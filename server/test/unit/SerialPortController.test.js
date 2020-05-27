const SerialPortController = require('../../src/SerialPortController');

describe("SerialPortController", () => {
  test("constructor", () => {
    const serialPortController = new SerialPortController({});
    expect(serialPortController.virtualDeviceInterval).toBeUndefined();
  });

  test("isAuthRequired should return true", () => {
    const serialPortController = new SerialPortController({});
    expect(serialPortController.isAuthRequired()).toBe(true);
  });

  test("init does nothing", () => {

  });

  test("readOutputFiles", () => {
    let serialPortController = new SerialPortController({
      sendMessageCallback: (h, o) => {
        handler = h;
        obj = o;
      }
    });
    let mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    serialPortController.readOutputFiles();
    //this.serialFile test ekle!!!!
    expect(mockUpdatePortStatus).toHaveBeenCalled();
  });

  test("startVirtualDevice", () => {
    let serialPortController = new SerialPortController({
      sendMessageCallback: (h, o) => {
        handler = h;
        obj = o;
      }
    });
    
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