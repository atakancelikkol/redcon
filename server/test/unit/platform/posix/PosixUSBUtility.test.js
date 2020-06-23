const PosixUSBUtility = require('../../../../src/platform/posix/PosixUSBUtility');
const ServerConfig = require('../../../../src/ServerConfig');

let mockExecErrorParameter = true;
const mockexecStdOutParameter = 'a1\r\n a2\r\n a3';
let execCommandString = ''; // eslint-disable-line

jest.mock('child_process', () => ({ exec: jest.fn((commandString, callback) => {
  execCommandString = commandString;
  const error = mockExecErrorParameter;
  const testStdOut = mockexecStdOutParameter;
  callback(error, testStdOut, 'testStdError');
}) }));

describe('PosixUSBUtility test', () => {
  it('tests extractUsbState', () => {
    const posixUSBtility = new PosixUSBUtility();
    const mockDriveListIndex = {
      mountpoints: [{
        path: 'mockMountPoint',
        label: 'mockLabel',
      }],
      device: 'mockDevice',
    };
    expect(posixUSBtility.extractUsbState(mockDriveListIndex)).toMatchObject({
      device: 'mockDevice', isAvailable: true, mountedPath: 'mockMountPoint', usbName: 'mockLabel',
    });
  });

  it('tests formatUSBDrive', async () => {
    const posixUSBtility = new PosixUSBUtility();
    const usbState = { };
    const tempgetPartitionName = posixUSBtility.getPartitionName;
    const tempmountSelectedPartition = posixUSBtility.mountSelectedPartition;
    posixUSBtility.getPartitionName = jest.fn();
    posixUSBtility.mountSelectedPartition = jest.fn();
    await posixUSBtility.formatUSBDrive(usbState);
    expect(posixUSBtility.getPartitionName).toHaveBeenCalled();
    expect(posixUSBtility.mountSelectedPartition).toHaveBeenCalled();
    posixUSBtility.getPartitionName = tempgetPartitionName;
    posixUSBtility.mountSelectedPartition = tempmountSelectedPartition;
  });

  it('tests getPartitionName method 1', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
      usbErrorString: '',
    };
    posixUSBtility.getPartitionName(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests getPartitionName method 2', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
      usbErrorString: '',
    };
    posixUSBtility.getPartitionName(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests getPartitionName method 3', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
      usbErrorString: '',
    };
    posixUSBtility.getPartitionName(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

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
    const tempUnmountAllPartitionsOfTheDevice = posixUSBtility.unmountAllPartitionsOfTheDevice;
    posixUSBtility.unmountAllPartitionsOfTheDevice = () => new Promise((resolve) => {
      resolve();
    });
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
    posixUSBtility.unmountAllPartitionsOfTheDevice = tempUnmountAllPartitionsOfTheDevice;
  }));

  it('tests unmountAllPartitionsOfTheDevice method 1', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      mountedPath: '',
      device: '',
      usbErrorString: '',
    };
    posixUSBtility.unmountAllPartitionsOfTheDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests unmountAllPartitionsOfTheDevice method 2', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
      device: '',
      usbErrorString: '',
    };
    posixUSBtility.unmountAllPartitionsOfTheDevice(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests unmountAllPartitionsOfTheDevice method 3', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      mountedPath: '',
      device: '',
      usbErrorString: '',
    };
    posixUSBtility.unmountAllPartitionsOfTheDevice(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('tests unmountSelectedPartition method 1', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      usbErrorString: '',
    };
    posixUSBtility.unmountSelectedPartition(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests unmountSelectedPartition method 2', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    posixUSBtility.unmountSelectedPartition(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests unmountSelectedPartition method 3', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    posixUSBtility.unmountSelectedPartition(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));

  it('tests mountSelectedPartition method 1', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      mountedPath: '',
      usbErrorString: '',
    };
    const tempcreateMountPointForSelectedPartition = posixUSBtility.createMountPointForSelectedPartition;
    posixUSBtility.createMountPointForSelectedPartition = jest.fn();
    posixUSBtility.mountSelectedPartition(usbState).then(() => {
      expect(usbState.mountedPath).toBe(ServerConfig.MountPoint);
      done();
    }, () => {
      throw new Error();
    });
    posixUSBtility.createMountPointForSelectedPartition = tempcreateMountPointForSelectedPartition;
  }));

  it('tests mountSelectedPartition method 2', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      usbErrorString: '',
    };
    const tempcreateMountPointForSelectedPartition = posixUSBtility.createMountPointForSelectedPartition;
    posixUSBtility.createMountPointForSelectedPartition = jest.fn();
    posixUSBtility.mountSelectedPartition(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
    posixUSBtility.createMountPointForSelectedPartition = tempcreateMountPointForSelectedPartition;
  }));

  it('tests createMountPointForSelectedPartition method 1', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      usbErrorString: '',
    };
    posixUSBtility.createMountPointForSelectedPartition(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests createMountPointForSelectedPartition method 2', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      usbErrorString: '',
      mountedPath: '',
    };
    posixUSBtility.createMountPointForSelectedPartition(usbState).then(() => {
      throw new Error();
    }, () => {
      expect(usbState.mountedPath).toBe('');
      done();
    });
  }));

  it('tests formatSelectedPartition method 1', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: false,
      usbErrorString: '',
    };
    posixUSBtility.formatSelectedPartition(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests formatSelectedPartition method 2', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = undefined;
    const usbState = {
      isAvailable: true,
      usbErrorString: '',
    };
    posixUSBtility.formatSelectedPartition(usbState).then(() => {
      done();
    }, () => {
      throw new Error();
    });
  }));

  it('tests formatSelectedPartition method 3', () => new Promise((done) => { // eslint-disable-line
    const posixUSBtility = new PosixUSBUtility();
    mockExecErrorParameter = true;
    const usbState = {
      isAvailable: true,
      usbName: '',
      usbErrorString: '',
    };
    posixUSBtility.formatSelectedPartition(usbState).then(() => {
      throw new Error();
    }, () => {
      done();
    });
  }));
});
