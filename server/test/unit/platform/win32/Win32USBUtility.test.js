const Win32USBUtility = require('../../../../src/platform/win32/Win32USBUtility');

let mockExecErrorParameter = true;
let mockexecStdOutParameter = 'a1\n a2\n a3';
let execCommandString = ''; // eslint-disable-line

jest.mock('child_process', () => ({ exec: jest.fn((commandString, callback) => {
  execCommandString = commandString;
  const error = mockExecErrorParameter;
  const testStdOut = mockexecStdOutParameter;
  callback(error, testStdOut, 'testStdError');
}) }));

describe('Win32USBUtility test', () => {
  it('test method for extractUsbState success case', () => new Promise((done) => {
    mockExecErrorParameter = undefined;
    mockexecStdOutParameter = 'a1\n a2\n a3';
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    win32USBtility.extractUsbState(mountPath).then((platformUsbState) => {
      expect(platformUsbState).toStrictEqual({
        device: '', isAvailable: true, mountedPath: 'testPath', usbErrorString: '', usbName: 'a2',
      });
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for extractUsbState error case', () => new Promise((done) => { // eslint-disable-line
    mockExecErrorParameter = true;
    mockexecStdOutParameter = 'a1\n a2\n a3';
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    win32USBtility.extractUsbState(mountPath).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('test method for extractUsbState undefined USB name case', () => new Promise((done) => { // eslint-disable-line
    mockExecErrorParameter = undefined;
    mockexecStdOutParameter = undefined;
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    win32USBtility.extractUsbState(mountPath).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('test method for extractUsbState invalid USB name case', () => new Promise((done) => { // eslint-disable-line
    mockExecErrorParameter = undefined;
    mockexecStdOutParameter = 'invalid';
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    win32USBtility.extractUsbState(mountPath).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));


  it('test method for ejectUSBDriveSafely USB is not available', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for ejectUSBDriveSafely USB is available', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for ejectUSBDriveSafely exec error USB is available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('test method for ejectUSBDriveSafely exec error and USB is not available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for syncUsbDevice USB is not available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    win32USBtility.syncUsbDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for syncUsbDevice USB is available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.syncUsbDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for syncUsbDevice exec error USB is available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.syncUsbDevice(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));
});
