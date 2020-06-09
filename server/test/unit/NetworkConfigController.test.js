const NetworkConfigController = require('../../src/NetworkConfigController');
const PlatformObjects = require('../../src/platform/PlatformObjects');
const DataStorage = require('../../src/dataStorage/LowDBDataStorage');

const platformObjects = new PlatformObjects('mock');
const dataStorage = new DataStorage();
let lastSentObject;
const sendCallbackMock = jest.fn((controller, obj) => {
  lastSentObject = obj;
});

function createNetworkConfigController() {
  const controller = new NetworkConfigController();
  controller.registerSendMessageCallback(sendCallbackMock);
  controller.registerPlatformObjects(platformObjects);
  controller.registerDataStorage(dataStorage);
  controller.init();
  return controller;
}

beforeAll(async () => {
  await dataStorage.init();
});

describe('NetworkConfigController', () => {
  test('initial values', () => {
    const controller = createNetworkConfigController();
    expect(controller.name).toBe('NetworkConfigController');
    expect(controller.isAuthRequired()).toBe(true);

    const obj = {};
    controller.appendData(obj);
    expect(obj.networkConfig).toStrictEqual(dataStorage.getNetworkConfiguration());
  });

  test('empty handle message test', async () => {
    const controller = createNetworkConfigController();
    await controller.handleMessage({});
    expect(lastSentObject).toStrictEqual(undefined);

    await controller.handleMessage({ networkConfig: {} });
    expect(lastSentObject).toStrictEqual(undefined);
  });

  test('updateNetworkInterfaceConfiguration test', async () => {
    const controller = createNetworkConfigController();
    const action = 'updateNetworkInterfaceConfiguration';
    const configuration = { internalInterfaceName: 'testIntName', externalInterfaceName: 'testExtName' };
    await controller.handleMessage({ networkConfig: { action, configuration } });
    expect(lastSentObject.networkConfig.interfaceConfiguration).toStrictEqual(configuration);

    // wrong configuration
    const wrongConfiguration = { internalInterfaceName111: 'testIntName11', externalInterfaceName111: 'testExtName11' };
    await controller.handleMessage({ networkConfig: { action, configuration: wrongConfiguration } });
    expect(lastSentObject.networkConfig.interfaceConfiguration).toStrictEqual(configuration);
  });

  test('add/remove UdpExtToIntNetworkRule test', async () => {
    const controller = createNetworkConfigController();
    let action = 'addUdpExtToIntNetworkRule';
    const rule = { externalIp: 'extIP', externalPort: 'extPort', internalIp: 'intPort' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.udpExtToIntRules).toStrictEqual([rule]);
    const wrongRule = { externalIp1: 'extIP', externalPort2: 'extPort', internalIp3: 'intPort' };
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.udpExtToIntRules).toStrictEqual([rule]);

    action = 'removeUdpExtToIntNetworkRule';
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.udpExtToIntRules).toStrictEqual([rule]);
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.udpExtToIntRules).toStrictEqual([]);
  });

  test('add/remove UdpIntToExtNetworkRule test', async () => {
    const controller = createNetworkConfigController();
    let action = 'addUdpIntToExtNetworkRule';
    const rule = { internalIp: 'intIP', internalPort: 'intPort', externalIp: 'extIP' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.udpIntToExtRules).toStrictEqual([rule]);
    const wrongRule = { internalIp1: 'intIP', internalPort2: 'intPort', externalIp3: 'extIP' };
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.udpIntToExtRules).toStrictEqual([rule]);

    action = 'removeUdpIntToExtNetworkRule';
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.udpIntToExtRules).toStrictEqual([rule]);
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.udpIntToExtRules).toStrictEqual([]);
  });

  test('add/remove TcpExtToIntNetworkRule test', async () => {
    const controller = createNetworkConfigController();
    let action = 'addTcpExtToIntNetworkRule';
    const rule = { deviceExternalPort: 'extPort', internalIp: 'intIP', internalPort: 'intPort' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpExtToIntRules).toStrictEqual([rule]);
    const wrongRule = { deviceExternalPort1: 'extPort', internalIp2: 'intIP', internalPort3: 'intPort' };
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.tcpExtToIntRules).toStrictEqual([rule]);

    action = 'removeTcpExtToIntNetworkRule';
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.tcpExtToIntRules).toStrictEqual([rule]);
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpExtToIntRules).toStrictEqual([]);
  });

  test('add/remove TcpIntToExtNetworkRule test', async () => {
    const controller = createNetworkConfigController();
    let action = 'addTcpIntToExtNetworkRule';
    const rule = { deviceInternalPort: 'intPort', externalIp: 'extIP', externalPort: 'extPort' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([rule]);
    const wrongRule = { deviceInternalPort1: 'intPort', externalIp2: 'extIP', externalPort3: 'extPort' };
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([rule]);

    action = 'removeTcpIntToExtNetworkRule';
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([rule]);
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([]);
  });
});
