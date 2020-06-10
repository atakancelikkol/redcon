const INetworkUtility = require('../../../../src/platform/interfaces/INetworkUtility');

describe('INetworkUtility interface test', () => {
  it('should throw error when calling methods directly', async () => {
    expect.assertions(2);

    const iNetworkUtility = new INetworkUtility();
    expect(() => {
      iNetworkUtility.applyPortConfiguration();
    }).toThrow(Error);

    await iNetworkUtility.applyNetworkConfiguration().catch((e) => expect(e.toString()).toMatch(/Error/));
  });
});
