const IGPIOUtility = require('../../../../src/platform/interfaces/IGPIOUtility');

describe("IGPIOUtility interface test", () => {
  it("should throw error when calling methods directly", () => {
    const iGPIOUtility = new IGPIOUtility();
    expect(()=>{
      iGPIOUtility.openForOutput();
    }).toThrow(Error);

    expect(()=>{
      iGPIOUtility.openForInput();
    }).toThrow(Error);

    expect(()=>{
      iGPIOUtility.read();
    }).toThrow(Error);

    expect(()=>{
      iGPIOUtility.write();
    }).toThrow(Error);

    expect(()=>{
      iGPIOUtility.close();
    }).toThrow(Error);
  });
});