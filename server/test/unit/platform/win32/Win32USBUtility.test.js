const Win32USBUtility = require('../../../../src/platform/win32/Win32USBUtility');
const { exec } = require('child_process');
jest.mock("child_process")

describe("Win32USBUtility test", () => {
  it('test methods for extractUsbState', () => {

    const win32USBtility = new Win32USBUtility();
    const mountPath = 'testPath'
    const device = 'testDevice'
    win32USBtility.extractUsbState(mountPath)
    expect(exec).toHaveBeenCalled();
  });

  it("test methods for syncUsbDevice", () => {
    const win32USBtility = new Win32USBUtility();
    let usbState = {
      isAvailable: true,
      mountedPath: '',
    }
    win32USBtility.syncUsbDevice(usbState)
    expect(exec).toHaveBeenCalled();
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