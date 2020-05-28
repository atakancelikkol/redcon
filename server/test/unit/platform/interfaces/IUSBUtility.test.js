const IUSBUtility = require('../../../../src/platform/interfaces/IUSBUtility');

describe("IGPIOUtility interface test", () => {

  it("should throw error when calling methods directly", () => {
    const iUSBUtility = new IUSBUtility();
    expect(()=>{
      iUSBUtility.extractUsbState();
    }).toThrow(Error);
    expect(()=>{
      iUSBUtility.syncUsbDevice();
    }).toThrow(Error);
    expect(()=>{
      iUSBUtility.ejectUSBDriveSafely();
    }).toThrow(Error);

  });

});