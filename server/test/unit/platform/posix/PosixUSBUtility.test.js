const PosixUSBUtility = require('../../../../src/platform/posix/PosixUSBUtility');

let mockexecErrorParameter = true;
const mockexecStdOutParameter = 'a1\n a2\n a3';
let execCommandString = '';

jest.mock('child_process', () => ({
  exec: jest.fn((commandString, callback) => {
    execCommandString = commandString;
    const error = mockexecErrorParameter;
    const testStdOut = mockexecStdOutParameter;
    callback(error, testStdOut, 'testStdError');
  }),
}));

describe('PosixUSBUtility test', () => {
  it('test methods for extractUsbState', () => {
    const posixUSBtility = new PosixUSBUtility();
    const mountPath = 'testPath';
    const device = 'testDevice';
    expect(posixUSBtility.extractUsbState(mountPath, device)).toMatchObject({ device: 'testDevice', isAvailable: true, mountedPath: 'testPath', usbName: 'testPath', });
  });

  it('test methods for syncUsbDevice', () => new Promise((done) => {
    const posixUSBtility = new PosixUSBUtility();
    mockexecErrorParameter = undefined;
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

  it('test methods for syncUsbDevice', () => new Promise((done) => {
    const posixUSBtility = new PosixUSBUtility();
    mockexecErrorParameter = undefined;
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

  it('test methods for syncUsbDevice', () => new Promise((done) => {
    const posixUSBtility = new PosixUSBUtility();
    mockexecErrorParameter = true;
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

  it('test methods for ejectUSBDriveSafely', () => new Promise((done) => {
    const posixUSBtility = new PosixUSBUtility();
    mockexecErrorParameter = undefined;
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

  it('test methods for ejectUSBDriveSafely', () => new Promise((done) => {
    const posixUSBtility = new PosixUSBUtility();
    mockexecErrorParameter = undefined;
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

  it('test methods for ejectUSBDriveSafely', () => new Promise((done) => {
    const posixUSBtility = new PosixUSBUtility();
    mockexecErrorParameter = true;
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
