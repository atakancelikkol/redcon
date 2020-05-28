const SerialPortController = require('../../src/SerialPortController');
const SerialPort = require('serialport');
//jest.mock('serialport');
//const SerialPortStream = require('@serialport/stream');
//const MockBinding = require('@serialport/binding-mock');

//const virtualDeviceMode = false;
//const mockDevicePath = '/dev/ROBOT';
const fs = require('fs');
//jest.mock('fs');
//const ControllerBase = require('./ControllerBase');
const KeyMapping = require('../../src/util/KeyMapping');

//if (virtualDeviceMode) {
//  MockBinding.createPort(mockDevicePath, { echo: true, record: true });
//  SerialPortStream.Binding = MockBinding;
//}

jest.useFakeTimers();

describe("SerialPortController", () => {
  test("constructor", () => {
    const serialPortController = new SerialPortController({});
    expect(serialPortController.virtualDeviceInterval).toBeUndefined();
  });

  test("readOutputFiles", () => {
    let serialPortController = new SerialPortController();
    //
    const mockFiles = ['a', 'b', 'c'];
    const spyReadDirSync = jest.spyOn(fs, 'readdirSync').mockImplementation(() => mockFiles);
    //
    let mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    serialPortController.readOutputFiles();
    //
    expect(serialPortController.serialFiles).toEqual(mockFiles);
    expect(mockUpdatePortStatus).toHaveBeenCalled();
  });

  test("startVirtualDevice", () => {
    let serialPortController = new SerialPortController();
    // fail
    serialPortController.virtualDeviceInterval = true;
    serialPortController.startVirtualDevice("COM7");
    expect(setInterval).not.toHaveBeenCalled();
    // success
    serialPortController.virtualDeviceInterval = false;
    serialPortController.startVirtualDevice("COM7");
    expect(setInterval).toHaveBeenCalled();
    // setInterval!!
  });

  test("stopVirtualDevice", () => {

  });

  test("getCopyState", () => {
    let serialPortController = new SerialPortController();
    serialPortController.ports = [
      {
        path: 'COM7',
      },
      { path: 'COM1' }
    ];
    serialPortController.portStatusObj = {
      "COM7": {isOpen: false},
      "COM1": {isOpen: false}
    };
    serialPortController.serialFiles = ["testFile1", "testFile2"];
    //
    expect(serialPortController.getCopyState()).toEqual({
      ports: serialPortController.ports,
      portStatus: serialPortController.portStatusObj,
      serialFiles: serialPortController.serialFiles ,
    });
  });

  test("appendData", () => {
    let serialPortController = new SerialPortController();
    //
    const mockObj = {};
    let mockGetCopyState = jest.fn();
    serialPortController.getCopyState = mockGetCopyState;
    serialPortController.appendData(mockObj);
    expect(mockGetCopyState).toHaveBeenCalled();
  });

  test("updatePortStatus", () => {
    let serialPortController = new SerialPortController();
    //
    const mockObj = {};
    let mockAppendData = jest.fn();
    let mockSendMessageCallback = jest.fn();
    serialPortController.appendData = mockAppendData;
    serialPortController.sendMessageCallback = mockSendMessageCallback;
    //
    serialPortController.updatePortStatus();
    expect(mockAppendData).toHaveBeenCalled();
    expect(mockSendMessageCallback).toHaveBeenCalled(); 
  });

  describe("handleMessage for existing obj.serial", () => {
    test("handleMessage openDevice", () => {
      let obj = { serial: { action: "openDevice", path: "", baudRate: "" } };
      let serialPortController = new SerialPortController();
      //
      mockOpenSerialPort = jest.fn();
      serialPortController.openSerialPort = mockOpenSerialPort;
      serialPortController.handleMessage(obj);
      expect(mockOpenSerialPort).toHaveBeenCalled();
    });
    test("handleMessage listDevices", () => {
      let obj = { serial: { action: "listDevices", path: "", baudRate: "" } };
      let serialPortController = new SerialPortController();
      mockListPorts = jest.fn();
      serialPortController.listPorts = mockListPorts;
      serialPortController.handleMessage(obj);
      expect(mockListPorts).toHaveBeenCalled();
    });
    test("handleMessage closeDevice", () => {
      let obj = { serial: { action: "closeDevice", path: "", baudRate: "" } };
      let serialPortController = new SerialPortController();
      mockCloseSerialPort = jest.fn();
      serialPortController.closeSerialPort = mockCloseSerialPort;
      serialPortController.handleMessage(obj);
      expect(mockCloseSerialPort).toHaveBeenCalled();
    });
    test("handleMessage writeDevice", () => {
      let obj = { serial: { action: "writeDevice", path: "", baudRate: "" } };
      let serialPortController = new SerialPortController();
      mockWriteSerialPort = jest.fn();
      serialPortController.writeSerialPort = mockWriteSerialPort;
      serialPortController.handleMessage(obj);
      expect(mockWriteSerialPort).toHaveBeenCalled();
    });
    test("handleMessage writeKeyDevice", () => {
      let obj = { serial: { action: "writeKeyDevice", path: "", baudRate: "" } };
      let serialPortController = new SerialPortController();
      mockWriteKeySerialPort = jest.fn();
      serialPortController.writeKeySerialPort = mockWriteKeySerialPort;
      serialPortController.handleMessage(obj);
      expect(mockWriteKeySerialPort).toHaveBeenCalled();
    });
  });

  test("listPorts", () => {
//async
  });

  test("writeSerialPort", () => {
    let serialPortController = new SerialPortController();
    serialPortController.portInstances = { 'COM7': {} };
    const mockWrite = jest.fn();
    serialPortController.portInstances.COM7.write = mockWrite;
// fail on if (this.portInstances[devicePath])
    serialPortController.writeSerialPort('COM5', 'testStr');
    expect(mockWrite).not.toHaveBeenCalled();
// fail on if (typeof serialCmd !== 'string')
    serialPortController.writeSerialPort('COM7', 5);
    expect(mockWrite).not.toHaveBeenCalled();
// success on if (this.portInstances[devicePath])
    serialPortController.writeSerialPort('COM7', 'testStr');
    expect(mockWrite).toHaveBeenCalledWith('testStr');
  });

  test("writeKeySerialPort", () => {
    let serialPortController = new SerialPortController();
    serialPortController.portInstances = { 'COM7': {} };
    // KeyMapping.ConvertKey
    const mockConvertKey = jest.fn( (keyCode) => keyCode + 5);
    KeyMapping.ConvertKey = mockConvertKey;
    // port.write
    const mockWrite = jest.fn();
    serialPortController.portInstances.COM7.write = mockWrite;
// fail on if (this.portInstances[devicePath])
    serialPortController.writeKeySerialPort('COM5', 1, 2, 3, 4);
    expect(mockWrite).not.toHaveBeenCalled();
//success
    serialPortController.writeKeySerialPort('COM7', 1, 2, 3, 4);
    expect(mockWrite).toHaveBeenCalledWith([6]);
  });

  test("closeSerialPort", () => {
    let serialPortController = new SerialPortController();
    serialPortController.portInstances = { 'COM7': {} };
    const mockClose = jest.fn();
    serialPortController.portInstances.COM7.close = mockClose;
// fail on if (this.portInstances[devicePath])
    serialPortController.closeSerialPort('COM5');
    expect(mockClose).not.toHaveBeenCalled();
// fail on if (typeof serialCmd !== 'string')
    serialPortController.closeSerialPort(5);
    expect(mockClose).not.toHaveBeenCalled();
// success on if (this.portInstances[devicePath])
    serialPortController.closeSerialPort('COM7');
    expect(mockClose).toHaveBeenCalled();
  });

  test("openWriteStream", () => {

  });

  test("openSerialPort", () => {
    let serialPortController = new SerialPortController();
    //const mockPort = new SerialPort("devicePath");
    const mockPortOn = jest.fn();
    //mockPort.on = mockPortOn;
// fail on if (typeof devicePath !== 'string')
    //serialPortController.openSerialPort(5, 115200);
// fail on if (typeof baudRate !== 'number')
// success on if (this.portInstances[devicePath])
    const mockOnPortOpened = jest.fn();
    //serialPortController.onPortOpened.bind = mockOnPortOpened;
    //serialPortController.openSerialPort('COM7', 115200);
    //expect(mockPortOn).toHaveBeenCalledWith('open', mockOnPortOpened);
  });

  test("onPortOpened", () => {
    let serialPortController = new SerialPortController();
    let mockPort = { path: "COM7" };
    serialPortController.portStatusObj = { "COM7": { isOpen: false } };
    //
    const mockOpenWriteStream = jest.fn();
    serialPortController.openWriteStream = mockOpenWriteStream;
    //
    const mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    serialPortController.onPortOpened(mockPort);
    expect(serialPortController.portStatusObj.COM7.isOpen).toBeTruthy();
    expect(serialPortController.portInstances.COM7).toEqual(mockPort);
    expect(mockOpenWriteStream).toHaveBeenCalledWith("COM7");
    expect(mockUpdatePortStatus).toHaveBeenCalled();
  });

  test("onPortDataReceived", () => {
    let serialPortController = new SerialPortController();

  });

  test("onPortClosed", () => {
    let serialPortController = new SerialPortController();
    let mockPort = { path: "COM7" };
    serialPortController.portStatusObj = { "COM7": { isOpen: true } };
    //
    const mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    const mockStopVirtualDevice = jest.fn();
    serialPortController.stopVirtualDevice = mockStopVirtualDevice;
    //
    serialPortController.onPortClosed(mockPort);
    expect(serialPortController.portStatusObj.COM7.isOpen).toBeFalsy();
    expect(mockUpdatePortStatus).toHaveBeenCalled();
    //writerInstances
    expect(mockStopVirtualDevice).not.toHaveBeenCalled();
  });
});