const { EOL } = require('os');
const Win32USBUtility = require('../../../../src/platform/win32/Win32USBUtility');
const ServerConfig = require('../../../../src/ServerConfig');

let mockExecErrorParameter = true;
let mockexecStdOutParameter = `a1${EOL} a2${EOL} a3`;
let execCommandString = ''; // eslint-disable-line

jest.mock('child_process', () => ({ exec: jest.fn((commandString, callback) => {
  execCommandString = commandString;
  const error = mockExecErrorParameter;
  const testStdOut = mockexecStdOutParameter;
  callback(error, testStdOut, 'testStdError');
}) }));

let mockErr;
jest.mock('fs', () => ({
  writeFile: jest.fn((dir, data, callback) => {
    const err = mockErr;
    callback(err);
  }),
}));

describe('Win32USBUtility test', () => {
  it('test method for extractUsbState success case', () => new Promise((done) => {
    mockExecErrorParameter = undefined;
    mockexecStdOutParameter = `a1${EOL} a2${EOL} a3`;
    const win32USBtility = new Win32USBUtility();
    const mockDriveListIndex = {
      mountpoints: [{
        path: 'mockMountPoint',
      }],
      device: 'mockDevice',
    };
    win32USBtility.extractUsbState(mockDriveListIndex).then((platformUsbState) => {
      expect(platformUsbState).toStrictEqual({
        device: 'mockDevice', isAvailable: true, mountedPath: 'mockMountPoint', usbErrorString: '', usbName: 'a2',
      });
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for extractUsbState error case', () => new Promise((done) => { // eslint-disable-line
    mockExecErrorParameter = true;
    mockexecStdOutParameter = `a1${EOL} a2${EOL} a3`;
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

  it('tests formatUSBDrive', async () => {
    const win32USBtility = new Win32USBUtility();
    const usbState = { };
    const tempgetVolumeNumber = win32USBtility.getVolumeNumber;
    const temprunEditedDiskpartFile = win32USBtility.runEditedDiskpartFile;
    win32USBtility.getVolumeNumber = () => new Promise((resolve) => {
      resolve();
    });
    win32USBtility.runEditedDiskpartFile = () => new Promise((resolve) => {
      resolve();
    });
    const win32USBtilityGetVolumeNumberSpy = jest.spyOn(win32USBtility, 'getVolumeNumber');
    const win32USBtilityRunEditedDiskpartFileSpy = jest.spyOn(win32USBtility, 'runEditedDiskpartFile');
    await win32USBtility.formatUSBDrive(usbState);
    expect(win32USBtilityGetVolumeNumberSpy).toHaveBeenCalled();
    expect(win32USBtilityRunEditedDiskpartFileSpy).toHaveBeenCalled();
    win32USBtility.getVolumeNumber = tempgetVolumeNumber;
    win32USBtility.runEditedDiskpartFile = temprunEditedDiskpartFile;
  });

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

  it('test method for getVolumeNumber USB is not available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    mockexecStdOutParameter = `a1${EOL} a2${EOL} a3`;
    const usbState = {
      isAvailable: false,
      usbErrorString: '',
    };
    win32USBtility.getVolumeNumber(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for getVolumeNumber USB is available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    mockexecStdOutParameter = `a1${EOL} a2${EOL} a3`;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    win32USBtility.getVolumeNumber(usbState).then((parameter) => {
      expect(parameter).toBe('a1');
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('test method for getVolumeNumber exec error USB is available case', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = true;
    mockexecStdOutParameter = `a1${EOL} a2${EOL} a3`;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    win32USBtility.getVolumeNumber(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('test method for setNewFileContentToDiskpartFile USB is not available case', () => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    const usbState = {
      isAvailable: false,
      usbName: 'mockName',
    };
    const usbVolumeToBeFormatted = 'mockValue';
    const fileContent = win32USBtility.setNewFileContentToDiskpartFile(usbState, usbVolumeToBeFormatted);
    expect(fileContent).toBe('usb is not available!');
  });

  it('test method for setNewFileContentToDiskpartFile USB is available case', () => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    const usbState = {
      isAvailable: true,
    };
    const usbVolumeToBeFormatted = 'mockValue';
    const fileContent = win32USBtility.setNewFileContentToDiskpartFile(usbState, usbVolumeToBeFormatted);
    expect(fileContent).toBe(`select volume mockValue${EOL}format fs=fat32 quick label=${ServerConfig.LabelName}${EOL}exit`);
  });

  test('editDiskpartFileContent err', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockErr = true;
    const usbState = {
      usbErrorString: '',
    };
    win32USBtility.editDiskpartFileContent(usbState, 'mockFileContent').then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  test('editDiskpartFileContent success', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockErr = undefined;
    const usbState = {
      usbErrorString: '',
    };
    win32USBtility.editDiskpartFileContent(usbState, 'mockFileContent').then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('runEditedDiskpartFile 1', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      usbErrorString: '',
    };
    win32USBtility.editDiskpartFileContent(usbState, 'mockFileContent').then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('runEditedDiskpartFile 2', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    win32USBtility.editDiskpartFileContent(usbState, 'mockFileContent').then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('runEditedDiskpartFile 3', () => new Promise((done) => { // eslint-disable-line
    const win32USBtility = new Win32USBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    win32USBtility.editDiskpartFileContent(usbState, 'mockFileContent').then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));
});
