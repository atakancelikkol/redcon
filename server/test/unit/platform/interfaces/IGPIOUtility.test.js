const IGPIOUtility = require('../../../../src/platform/interfaces/IGPIOUtility');

describe("IGPIOUtility interface test", () => {
  it("should throw error when calling methods directly", () => {
    const iGPIOUtility = new IGPIOUtility();
    expect(()=>{
      iGPIOUtility.open();
    }).toThrow(Error);
  });
});