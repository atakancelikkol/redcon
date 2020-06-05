const fs = require('fs');
const SerialPort = require('serialport');
const SerialPortController = require('../../src/SerialPortController');
const logger = require('../../src/util/Logger');

jest.genMockFromModule('serialport');
jest.mock('serialport');
// const SerialPortStream = require('@serialport/stream');
// const MockBinding = require('@serialport/binding-mock');

// const virtualDeviceMode = false;
// const mockDevicePath = '/dev/ROBOT';
// jest.mock('fs');
// const ControllerBase = require('./ControllerBase');
const KeyMapping = require('../../src/util/KeyMapping');

// if (virtualDeviceMode) {
//  MockBinding.createPort(mockDevicePath, { echo: true, record: true });
//  SerialPortStream.Binding = MockBinding;
// }

jest.useFakeTimers();

describe('SerialPortController', () => {
  test('constructor', () => {
    const serialPortController = new SerialPortController({});
    expect(serialPortController.virtualDeviceInterval).toBeUndefined();
  });

  test('readOutputFiles', () => {
    const serialPortController = new SerialPortController();
    //
    const mockFiles = ['a', 'b', 'c'];
    const spyReadDirSync = jest.spyOn(fs, 'readdirSync').mockImplementation(() => mockFiles);
    //
    const mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    serialPortController.readOutputFiles();
    //
    expect(spyReadDirSync).toHaveBeenCalled();
    expect(serialPortController.serialFiles).toEqual(mockFiles);
    expect(mockUpdatePortStatus).toHaveBeenCalled();
  });

  test('startVirtualDevice', () => {
    const serialPortController = new SerialPortController();
    const mockPort = { emit: jest.fn() };
    serialPortController.portInstances.COM7 = mockPort;
    // fail
    serialPortController.virtualDeviceInterval = true;
    serialPortController.startVirtualDevice('COM7');
    expect(setInterval).not.toHaveBeenCalled();
    // success
    serialPortController.virtualDeviceInterval = false;
    serialPortController.startVirtualDevice('COM7');
    expect(setInterval).toHaveBeenCalled();
    jest.advanceTimersByTime(700);
    expect(mockPort.emit).toHaveBeenCalled();
  });

  test('stopVirtualDevice', () => {
    const serialPortController = new SerialPortController();
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

  test('getCopyState', () => {
    const serialPortController = new SerialPortController();
    serialPortController.ports = {};
    serialPortController.ports[0] = { path: 'COM7' };
    serialPortController.ports[1] = { path: 'COM1' };
    serialPortController.portStatusObj = {
      COM7: { isOpen: false },
      COM1: { isOpen: false },
    };
    serialPortController.serialFiles = {};
    serialPortController.serialFiles[0] = 'testFile1';
    serialPortController.serialFiles[1] = 'testFile2';
    //
    expect(serialPortController.getCopyState()).toEqual({
      ports: serialPortController.ports,
      portStatus: serialPortController.portStatusObj,
      serialFiles: serialPortController.serialFiles,
    });
  });

  test('appendData', () => {
    const serialPortController = new SerialPortController();
    //
    const mockObj = {};
    const mockGetCopyState = jest.fn();
    serialPortController.getCopyState = mockGetCopyState;
    serialPortController.appendData(mockObj);
    expect(mockGetCopyState).toHaveBeenCalled();
  });

  test('updatePortStatus', () => {
    const serialPortController = new SerialPortController();
    //
    const mockAppendData = jest.fn();
    const mockSendMessageCallback = jest.fn();
    serialPortController.appendData = mockAppendData;
    serialPortController.sendMessageCallback = mockSendMessageCallback;
    //
    serialPortController.updatePortStatus();
    expect(mockAppendData).toHaveBeenCalled();
    expect(mockSendMessageCallback).toHaveBeenCalled();
  });

  describe('handleMessage', () => {
    test('handleMessage openDevice', () => {
      const obj = { serial: {
        action: 'openDevice', path: '', baudRate: '',
      } };
      const serialPortController = new SerialPortController();
      //
      const mockOpenSerialPort = jest.fn();
      serialPortController.openSerialPort = mockOpenSerialPort;
      serialPortController.handleMessage(obj);
      expect(mockOpenSerialPort).toHaveBeenCalled();
    });

    test('handleMessage listDevices', () => {
      const obj = { serial: {
        action: 'listDevices', path: '', baudRate: '',
      } };
      const serialPortController = new SerialPortController();
      const mockListPorts = jest.fn();
      serialPortController.listPorts = mockListPorts;
      serialPortController.handleMessage(obj);
      expect(mockListPorts).toHaveBeenCalled();
    });

    test('handleMessage closeDevice', () => {
      const obj = { serial: {
        action: 'closeDevice', path: '', baudRate: '',
      } };
      const serialPortController = new SerialPortController();
      const mockCloseSerialPort = jest.fn();
      serialPortController.closeSerialPort = mockCloseSerialPort;
      serialPortController.handleMessage(obj);
      expect(mockCloseSerialPort).toHaveBeenCalled();
    });

    test('handleMessage writeDevice', () => {
      const obj = { serial: {
        action: 'writeDevice', path: '', baudRate: '',
      } };
      const serialPortController = new SerialPortController();
      const mockWriteSerialPort = jest.fn();
      serialPortController.writeSerialPort = mockWriteSerialPort;
      serialPortController.handleMessage(obj);
      expect(mockWriteSerialPort).toHaveBeenCalled();
    });

    test('handleMessage writeKeyDevice', () => {
      const obj = { serial: {
        action: 'writeKeyDevice', path: '', baudRate: '',
      } };
      const serialPortController = new SerialPortController();
      const mockWriteKeySerialPort = jest.fn();
      serialPortController.writeKeySerialPort = mockWriteKeySerialPort;
      serialPortController.handleMessage(obj);
      expect(mockWriteKeySerialPort).toHaveBeenCalled();
    });
  });

  test('listPorts', async () => {
    const serialPortController = new SerialPortController();
    //
    const mockReadOutputFiles = jest.fn();
    serialPortController.readOutputFiles = mockReadOutputFiles;
    //
    const mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    const mockPorts = [];
    mockPorts[0] = { path: 'COM7' };
    jest.spyOn(SerialPort, 'list').mockImplementation(() => mockPorts);
    //
    serialPortController.portStatusObj = { COM1: { isOpen: false } };
    // if (devicePort === undefined)
    await serialPortController.listPorts();
    expect(serialPortController.portStatusObj.COM1).toBeUndefined();
    // this.portStatusObj[item.path] === undefined
    expect(serialPortController.portStatusObj.COM7).toEqual({ isOpen: false });
    //
    serialPortController.portStatusObj = { COM7: { isOpen: false } };
    // if (devicePort !== undefined) &&
    // this.portStatusObj[item.path] !== undefined
    await serialPortController.listPorts();
    expect(serialPortController.portStatusObj).toMatchObject({ COM7: { isOpen: false } });
    expect(mockUpdatePortStatus).toHaveBeenCalledTimes(2);
  });

  test('writeSerialPort', () => {
    const serialPortController = new SerialPortController();
    serialPortController.portInstances = { COM7: {} };
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

  test('writeKeySerialPort', () => {
    const serialPortController = new SerialPortController();
    serialPortController.portInstances = { COM7: {} };
    // KeyMapping.ConvertKey
    const mockConvertKey = jest.fn((keyCode) => keyCode + 5);
    KeyMapping.ConvertKey = mockConvertKey;
    // port.write
    const mockWrite = jest.fn();
    serialPortController.portInstances.COM7.write = mockWrite;
    // fail on if (this.portInstances[devicePath])
    serialPortController.writeKeySerialPort('COM5', 1, 2, 3, 4);
    expect(mockWrite).not.toHaveBeenCalled();
    // success
    serialPortController.writeKeySerialPort('COM7', 1, 2, 3, 4);
    expect(mockWrite).toHaveBeenCalledWith([6]);
  });

  test('closeSerialPort', () => {
    const serialPortController = new SerialPortController();
    serialPortController.portInstances = { COM7: {} };
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

  test('openWriteStream', () => {
    const serialPortController = new SerialPortController();
    const mockWriteStream = {};
    const spyCreateWriteStream = jest.spyOn(fs, 'createWriteStream').mockImplementation(() => mockWriteStream);
    //
    serialPortController.openWriteStream('testPath');
    expect(spyCreateWriteStream).toHaveBeenCalled();
    expect(serialPortController.writerInstances).toEqual({ testPath: mockWriteStream });
  });

  test('openSerialPort', () => {
    const serialPortController = new SerialPortController();
    //

    const spyLogger = jest.spyOn(logger, 'error');
    //
    const mockStartVirtualDevice = jest.fn();
    serialPortController.startVirtualDevice = mockStartVirtualDevice;
    //
    const mockSerialPortObj = {
      on: jest.fn(),
      pipe: jest.fn(),
    };
    SerialPort.mockImplementation(() => mockSerialPortObj);
    //
    const mockReadline = { on: jest.fn() };
    SerialPort.parsers.Readline.mockImplementation(() => mockReadline);
    // fail
    serialPortController.openSerialPort(115200, 115200);
    expect(spyLogger).toHaveBeenCalled();
    spyLogger.mockClear();
    // success
    serialPortController.openSerialPort('COM7', 115200);
    expect(spyLogger).not.toHaveBeenCalled();
    expect(mockSerialPortObj.on).toHaveBeenCalledWith('open', expect.anything());
    expect(mockSerialPortObj.on).toHaveBeenCalledWith('close', expect.anything());
    expect(mockSerialPortObj.on).toHaveBeenCalledWith('error', expect.anything());
    expect(mockSerialPortObj.pipe).toHaveBeenCalled();
    expect(mockReadline.on).toHaveBeenCalledWith('data', expect.anything());
    expect(mockStartVirtualDevice).not.toHaveBeenCalled();
  });

  test('onPortOpened', () => {
    const serialPortController = new SerialPortController();
    const mockPort = { path: 'COM7' };
    serialPortController.portStatusObj = { COM7: { isOpen: false } };
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
    expect(mockOpenWriteStream).toHaveBeenCalledWith('COM7');
    expect(mockUpdatePortStatus).toHaveBeenCalled();
  });

  test('onPortDataReceived', () => {
    const serialPortController = new SerialPortController();
    const port = { path: 'COM7' };
    const mockWriter = { write: jest.fn() };
    // fail
    serialPortController.writerInstances.COM1 = mockWriter;
    serialPortController.onPortDataReceived(port, 'testData');
    expect(mockWriter.write).not.toHaveBeenCalled();
    // success
    serialPortController.writerInstances.COM7 = mockWriter;
    serialPortController.onPortDataReceived(port, 'testData');
    expect(mockWriter.write).toHaveBeenCalled();
  });

  test('onPortClosed', () => {
    const serialPortController = new SerialPortController();
    serialPortController.portStatusObj = { COM7: { isOpen: true } };
    //
    const mockUpdatePortStatus = jest.fn();
    serialPortController.updatePortStatus = mockUpdatePortStatus;
    //
    const port = { path: 'COM7' };
    const mockWriter = { close: jest.fn() };
    //
    const mockStopVirtualDevice = jest.fn();
    serialPortController.stopVirtualDevice = mockStopVirtualDevice;
    // fail: if (writer !== undefined)
    serialPortController.writerInstances.COM1 = mockWriter;
    serialPortController.onPortClosed(port);
    expect(serialPortController.portStatusObj.COM7.isOpen).toBeFalsy();
    expect(mockWriter.close).not.toHaveBeenCalled();
    // success: if (writer !== undefined)
    serialPortController.writerInstances.COM7 = mockWriter;
    serialPortController.onPortClosed(port);
    expect(serialPortController.portStatusObj.COM7.isOpen).toBeFalsy();
    expect(mockWriter.close).toHaveBeenCalled();
    //
    expect(mockUpdatePortStatus).toHaveBeenCalledTimes(2);
    expect(mockStopVirtualDevice).not.toHaveBeenCalled();
  });
});
