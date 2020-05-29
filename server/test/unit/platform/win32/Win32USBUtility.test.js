const Win32USBUtility = require('../../../../src/platform/win32/Win32USBUtility');
const { exec } = require('child_process');

let execCommandString = '';
jest.mock('child_process', () => ({
  exec: jest.fn((commandString, callback) => {
    execCommandString = commandString;
    const error = true
    const testStdOut = 'a1\n a2\n a3'
    callback(error, testStdOut, 'testStdError');
  })
}));

describe("Win32USBUtility test", () => {

  it('test methods for extractUsbState', done => {

    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath'
    const device = 'testDevice'
    win32USBtility.extractUsbState(mountPath).then((platformUsbState) => {
      expect(platformUsbState).toStrictEqual({ "device": "", "isAvailable": true, "mountedPath": "testPat", "usbErrorString": "", "usbName": "a2" });
      done();
    },
      () => {
        done();
      }
    );
  });

  it("test methods for ejectUSBDriveSafely", () => {
    const win32USBtility = new Win32USBUtility();
    let execCommandString = '';
    jest.mock('child_process', () => ({
      exec: jest.fn((commandString, callback) => {
        execCommandString = commandString;
        const error = { message: 'testerror' }

        callback(error);
      })
    }));
    let usbState = {
      isAvailable: false,
      mountedPath: '',
    }
    win32USBtility.ejectUSBDriveSafely(usbState).then((usbErrorString) => {
      expect(usbErrorString).toStrictEqual();
      done();
    }
    );

  });

  it("test methods for promise syncUsbDevice", () => {
    const win32USBtility = new Win32USBUtility();
    let usbState = {
      isAvailable: false,
      mountedPath: '',
    }
    return expect(win32USBtility.syncUsbDevice(usbState)).resolves.toBe(undefined);
  });

  it("test methods for ejectUSBDriveSafely", () => {
    const win32USBtility = new Win32USBUtility();
    let usbState = {
      isAvailable: true,
      mountedPath: '',
    }
    win32USBtility.ejectUSBDriveSafely(usbState)
    expect(exec).toHaveBeenCalled();
  });

  it("test methods for promise ejectUSBDriveSafely", () => {
    const win32USBtility = new Win32USBUtility();
    let usbState = {
      isAvailable: false,
      mountedPath: '',
    }
    return expect(win32USBtility.ejectUSBDriveSafely(usbState)).resolves.toBe(undefined);
  });

})