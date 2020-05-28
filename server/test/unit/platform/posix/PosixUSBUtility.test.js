const PosixUSBUtility = require('../../../../src/platform/posix/PosixUSBUtility');
const { exec } = require('child_process');

jest.mock("child_process")

describe("PosixUSBUtility test", () => {
  it("test methods for extractUsbState", () => {
    const posixUSBtility = new PosixUSBUtility();
    const mountPath = 'testPath'
    const device = 'testDevice'
    expect(posixUSBtility.extractUsbState(mountPath, device)).toMatchObject({ "device": "testDevice", "isAvailable": true, "mountedPath": "testPath", "usbName": "testPath" });
  });

  it("test methods for syncUsbDevice", () => {
    const posixUSBtility = new PosixUSBUtility();
    let usbState = {
      isAvailable: true,
      mountedPath: '',
    }

    posixUSBtility.syncUsbDevice(usbState)
    expect(exec).toHaveBeenCalled();

  });

  it("test methods for promise syncUsbDevice", () => {
    const posixUSBtility = new PosixUSBUtility();
    let usbState = {
      isAvailable: false,
      mountedPath: '',
    }
    return expect(posixUSBtility.syncUsbDevice(usbState)).resolves.toBe(undefined);
  });

  it("test methods for promise ejectUSBDriveSafely", () => {
    const posixUSBtility = new PosixUSBUtility();
    let usbState = {
      isAvailable: false,
      mountedPath: '',
    }
    return expect(posixUSBtility.ejectUSBDriveSafely(usbState)).resolves.toBe(undefined);
  });

  it("test methods for ejectUSBDriveSafely", () => {
    const posixUSBtility = new PosixUSBUtility();
    let usbState = {
      isAvailable: true,
      mountedPath: '',
    }
    posixUSBtility.ejectUSBDriveSafely(usbState)
    expect(exec).toHaveBeenCalled();
  });

})