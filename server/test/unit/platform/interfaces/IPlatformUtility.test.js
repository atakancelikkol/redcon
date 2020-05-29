const IPlatformUtility = require('../../../../src/platform/interfaces/IPlatformUtility');

describe("IPlatformUtility interface test", () => {
  it("should throw error when calling methods directly", () => {
    const iPlatformUtility = new IPlatformUtility();
    expect(()=>{
      iPlatformUtility.rebootSystem();
    }).toThrow(Error);
  });
});