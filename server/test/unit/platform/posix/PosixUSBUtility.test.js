const PosixUSBUtility = require('../../../../src/platform/posix/PosixUSBUtility');

let mockExecErrorParameter = true;
const mockexecStdOutParameter = 'a1\n a2\n a3';
let execCommandString = ''; // eslint-disable-line

jest.mock('child_process', () => ({ exec: jest.fn((commandString, callback) => {
  execCommandString = commandString;
  const error = mockExecErrorParameter;
  const testStdOut = mockexecStdOutParameter;
  callback(error, testStdOut, 'testStdError');
}) }));

describe('PosixUSBUtility test', () => {
  it('test method for extractUsbState', () => {
    const posixUSBtility = new PosixUSBUtility();
    const mountPath = 'testPath';
    const device = 'testDevice';
    expect(posixUSBtility.extractUsbState(mountPath, device)).toMatchObject({
      device: 'testDevice', isAvailable: true, mountedPath: 'testPath', usbName: 'testPath',
    });
  });

  it('test method 1 for syncUsbDevice', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    posixUSBtility.syncUsbDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method 2 for syncUsbDevice', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    posixUSBtility.syncUsbDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method 3 for syncUsbDevice', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    posixUSBtility.syncUsbDevice(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('test method 1 for ejectUSBDriveSafely', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    posixUSBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method 2 for ejectUSBDriveSafely', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    posixUSBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method 3 for ejectUSBDriveSafely', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    posixUSBtility.ejectUSBDriveSafely(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));
});
