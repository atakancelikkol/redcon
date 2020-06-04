
const PlatformObjects = require('../../src/platform/PlatformObjects');
const USBController = require('../../src/USBController.js');
let platformObjects = new PlatformObjects('mock');
let usbController = new USBController()


jest.useFakeTimers();
jest.mock('usb-detection')
jest.mock('md5-file')
jest.mock('get-folder-size')


let gpioUtility = platformObjects.getGPIOUtility();
let usbUtility = platformObjects.getUSBUtility();
const drivelist = require('drivelist');
const nodePath = require('path');
const fs = require('fs');


let mockfsErrorParameter = false
let mockfsStdOutParameter = 'mockstdout'
let dirString = " D:\ "
let fswithFileTypes = true;
let fsrecursive = true;
let fspath = ''




describe("USBController", () => {

  test("should return true", () => {
    expect(usbController.isAuthRequired()).toBe(true);
  });

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

  test("detectDriveChanges", () => {
    usbController.detectDriveChanges()

  })
  /* 
    test("detectUsbDevice", done => {
  
  
      jest.mock('drivelist', () => ({
        list: jest.fn(() => {
          let obj = {
            enumerator: 'USBSTOR',
            busType: 'USB',
            busVersion: '2.0',
            device: '\\\\.\\PhysicalDrive1',
            devicePath: null,
            raw: '\\\\.\\PhysicalDrive1',
            description: 'SanDisk Cruzer Blade USB Device',
            error: null,
            size: 15631122432,
            blockSize: 512,
            logicalBlockSize: 512,
            mountpoints: [[Object]],
            isReadOnly: false,
            isSystem: false,
            isVirtual: false,
            isRemovable: true,
            isCard: false,
            isSCSI: false,
            isUSB: true,
            isUAS: false
          }
          return obj
        })
      }));
  
  
      usbController.detectUsbDevice();
      expect(usbController.usbState).toStrictEqual();
      //expect(usbController.usbState.kvmLedStateECU).toBe(true);
  
    })
   */
  test("listUsbDeviceItems", () => {
    usbController.usbState.mountedPath = ''
    path = 'testpath'
    usbController.listUsbDeviceItems(path)
    expect(usbController.usbState.currentDirectory).toBe(path);
    expect(usbController.usbState.currentItems).toStrictEqual([]);
  })

  test("listUsbDeviceItems err", done => {
    jest.mock('fs', () => ({
      readdir: jest.fn((dir, withFileTypes, callback) => {
        console.log("asdasdasdasdaskfjflgkşjdflkghm")
        dirString = dir;
        fswithFileTypes = withFileTypes;
        const error = mockfsErrorParameter
        const testStdOut = mockfsStdOutParameter
        callback(error, testStdOut);
      }),
    }))
  
    path = '.'
    mockfsErrorParameter = false
    usbController.usbState.mountedPath = 'mountedPath'
    usbController.listUsbDeviceItems(path).then(() => {
      throw new Error();
    }, () => {
      done()
    }
    );



  })



  /* 
test("getItemInfo", () => {
  
  
  itemName='testname'
  path='testpath'

  usbController.getItemInfo(path,itemName);
  expect(usbController.usbState.usbErrorString).toBe('');
  
  //TODO
  //fs
}) */


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
    //TODO get size mock
    let dir = 'D:\test\testDocument2.pdf'
    let itemInfo = {
      path: 'D:\\test\\testDocument2.pdf',
      name: 'testDocument.pdf',
      createDate: '04/06/2020, 08:08:19',
      modifyDate: '28/01/2020, 14:33:42',
      size: 51513,
      md5: undefined
    }
    let stats = ''
    usbController.getFolderInfo(stats, dir, itemInfo)
    expect(usbController.usbState.currentItemInfo).toStrictEqual({ "createDate": "04/06/2020, 08:08:19", "md5": undefined, "modifyDate": "28/01/2020, 14:33:42", "name": "testDocument.pdf", "path": "D:\\test\\testDocument.pdf", "size": "89.57 KB" });
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
    jest.advanceTimersByTime(1500);
    usbController.pinToggleSequence()
    //no expect ?
  })

  test("onExit  ", () => {
    usbController.onExit()
    usbController.ledReadIntervalHandle = false
    usbController.onExit()
    expect(usbController.ledReadIntervalHandle).toBe(false)
  })

  test("handleMessage", () => {
    let usbController = new USBController();
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