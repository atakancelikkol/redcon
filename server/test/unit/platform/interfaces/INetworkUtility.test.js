const INetworkUtility = require('../../../../src/platform/interfaces/INetworkUtility');

describe("INetworkUtility interface test", () => {
  it("should throw error when calling methods directly", () => {
    const iNetworkUtility = new INetworkUtility();
    expect(()=>{
      iNetworkUtility.applyPortConfiguration();
    }).toThrow(Error);
  });
});