const MockPlatformUtility = require('../../../../src/platform/mock/MockPlatformUtility');

describe("MockPlatformUtility test", () => {
  it("methods should be called without an error", () => {
    const mockPlatformtility = new MockPlatformUtility();
    expect(mockPlatformtility.rebootSystem()).toEqual(undefined);
  });
});