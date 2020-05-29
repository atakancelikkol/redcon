const SerialPortController = require('../../src/SerialPortController');
const SerialPort = require('serialport');
jest.mock('serialport');
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
    const mockPort = { emit: jest.fn() };
    serialPortController.portInstances["COM7"] = mockPort;
    // fail
    serialPortController.virtualDeviceInterval = true;
    serialPortController.startVirtualDevice("COM7");
    expect(setInterval).not.toHaveBeenCalled();
    // success
    serialPortController.virtualDeviceInterval = false;
    serialPortController.startVirtualDevice("COM7");
    expect(setInterval).toHaveBeenCalled();
    jest.advanceTimersByTime(700);
    expect(mockPort.emit).toHaveBeenCalled();
  });

  test("stopVirtualDevice", () => {
    let serialPortController = new SerialPortController();
    // fail
    serialPortController.virtualDeviceInterval = false;
    serialPortController.stopVirtualDevice();
    expect(clearInterval).not.toHaveBeenCalled();
    // success
    serialPortController.virtualDeviceInterval = true;
    serialPortController.stopVirtualDevice();
    expect(clearInterval).toHaveBeenCalled();
    expect(serialPortController.virtualDeviceInterval).toBeUndefined();
  });

  test("getCopyState", () => {
    let serialPortController = new SerialPortController();
    serialPortController.ports = {};
    serialPortController.ports[0] = { path: 'COM7' };
    serialPortController.ports[1] = { path: 'COM1' };
    serialPortController.portStatusObj = {
      "COM7": {isOpen: false},
      "COM1": {isOpen: false}
    };
    serialPortController.serialFiles = {};
    serialPortController.serialFiles[0] = "testFile1";
    serialPortController.serialFiles[1] = "testFile2";
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

  test("listPorts", async () => {
    let serialPortController = new SerialPortController();
    //
    mockReadOutputFiles = jest.fn();
    serialPortController.readOutputFiles = mockReadOutputFiles;
    //
    let mockPorts = {};
    mockPorts[0] = { path: 'COM7' };
    spySerialPortList = jest.spyOn(SerialPort, 'list').mockImplementation(() => mockPorts);
    //
    // this.portStatusObj[item.path] === undefined
    serialPortController.portStatusObj = {};
    await serialPortController.listPorts();
    expect(serialPortController.portStatusObj.COM7).toEqual({ isOpen: false })
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
    let serialPortController = new SerialPortController();
    const mockWriteStream = {};
    const spyCreateWriteStream = jest.spyOn(fs, 'createWriteStream').mockImplementation(() => mockWriteStream);
    //
    serialPortController.openWriteStream('testPath');
    expect(spyCreateWriteStream).toHaveBeenCalled();
    expect(serialPortController.writerInstances).toEqual({'testPath': mockWriteStream});
  });

  test("openSerialPort", () => {
    let serialPortController = new SerialPortController();
    //
    const spyConsoleLog = jest.spyOn(console, 'log');
    //
    const mockStartVirtualDevice = jest.fn();
    serialPortController.startVirtualDevice = mockStartVirtualDevice;
    //
    serialPortController.openSerialPort('COM7', 115200);
    expect(spyConsoleLog).not.toHaveBeenCalled();
    expect(mockStartVirtualDevice).not.toHaveBeenCalled();
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
    serialPortController.registerSendMessageCallback((h, o) => {
      handler = h;
      obj = o;
    });
    const port = {path: "COM7"};
    const mockWriter = { write: jest.fn() };
    // fail
    serialPortController.writerInstances["COM1"] = mockWriter;
    serialPortController.onPortDataReceived(port, "testData");
    expect(mockWriter.write).not.toHaveBeenCalled();
    // success
    serialPortController.writerInstances["COM7"] = mockWriter;
    serialPortController.onPortDataReceived(port, "testData");
    expect(mockWriter.write).toHaveBeenCalled();
  });

  test("onPortClosed", () => {
    let serialPortController = new SerialPortController();
    serialPortController.portStatusObj = { "COM7": { isOpen: true } };
    //
    const mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    const port = {path: "COM7"};
    const mockWriter = { close: jest.fn() };
    //
    const mockStopVirtualDevice = jest.fn();
    serialPortController.stopVirtualDevice = mockStopVirtualDevice;
    // fail: if (writer !== undefined)
    serialPortController.writerInstances["COM1"] = mockWriter;
    serialPortController.onPortClosed(port);
    expect(serialPortController.portStatusObj.COM7.isOpen).toBeFalsy();
    expect(mockWriter.close).not.toHaveBeenCalled();
    // success: if (writer !== undefined)
    serialPortController.writerInstances["COM7"] = mockWriter;
    serialPortController.onPortClosed(port);
    expect(serialPortController.portStatusObj.COM7.isOpen).toBeFalsy();
    expect(mockWriter.close).toHaveBeenCalled();
    //
    expect(mockUpdatePortStatus).toHaveBeenCalledTimes(2);
    expect(mockStopVirtualDevice).not.toHaveBeenCalled();
  });
});