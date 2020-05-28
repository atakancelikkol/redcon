const MockNetworkUtility = require('../../../../src/platform/mock/MockNetworkUtility');

describe("MockNetworkUtility test", () => {
  it("run should return true", () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.run()).resolves.toBe();
  });
});