const MockNetworkUtility = require('../../../../src/platform/mock/MockNetworkUtility');

describe('MockNetworkUtility test', () => {
  it('applyNetworkConfiguration should resolve without error', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.applyNetworkConfiguration()).resolves.toBe();
  });

  it('removeNetworkConfiguration should resolve without error', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.removeNetworkConfiguration()).resolves.toBe();
  });
});
