const MockGPIOUtility = require('../../../../src/platform/mock/MockGPIOUtility');

describe("MockGPIOUtility test", () => {
  it("open should return true", () => {
    const mockGPIOUtility = new MockGPIOUtility();
    expect(mockGPIOUtility.open()).toEqual(true);
  });
});