const Win32USBUtility = require('../../../../src/platform/win32/Win32USBUtility');

let mockexecErrorParameter = true;
let mockexecStdOutParameter = 'a1\n a2\n a3';
let execCommandString = '';

jest.mock('child_process', () => ({
  exec: jest.fn((commandString, callback) => {
    execCommandString = commandString;
    const error = mockexecErrorParameter;
    const testStdOut = mockexecStdOutParameter;
    callback(error, testStdOut, 'testStdError');
  }),
}));

describe('Win32USBUtility test', () => {
  it('test methods for extractUsbState', done => {
    mockexecErrorParameter = undefined;
    mockexecStdOutParameter = 'a1\n a2\n a3';
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    const device = 'testDevice';
    win32USBtility.extractUsbState(mountPath).then((platformUsbState) => {
      expect(platformUsbState).toStrictEqual({
        device: '', isAvailable: true, mountedPath: 'testPat', usbErrorString: '', usbName: 'a2',
      });
      done();
    }, () => {
      throw new Error();
    });
  });

  it('test methods for extractUsbState', done => {
    mockexecErrorParameter = true;
    mockexecStdOutParameter = 'a1\n a2\n a3';
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    const device = 'testDevice';
    win32USBtility.extractUsbState(mountPath).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  });

  it('test methods for extractUsbState', done => {
    mockexecErrorParameter = undefined;
    mockexecStdOutParameter = undefined;
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    const device = 'testDevice';
    win32USBtility.extractUsbState(mountPath).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  });

  it('test methods for extractUsbState', done => {
    mockexecErrorParameter = undefined;
    mockexecStdOutParameter = 'invalid';
    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath';
    const device = 'testDevice';
    win32USBtility.extractUsbState(mountPath).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  });


  it('test methods for ejectUSBDriveSafely', done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  });

  it('test methods for ejectUSBDriveSafely', done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  });

  it('test methods for ejectUSBDriveSafely', done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  });

  it('test methods for ejectUSBDriveSafely', done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = true;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    win32USBtility.ejectUSBDriveSafely(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  });

  it('test methods for syncUsbDevice', () => done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
    };
    win32USBtility.syncUsbDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  });

  it('test methods for syncUsbDevice', () => done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.syncUsbDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  });

  it('test methods for syncUsbDevice', done => {
    const win32USBtility = new Win32USBUtility();
    mockexecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
    };
    win32USBtility.syncUsbDevice(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  });
});
