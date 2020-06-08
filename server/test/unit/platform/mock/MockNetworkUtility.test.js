const MockNetworkUtility = require('../../../../src/platform/mock/MockNetworkUtility');

describe('MockNetworkUtility test', () => {
  it('applyPortConfiguration should return true', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.applyPortConfiguration()).resolves.toBe();
  });
});
