const PlatformObjects = require('../../src/platform/PlatformObjects');
const USBController = require('../../src/USBController.js');
let platformObjects = new PlatformObjects('mock');
let usbController = new USBController({ useMockUsbDetect: true })

jest.useFakeTimers();
jest.mock('usb-detection')
jest.mock('md5-file')
jest.mock('get-folder-size')
jest.mock('rimraf')

let gpioUtility = platformObjects.getGPIOUtility();
let usbUtility = platformObjects.getUSBUtility();

const nodePath = require('path');

let mockfsErrorParameter = false
let mockfsStdOutParameter = 'mockstdout'
let dirString = " D:\ "
let fswithFileTypes = true;
let fsrecursive = true;
let fspath = ''

let mockReadDirPath = '';
let mockErr = undefined;
let mockCopyFileErr = undefined;
let mockFsReturnValue = [];
let mockdeviceList = [{
  description: 'Test USB Device',
  mountpoints: [
    {
      path: 'T:\\'
    }
  ],
  isUSB: true,
}]

// mock file system
const fs = require('fs');
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
  })
}));

// mock drivelist
const drivelist = require('drivelist');
jest.mock('drivelist', () => ({
  list: jest.fn(() => {
    const drivelist = mockdeviceList
    return drivelist;
  })
}));

//mock getsize
const getSize = require('get-folder-size');
jest.mock('get-folder-size', () => jest.fn((dir, callback) => {
  let size = 993192
  const err = mockErr;
  callback(err, size);
}));

//mock rimraf
const rimraf = require('rimraf');
jest.mock('rimraf', () => jest.fn((dir, callback) => {
  const err = mockErr;
  callback(err);
}));

let File = { path: 'testPath', name: 'testName' }
let mockForm = {
  multiples: false,
  maxFileSize: 0,
  parse: jest.fn((req, callback) => {
    let fields = { currentDirectory: 'currentDir' }
    let files = { uploads: File }
    const err = mockErr;
    callback(err, fields, files)
  })
}

//mock formidable
const formidable = require('formidable');
jest.mock('formidable', () => ({
  IncomingForm: jest.fn(() => {
    return mockForm;
  }),
}));

//mock
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.download = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (queryData) => {
  return {
    query: queryData,
  };
};

describe("USBController Usb Flash Operations", () => {

  test("init should call openForInput", () => {
    let openForInputSpy = jest.spyOn(gpioUtility, 'openForInput');
    usbController.registerPlatformObjects(platformObjects);
    usbController.init();
    expect(openForInputSpy).toHaveBeenCalledTimes(2);
  })

  test("checkKVMLedState", () => {
    usbController.checkKVMLedState();
    expect(usbController.usbState.kvmLedStateRPI).toBe(true);
    expect(usbController.usbState.kvmLedStateECU).toBe(true);
    usbController.checkKVMLedState();
  })

  //??
  /* 
  test("detectDriveChanges", () => {
    console.log('wowowo1', usbController.usbState)

    usbController.detectDriveChanges()

    usbController.detectDriveChanges()
    jest.advanceTimersByTime(1500);
    console.log('wowowo2', usbController.usbState)
    //expect(usbusbController.usbState)
  }) */

  test("detectUsbDevice isDriveFound = true;", async () => {
    let extractUsbStateSpy = jest.spyOn(usbUtility, 'extractUsbState');
    await usbController.detectUsbDevice();
    expect(extractUsbStateSpy).toBeCalled();
  })

  test("detectUsbDevice isDriveFound = false;", async () => {
    mockdeviceList = [{
      description: 'Test USB Device',
      mountpoints: [
        {
          path: 'T:\\'
        }
      ],
      isUSB: false,
    }]
    await usbController.detectUsbDevice();
    expect(usbController.usbState.isAvailable).toBe(false);
  })

  test("isSafeToToggleUsbDevice ", () => {
    usbController.timeToCheckSafety = 0
    expect(usbController.isSafeToToggleUsbDevice()).toBe(true);
    expect(usbController.isSafeToToggleUsbDevice()).toBe(false);
    usbController.timeToCheckSafety = 1591193912494
    expect(usbController.isSafeToToggleUsbDevice()).toBe(true);
  })

  test("toggleUsbDevice ", () => {
    usbController.timeToCheckSafety = 0
    let ejectUSBDriveSafelySpy = jest.spyOn(usbUtility, 'ejectUSBDriveSafely');
    usbController.toggleUsbDevice()
    expect(ejectUSBDriveSafelySpy).toHaveBeenCalled();
    usbController.toggleUsbDevice()
  })

  test("pinToggleSequence toggleTimeoutHandle ", () => {
    usbController.toggleTimeoutHandle = true
    usbController.pinToggleSequence()
    expect(usbController.toggleTimeoutHandle).toBe(true)
    jest.advanceTimersByTime(1500);
    usbController.pinToggleSequence()
  })
});

describe("USBController Folder Operations", () => {
  beforeEach(() => {
    mockfsErrorParameter = false
    mockfsStdOutParameter = 'mockstdout'
    dirString = " D:\ "
    fswithFileTypes = true;
    fsrecursive = true;
    fspath = ''
    mockReadDirPath = '';
    mockErr = undefined;
    mockCopyFileErr = undefined;
    mockFsReturnValue = [];
  })

  test("listUsbDeviceItems", (done) => {
    mockErr = undefined;
    mockFsReturnValue = [{
      name: 'testDir',
      isDirectory: () => { return true; },
    }];
    const mockPath = 'anotherDir';
    usbController.usbState.mountedPath = 'test';
    usbController.listUsbDeviceItems(mockPath).then(() => {
      expect(usbController.usbState.currentDirectory).toMatch(/anotherDir/);
      expect(usbController.usbState.currentItems.length).toBe(2);
      done();
    });
  })

  test("listUsbDeviceItems err", (done) => {
    mockErr = true;
    mockFsReturnValue = [];
    const mockPath = '.';
    usbController.listUsbDeviceItems(mockPath).then(() => {
      throw new Error();
    }, () => {
      done()
    }
    );
  })

  test("listUsbDeviceItems if case resolve", (done) => {
    mockErr = undefined;
    mockFsReturnValue = [];
    const mockPath = '.';
    usbController.usbState.mountedPath = ''
    usbController.listUsbDeviceItems(mockPath).then(() => {
      done()
    }, () => {
      throw new Error();
    }
    );
  })

  test("createUsbDeviceFolder", (done) => {
    mockErr = undefined;
    mockFsReturnValue = [{
      name: 'testDir',
      isDirectory: () => { return true; },
    }];
    const mockPath = '.';
    let syncUsbDeviceSpy = jest.spyOn(usbUtility, 'syncUsbDevice');
    usbController.createUsbDeviceFolder(mockPath, 'asd').then(() => {
      expect(syncUsbDeviceSpy).toHaveBeenCalled();
      done()
    }, () => {
      throw new Error();
    }
    );
  })

  test("createUsbDeviceFolder err", (done) => {
    mockErr = true;
    mockFsReturnValue = [{
      name: 'testDir',
      isDirectory: () => { return true; },
    }];
    const mockPath = '.';
    let syncUsbDeviceSpy = jest.spyOn(usbUtility, 'syncUsbDevice');
    usbController.createUsbDeviceFolder(mockPath, 'asd').then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant createUsbDeviceFolder');
      done()
    }
    );
  })

  test("getItemInfo", () => {
    mockErr = undefined
    itemName = 'testname'
    path = 'testpath'

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => { return false; },
      isFile: () => { return true; },
    }
    let getFileInfoSpy = jest.spyOn(usbController, 'getFileInfo');
    usbController.getItemInfo(path, itemName);
    expect(getFileInfoSpy).toHaveBeenCalled();

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => { return true; },
      isFile: () => { return false; },
    }
    let getFolderInfoSpy = jest.spyOn(usbController, 'getFolderInfo');
    usbController.getItemInfo(path, itemName);
    expect(getFolderInfoSpy).toHaveBeenCalled();
  })

  test("getItemInfo err", () => {
    itemName = 'testname'
    path = 'testpath'
    mockErr = true
    usbController.getItemInfo(path, itemName);
    expect(usbController.usbState.usbErrorString).toBe('undefined Cant getFileStatus');
  })

  test("deleteUsbDeviceItem", () => {
    mockErr = undefined;

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => { return false; },
      isFile: () => { return true; },
    }
    let deleteUsbDeviceFileSpy = jest.spyOn(usbController, 'deleteUsbDeviceFile');
    const mockPath = 'testDir';
    const itemName = 'testName';
    usbController.deleteUsbDeviceItem(mockPath, itemName)
    expect(deleteUsbDeviceFileSpy).toHaveBeenCalled();

    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => { return true; },
      isFile: () => { return false; },
    }
    let deleteUsbDeviceFolderSpy = jest.spyOn(usbController, 'deleteUsbDeviceFolder');
    usbController.deleteUsbDeviceItem(mockPath, itemName)
    expect(deleteUsbDeviceFolderSpy).toHaveBeenCalled();
  })

  test("deleteUsbDeviceItem err", () => {
    mockErr = true;
    mockFsReturnValue = {
      size: 0,
      mtime: '2020-05-28T07:21:32.000Z',
      birthtime: '2020-05-28T07:21:30.380Z',
      isDirectory: () => { return false; },
      isFile: () => { return true; },
    }
    let deleteUsbDeviceFileSpy = jest.spyOn(usbController, 'deleteUsbDeviceFile');
    const mockPath = 'testDir';
    const itemName = 'testName';
    usbController.deleteUsbDeviceItem(mockPath, itemName)
    expect(usbController.usbState.usbErrorString).toBe('undefined Cant getFileStatus');
  })

  test("deleteUsbDeviceFile", done => {
    mockErr = undefined;
    const mockPath = 'testDir';
    const itemName = 'testName';
    usbController.deleteUsbDeviceFile(mockPath, itemName).then(() => {
      done()
    }, () => {
      throw new Error();
    }
    );
  })

  test("deleteUsbDeviceFile err", done => {
    mockErr = true;
    const mockPath = 'testDir';
    const itemName = 'testName';
    usbController.deleteUsbDeviceFile(mockPath, itemName).then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant deleteUsbDeviceFile');
      done()
    }
    );
  })

  test("deleteUsbDeviceFolder", done => {
    mockErr = undefined;
    const mockPath = 'testDir';
    const itemName = 'testName';
    usbController.deleteUsbDeviceFolder(mockPath, itemName).then(() => {
      done()
    }, () => {
      throw new Error();
    }
    );
  })

  test("deleteUsbDeviceFolder err", done => {
    mockErr = true;
    const mockPath = 'testDir';
    const itemName = 'testName';
    usbController.deleteUsbDeviceFolder(mockPath, itemName).then(() => {
      throw new Error();
    }, () => {
      expect(usbController.usbState.usbErrorString).toBe('undefined Cant deleteUsbDeviceFolder');
      done()
    }
    );
  })

  test("convertItemSizeToString", () => {
    sizeInBytes = 194
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('194 Bytes');

    sizeInBytes = 18273
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('17.84 KB');

    sizeInBytes = 1986384
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('1.89 MB');

    sizeInBytes = 9199986384
    usbController.convertItemSizeToString(sizeInBytes);
    expect(usbController.convertItemSizeToString(sizeInBytes)).toBe('8.57 GB');
  })

  test("getFileInfo", async () => {
    let dir = 'D:\test\testDocument.pdf'
    let itemInfo = {
      path: 'D:\\test\\testDocument.pdf',
      name: 'testDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: undefined,
      md5: undefined
    }
    let stats = {
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
      birthtime: '2020-06-04T05:08:19.520Z'
    }
    await usbController.getFileInfo(stats, dir, itemInfo)
    expect(usbController.usbState.currentItemInfo).toStrictEqual({ "createDate": "04/06/2020, 08:08:19", "md5": undefined, "modifyDate": "28/01/2020, 14:33:42", "name": "testDocument.pdf", "path": "D:\\test\\testDocument.pdf", "size": "89.57 KB" });
  })

  test("getFolderInfo", () => {
    mockErr = undefined
    let dir = 'D:\test\anotherTestDocument.pdf'
    let itemInfo = {
      path: 'D:\\test\\anotherTestDocument.pdf',
      name: 'anotherTestDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: 51513,
      md5: undefined
    }
    let stats = ''
    usbController.getFolderInfo(stats, dir, itemInfo)
    expect(usbController.usbState.currentItemInfo).toStrictEqual({ "createDate": "04/06/2020, 08:08:19", "md5": undefined, "modifyDate": "28/01/2020, 14:33:42", "name": "anotherTestDocument.pdf", "path": "D:\\test\\anotherTestDocument.pdf", "size": "969.91 KB" });
  })

  test("getFolderInfo err", () => {
    mockErr = true
    let dir = 'D:\test\anotherTestDocument.pdf'
    let itemInfo = {
      path: 'D:\\test\\anotherTestDocument.pdf',
      name: 'anotherTestDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: 51513,
      md5: undefined
    }
    let stats = ''
    usbController.getFolderInfo(stats, dir, itemInfo)
    expect(usbController.usbState.usbErrorString).toBe('undefined Cant getFolderInfo-getSize');
  })

  test("uploadFileToUsbDevice ", () => {
    mockErr = undefined
    const res = mockResponse();
    let req = {}
    usbController.uploadFileToUsbDevice(req, res)
    expect(res.send).toHaveBeenCalledWith('done')
  })

  test("uploadFileToUsbDevice parse err ", () => {
    mockErr = true
    const res = mockResponse();
    let req = {}
    usbController.uploadFileToUsbDevice(req, res)
    expect(res.send).toHaveBeenCalledWith('true')
  })

  test("uploadFileToUsbDevice copyFile err ", () => {
    mockCopyFileErr = true
    mockErr = undefined
    const res = mockResponse();
    let req = {}
    usbController.uploadFileToUsbDevice(req, res)
    expect(res.send).toHaveBeenCalledWith('true')
  })

  test("getFileFromUsbDevice ", () => {
    let req = { query: { path: 'testPath', fileName: 'testName' } }
    //const req = mockRequest(path);
    const res = mockResponse();
    usbController.getFileFromUsbDevice(req, res)
    expect(res.download).toHaveBeenCalled()

    req = { query: { path: undefined, fileName: undefined } }
    usbController.getFileFromUsbDevice(req, res)
    expect(res.send).toHaveBeenCalledWith('invalid parameters')
  })
});

describe("USBController", () => {

  test("should return true", () => {
    expect(usbController.isAuthRequired()).toBe(true);
  });

  test("onExit  ", () => {
    usbController.onExit()
    usbController.ledReadIntervalHandle = false
    usbController.onExit()
    expect(usbController.ledReadIntervalHandle).toBe(false)
  })

  test("handleMessage", () => {
    let usbController = new USBController({ useMockUsbDetect: true });
    let obj = { usb: { action: 'toggleDevice' } };
    mocktfunc = jest.fn();
    usbController.toggleUsbDevice = mocktfunc;
    usbController.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'detectUsbDevice' } };
    usbController.detectUsbDevice = mocktfunc;
    usbController.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'listItems', path: 'testpath' } };
    usbController.listUsbDeviceItems = mocktfunc;
    usbController.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'deleteItem', path: 'testpath', itemName: "testname" } };
    usbController.deleteUsbDeviceItem = mocktfunc;
    usbController.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'getItemInfo', path: 'testpath', itemName: "testname" } };
    usbController.getItemInfo = mocktfunc;
    usbController.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'createFolder', path: 'testpath', itemName: "testname" } };
    usbController.createUsbDeviceFolder = mocktfunc;
    usbController.handleMessage(obj);
    expect(mocktfunc).toHaveBeenCalled();

    obj = { usb: { action: 'testaction' } };
    usbController.handleMessage(obj);

    obj.usb = undefined
    usbController.handleMessage(obj);
  })
});