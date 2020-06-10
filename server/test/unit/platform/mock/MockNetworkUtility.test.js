const MockNetworkUtility = require('../../../../src/platform/mock/MockNetworkUtility');

describe('MockNetworkUtility test', () => {
  it('applyPortConfiguration should resolve withtout error', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.applyPortConfiguration()).resolves.toBe();
  });

  it('getNetworkInterfaces should resolve with mock interfaces', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.getNetworkInterfaces()).resolves.toStrictEqual(['mockEth0', 'mockEth1', 'mockEth2']);
  });

  it('applyNetworkConfiguration should resolve withtout error', () => {
    const mockNetworkUtility = new MockNetworkUtility();
    return expect(mockNetworkUtility.applyNetworkConfiguration()).resolves.toBe();
  });
});
