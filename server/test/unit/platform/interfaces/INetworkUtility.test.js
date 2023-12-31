const INetworkUtility = require('../../../../src/platform/interfaces/INetworkUtility');

describe('INetworkUtility interface test', () => {
  it('applyNetworkConfiguration should throw error when calling methods directly', async () => {
    expect.assertions(1);

    const iNetworkUtility = new INetworkUtility();

    await iNetworkUtility.applyNetworkConfiguration().catch((e) => expect(e.toString()).toMatch(/Error/));
  });

  it('removeNetworkConfiguration should throw error when calling methods directly', async () => {
    expect.assertions(1);

    const iNetworkUtility = new INetworkUtility();

    await iNetworkUtility.removeNetworkConfiguration().catch((e) => expect(e.toString()).toMatch(/Error/));
  });
});
