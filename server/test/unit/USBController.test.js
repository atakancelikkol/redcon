const PlatformObjects = require('../../src/platform/PlatformObjects');
const USBController = require('../../src/controllers/USBController.js');
const HttpServer = require('../../src/HttpServer.js');

const platformObjects = new PlatformObjects('mock');
const usbController = new USBController({ useMockUsbDetect: true });
const httpServer = new HttpServer({ controllers: [] });

jest.useFakeTimers();
jest.mock('usb-detection');
jest.mock('md5-file');
jest.mock('get-folder-size');
jest.mock('rimraf');

const gpioUtility = platformObjects.getGPIOUtility();
const usbUtility = platformObjects.getUSBUtility();
let mockPath = '';
let fspath = 'testpath';
let mockErr;
let mockCopyFileErr;
let mockFsReturnValue = [];
let mockdeviceList = [{
  description: 'Test USB Device',
  mountpoints: [
    { path: 'T:\\' },
  ],
  isUSB: true,
}];
let itemName = 'testname';

// mock file system
jest.mock('fs', () => ({
  readdir: jest.fn((dir, options, callback) => {
    const err = mockErr;
    const items = mockFsReturnValue;
    callback(err, items);
  }),
  stat: jest.fn((dir, callback) => {
    const err = mockErr;
    const items = mockFsReturnValue;
    callback(err, items);
  }),
  mkdir: jest.fn((dir, option, callback) => {
    const err = mockErr;
    callback(err);
  }),
  lstat: jest.fn((dir, callback) => {
    const err = mockErr;
    const items = mockFsReturnValue;
    callback(err, items);
  }),
  unlink: jest.fn((dir, callback) => {
    const err = mockErr;
    callback(err);
  }),
  copyFile: jest.fn((dir, anotherDir, callback) => {
    const err = mockCopyFileErr;
    callback(err);
  }),
}));

// mock drivelist
jest.mock('drivelist', () => ({ list: jest.fn(() => {
  const drivelist = mockdeviceList;
  return drivelist;
}) }));

// mock getsize
jest.mock('get-folder-size', () => jest.fn((dir, callback) => {
  const size = 993192;
  const err = mockErr;
  callback(err, size);
}));

// mock rimraf
jest.mock('rimraf', () => jest.fn((dir, callback) => {
  const err = mockErr;
  callback(err);
}));

const File = {
  path: 'testPath', name: 'testName',
};
const mockForm = {
  multiples: false,
  maxFileSize: 0,
  parse: jest.fn((req, callback) => {
    const fields = { currentDirectory: 'currentDir' };
    const files = { uploads: File };
    const err = mockErr;
    callback(err, fields, files);
  }),
};

// mock formidable
jest.mock('formidable', () => ({ IncomingForm: jest.fn(() => mockForm) }));

// mock
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.download = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

beforeAll(async () => {
  httpServer.init();
});

afterAll(() => {
  httpServer.httpServer.close();
});

describe('USBController Usb Flash Operations', () => {
  test('init should call openForInput', () => {
    const openForInputSpy = jest.spyOn(gpioUtility, 'openForInput');
    usbController.registerPlatformObjects(platformObjects);
    usbController.registerHttpServer(httpServer);
    usbController.init();
    expect(openForInputSpy).toHaveBeenCalledTimes(2);
  });

  test('checkKVMLedState', () => {
    usbController.checkKVMLedState();
    expect(usbController.usbState.kvmLedStateRPI).toBe(true);
    expect(usbController.usbState.kvmLedStateECU).toBe(true);
  });

  test('detectDriveChanges', () => new Promise((done) => { // eslint-disable-line
    usbController.usbState.isAvailable = false;
    usbController.detectDriveChanges().then(() => {
      expect(usbController.usbState.isAvailable).toBe(true);
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('detectUsbDevice isDriveFound = true;', async () => { // eslint-disable-line
    const extractUsbStateSpy = jest.spyOn(usbUtility, 'extractUsbState');
    await usbController.detectUsbDevice();
    expect(extractUsbStateSpy).toBeCalled();
  });

  test('detectUsbDevice isDriveFound = false;', async () => {
    mockdeviceList = [{
      description: 'Test USB Device',
      mountpoints: [
        { path: 'T:\\' },
      ],
      isUSB: false,
    }];
    await usbController.detectUsbDevice();
    expect(usbController.usbState.isAvailable).toBe(false);
  });

  test('formatUsbDevice if is available', async () => {
    usbController.usbState.isAvailable = true;
    const formatUSBDriveSpy = jest.spyOn(usbUtility, 'formatUSBDrive');
    const tempListUsbDeviceItems = usbController.listUsbDeviceItems;
    usbController.listUsbDeviceItems = jest.fn();
    await usbController.formatUsbDevice();
    expect(formatUSBDriveSpy).toBeCalled();
    expect(usbController.listUsbDeviceItems).toBeCalled();
    usbController.listUsbDeviceItems = tempListUsbDeviceItems;
  });

  test('formatUsbDevice if usb is not available', async () => {
    usbController.usbState.isAvailable = false;
    const formatUSBDriveSpy = jest.spyOn(usbUtility, 'formatUSBDrive');
    const tempListUsbDeviceItems = usbController.listUsbDeviceItems;
    usbController.listUsbDeviceItems = jest.fn();
    await usbController.formatUsbDevice();
    expect(formatUSBDriveSpy).not.toBeCalled();
    expect(usbController.listUsbDeviceItems).not.toBeCalled();
    usbController.listUsbDeviceItems = tempListUsbDeviceItems;
  });

  test('isSafeToToggleUsbDevice ', () => {
    usbController.timeToCheckSafety = 0;
    expect(usbController.isSafeToToggleUsbDevice()).toBe(true);
    expect(usbController.isSafeToToggleUsbDevice()).toBe(false);
    usbController.timeToCheckSafety = 1591193912494;
    expect(usbController.isSafeToToggleUsbDevice()).toBe(true);
  });

  test('toggleUsbDevice ', () => {
    usbController.timeToCheckSafety = 0;
    const ejectUSBDriveSafelySpy = jest.spyOn(usbUtility, 'ejectUSBDriveSafely');
    usbController.toggleUsbDevice();
    expect(ejectUSBDriveSafelySpy).toHaveBeenCalled();
    usbController.toggleUsbDevice();
  });

  test('pinToggleSequence toggleTimeoutHandle ', () => {
    usbController.toggleTimeoutHandle = true;
    usbController.pinToggleSequence();
    expect(usbController.toggleTimeoutHandle).toBe(true);
    jest.advanceTimersByTime(1500);
    usbController.pinToggleSequence();
  });
});

describe('USBController Folder Operations', () => {
  beforeEach(() => {
    mockErr = undefined;
    mockCopyFileErr = undefined;
    mockFsReturnValue = [];
    itemName = 'testname';
    fspath = 'testpath';
    mockPath = 'anotherDir';
  });

  test('listUsbDeviceItems', () => new Promise((done) => {
    mockErr = undefined;
    mockFsReturnValue = [{
      name: 'testDir',
      isDirectory: () => true,
    }];
    mockPath = 'anotherDir';
    usbController.usbState.mountedPath = 'test';
    usbController.listUsbDeviceItems(mockPath).then(() => {
      expect(usbController.usbState.currentDirectory).toMatch(/anotherDir/);
      expect(usbController.usbState.currentItems.length).toBe(2);
      done();
    });
  }));

  test('listUsbDeviceItems err', () => new Promise((done) => {
    mockErr = true;
    mockFsReturnValue = [];
    mockPath = '.';
    usbController.listUsbDeviceItems(mockPath).then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant listUsbDeviceItems');
      done();
    });
  }));

  test('listUsbDeviceItems if case resolve', () => new Promise((done) => {
    mockErr = undefined;
    mockFsReturnValue = [];
    mockPath = 'testPath';
    usbController.usbState.mountedPath = '';
    usbController.listUsbDeviceItems(mockPath).then(() => {
      expect(usbController.usbState.currentDirectory).toBe('testPath');
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('createUsbDeviceFolder', () => new Promise((done) => {
    mockErr = undefined;
    mockFsReturnValue = [{
      name: 'testDir',
      isDirectory: () => true,
    }];
    mockPath = '.';
    const syncUsbDeviceSpy = jest.spyOn(usbUtility, 'syncUsbDevice');
    usbController.createUsbDeviceFolder(mockPath, 'asd').then(() => {
      expect(syncUsbDeviceSpy).toHaveBeenCalled();
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('createUsbDeviceFolder err', () => new Promise((done) => {
    mockErr = true;
    mockFsReturnValue = [{
      name: 'testDir',
      isDirectory: () => true,
    }];
    mockPath = '.';
    usbController.createUsbDeviceFolder(mockPath, 'asd').then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant createUsbDeviceFolder');
      done();
    });
  }));

  test('getItemInfo', () => {
    mockErr = undefined;
    itemName = 'testname';
    fspath = 'testpath';

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => false,
      isFile: () => true,
    };
    const getFileInfoSpy = jest.spyOn(usbController, 'getFileInfo');
    usbController.getItemInfo(fspath, itemName);
    expect(getFileInfoSpy).toHaveBeenCalled();

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => true,
      isFile: () => false,
    };
    const getFolderInfoSpy = jest.spyOn(usbController, 'getFolderInfo');
    usbController.getItemInfo(fspath, itemName);
    expect(getFolderInfoSpy).toHaveBeenCalled();
  });

  test('getItemInfo err', () => {
    itemName = 'testname';
    fspath = 'testpath';
    mockErr = true;
    usbController.getItemInfo(fspath, itemName);
    expect(usbController.usbState.usbErrorString).toBe('undefined Cant getFileStatus');
  });

  test('deleteUsbDeviceItem', () => {
    mockErr = undefined;

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => false,
      isFile: () => true,
    };
    const deleteUsbDeviceFileSpy = jest.spyOn(usbController, 'deleteUsbDeviceFile');
    mockPath = 'testDir';
    itemName = 'testName';
    usbController.deleteUsbDeviceItem(mockPath, itemName);
    expect(deleteUsbDeviceFileSpy).toHaveBeenCalled();

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => true,
      isFile: () => false,
    };
    const deleteUsbDeviceFolderSpy = jest.spyOn(usbController, 'deleteUsbDeviceFolder');
    usbController.deleteUsbDeviceItem(mockPath, itemName);
    expect(deleteUsbDeviceFolderSpy).toHaveBeenCalled();
  });

  test('deleteUsbDeviceItem err', () => {
    mockErr = true;
    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => false,
      isFile: () => true,
    };
    mockPath = 'testDir';
    itemName = 'testName';
    usbController.deleteUsbDeviceItem(mockPath, itemName);
    expect(usbController.usbState.usbErrorString).toBe('undefined Cant getFileStatus');
  });

  test('deleteUsbDeviceFile', () => new Promise((done) => {
    const syncUsbDeviceSpy = jest.spyOn(usbUtility, 'syncUsbDevice');
    mockErr = undefined;
    mockPath = 'testDir';
    itemName = 'testName';
    usbController.deleteUsbDeviceFile(mockPath, itemName).then(() => {
      expect(syncUsbDeviceSpy).toHaveBeenCalled();
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('deleteUsbDeviceFile err', () => new Promise((done) => {
    mockErr = true;
    mockPath = 'testDir';
    itemName = 'testName';
    usbController.deleteUsbDeviceFile(mockPath, itemName).then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant deleteUsbDeviceFile');
      done();
    });
  }));

  test('deleteUsbDeviceFolder', () => new Promise((done) => {
    const syncUsbDeviceSpy = jest.spyOn(usbUtility, 'syncUsbDevice');
    mockErr = undefined;
    mockPath = 'testDir';
    itemName = 'testName';
    usbController.deleteUsbDeviceFolder(mockPath, itemName).then(() => {
      expect(syncUsbDeviceSpy).toHaveBeenCalled();
      done();
    }, () => {
      throw new Error();
    });
  }));

  test('deleteUsbDeviceFolder err', () => new Promise((done) => {
    mockErr = true;
    mockPath = 'testDir';
    itemName = 'testName';
    usbController.deleteUsbDeviceFolder(mockPath, itemName).then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant deleteUsbDeviceFolder');
      done();
    });
  }));

  test('convertItemSizeToString', () => {
    let sizeInBytes = 194;
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('194 Bytes');

    sizeInBytes = 18273;
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('17.84 KB');

    sizeInBytes = 1986384;
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('1.89 MB');

    sizeInBytes = 9199986384;
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('8.57 GB');
  });

  test('getFileInfo', async () => {
    const dir = 'D:\test\testDocument.pdf';
    const itemInfo = {
      path: 'D:\\test\\testDocument.pdf',
      name: 'testDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: undefined,
      md5: undefined,
    };
    const stats = {
      dev: 3325788114,
      mode: 33206,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 0,
      blksize: 4096,
      ino: 8536608,
      size: 91724,
      blocks: 192,
      atimeMs: 1591218000000,
      mtimeMs: 1580211222000,
      ctimeMs: 3373865674955.1616,
      birthtimeMs: 1591247299520,
      atime: '2020-06-03T21:00:00.000Z',
      mtime: '2020-01-28T11:33:42.000Z',
      ctime: '2076-11-29T08:54:34.955Z',
      birthtime: '2020-06-04T05:08:19.520Z',
    };
    await usbController.getFileInfo(stats, dir, itemInfo);
    expect(usbController.usbState.currentItemInfo).toStrictEqual({
      createDate: '04/06/2020, 08:08:19', md5: undefined, modifyDate: '28/01/2020, 14:33:42', name: 'testDocument.pdf', path: 'D:\\test\\testDocument.pdf', size: '89.57 KB',
    });
  });

  test('getFolderInfo', () => {
    mockErr = undefined;
    const dir = 'D:\\test\\anotherTestDocument.pdf';
    const itemInfo = {
      path: 'D:\\test\\anotherTestDocument.pdf',
      name: 'anotherTestDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: 51513,
      md5: undefined,
    };
    const stats = '';
    usbController.getFolderInfo(stats, dir, itemInfo);
    expect(usbController.usbState.currentItemInfo).toStrictEqual({
      createDate: '04/06/2020, 08:08:19', md5: undefined, modifyDate: '28/01/2020, 14:33:42', name: 'anotherTestDocument.pdf', path: 'D:\\test\\anotherTestDocument.pdf', size: '969.91 KB',
    });
  });

  test('getFolderInfo err', () => {
    mockErr = true;
    const dir = 'D:\\test\\anotherTestDocument.pdf';
    const itemInfo = {
      path: 'D:\\test\\anotherTestDocument.pdf',
      name: 'anotherTestDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: 51513,
      md5: undefined,
    };
    const stats = '';
    usbController.getFolderInfo(stats, dir, itemInfo);
    expect(usbController.usbState.usbErrorString).toBe('undefined Cant getFolderInfo-getSize');
  });

  test('uploadFileToUsbDevice ', () => {
    mockErr = undefined;
    const res = mockResponse();
    const req = {};
    usbController.uploadFileToUsbDevice(req, res);
    expect(res.send).toHaveBeenCalledWith('done');
  });

  test('uploadFileToUsbDevice parse err ', () => {
    mockErr = true;
    const res = mockResponse();
    const req = {};
    usbController.uploadFileToUsbDevice(req, res);
    expect(res.send).toHaveBeenCalledWith('true');
  });

  test('uploadFileToUsbDevice copyFile err ', () => {
    mockCopyFileErr = true;
    mockErr = undefined;
    const res = mockResponse();
    const req = {};
    usbController.uploadFileToUsbDevice(req, res);
    expect(res.send).toHaveBeenCalledWith('true');
  });

  test('getFileFromUsbDevice ', () => {
    let req = { query: {
      path: 'testPath', fileName: 'testName',
    } };
    const res = mockResponse();
    usbController.getFileFromUsbDevice(req, res);
    expect(res.download).toHaveBeenCalled();

    req = { query: {
      path: undefined, fileName: undefined,
    } };
    usbController.getFileFromUsbDevice(req, res);
    expect(res.send).toHaveBeenCalledWith('invalid parameters');
  });
});

describe('USBController', () => {
  test('should return true', () => {
    expect(usbController.isAuthRequired()).toBe(true);
  });

  test('onExit  ', () => {
    usbController.onExit();
    usbController.ledReadIntervalHandle = false;
    usbController.onExit();
    expect(usbController.ledReadIntervalHandle).toBe(false);
  });

  test('handleMessage', () => {
    const usbControllerMsgHandler = new USBController({ useMockUsbDetect: true });
    let obj = { usb: { action: 'toggleDevice' } };
    const mocktfunc = jest.fn();
    usbControllerMsgHandler.toggleUsbDevice = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'detectUsbDevice' } };
    usbControllerMsgHandler.detectUsbDevice = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: {
      action: 'listItems', path: 'testpath',
    } };
    usbControllerMsgHandler.listUsbDeviceItems = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: {
      action: 'deleteItem', path: 'testpath', itemName: 'testname',
    } };
    usbControllerMsgHandler.deleteUsbDeviceItem = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: {
      action: 'getItemInfo', path: 'testpath', itemName: 'testname',
    } };
    usbControllerMsgHandler.getItemInfo = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: {
      action: 'createFolder', path: 'testpath', itemName: 'testname',
    } };
    usbControllerMsgHandler.createUsbDeviceFolder = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'formatUsbDevice' } };
    usbControllerMsgHandler.formatUsbDevice = mocktfunc;
    usbControllerMsgHandler.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'testaction' } };
    usbControllerMsgHandler.handleMessage(obj);

    obj.usb = undefined;
    usbControllerMsgHandler.handleMessage(obj);
  });
});
