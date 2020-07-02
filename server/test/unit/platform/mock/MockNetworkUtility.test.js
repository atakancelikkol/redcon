const MockNetworkUtility = require('../../../../src/platform/mock/MockNetworkUtility');

describe('MockNetworkUtility test', () => {
  it('applyNetworkConfiguration should resolve withtout error', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.applyNetworkConfiguration()).resolves.toBe();
  });
});
