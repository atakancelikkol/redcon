const FileAsync = require('lowdb/adapters/FileAsync');
const LowDBDataStorage = require('../../../src/dataStorage/LowDBDataStorage');
const DefaultData = require('../../../src/dataStorage/DefaultData');

jest.mock('lowdb/adapters/FileAsync');

describe('LowDBDataStorage test', () => {
  test('db should be initialized with default data', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    expect(lowDBDataStorage.db).toBe(undefined);

    await lowDBDataStorage.init();
    expect(lowDBDataStorage.db).not.toBe(undefined);

    const configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration).toStrictEqual(DefaultData.networkConfiguration);
  });

  test('db should be created with file adapter', async () => {
    expect(FileAsync).toHaveBeenCalledTimes(0);
    const mockDB = LowDBDataStorage.createAdapter('production');
    expect(mockDB).not.toBe(undefined);
    expect(FileAsync).toHaveBeenCalledTimes(1);
  });
});

describe('LowDBDataStorage network configuration tests', () => {
  test('update network interface configuration', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    await lowDBDataStorage.init();
    const testObj = {
      internalInterfaceName: 'testInternalInterfaceName',
      externalInterfaceName: 'testExternalInterfaceName',
    };
    await lowDBDataStorage.updateNetworkInterfaceConfiguration(testObj);
    const configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.interfaceConfiguration).toStrictEqual(testObj);
  });

  test('add / remove udp external to internal network rule', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    await lowDBDataStorage.init();
    const testObj = { externalIp: 'externalTestIp', externalPort: '3333', internalIp: 'internalTestIp' };
    await lowDBDataStorage.addUdpExtToIntNetworkRule(testObj);

    let configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.udpExtToIntRules).toStrictEqual([testObj]);

    // try to add duplicate
    await lowDBDataStorage.addUdpExtToIntNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.udpExtToIntRules).toStrictEqual([testObj]);

    // try to remove it
    await lowDBDataStorage.removeUdpExtToIntNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.udpExtToIntRules).toStrictEqual([]);
  });

  test('add / remove udp internal to external network rule', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    await lowDBDataStorage.init();
    const testObj = { internalIp: 'internalTestIP', internalPort: '4444', externalIp: 'extIp' };
    await lowDBDataStorage.addUdpIntToExtNetworkRule(testObj);

    let configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.udpIntToExtRules).toStrictEqual([testObj]);

    // try to add duplicate
    await lowDBDataStorage.addUdpIntToExtNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.udpIntToExtRules).toStrictEqual([testObj]);

    // try to remove it
    await lowDBDataStorage.removeUdpIntToExtNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.udpIntToExtRules).toStrictEqual([]);
  });

  test('add / remove tcp external to internal network rule', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    await lowDBDataStorage.init();
    const testObj = { deviceExternalPort: '5555', internalIp: 'intIP', internalPort: '1234' };
    await lowDBDataStorage.addTcpExtToIntNetworkRule(testObj);

    let configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.tcpExtToIntRules).toStrictEqual([testObj]);

    // try to add duplicate
    await lowDBDataStorage.addTcpExtToIntNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.tcpExtToIntRules).toStrictEqual([testObj]);

    // try to remove it
    await lowDBDataStorage.removeTcpExtToIntNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.tcpExtToIntRules).toStrictEqual([]);
  });

  test('add / remove tcp internal to external network rule', async () => {
    const lowDBDataStorage = new LowDBDataStorage();
    await lowDBDataStorage.init();
    const testObj = { deviceInternalPort: '1111', externalIp: 'extIP', externalPort: '2222' };
    await lowDBDataStorage.addTcpIntToExtNetworkRule(testObj);

    let configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.tcpIntToExtRules).toStrictEqual([testObj]);

    // try to add duplicate
    await lowDBDataStorage.addTcpIntToExtNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.tcpIntToExtRules).toStrictEqual([testObj]);

    // try to remove it
    await lowDBDataStorage.removeTcpIntToExtNetworkRule(testObj);
    configuration = lowDBDataStorage.getNetworkConfiguration();
    expect(configuration.tcpIntToExtRules).toStrictEqual([]);
  });
});
