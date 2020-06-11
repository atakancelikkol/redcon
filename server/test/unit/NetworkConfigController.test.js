const NetworkConfigController = require('../../src/NetworkConfigController');
const PlatformObjects = require('../../src/platform/PlatformObjects');
const DataStorage = require('../../src/dataStorage/LowDBDataStorage');

const platformObjects = new PlatformObjects('mock');
const dataStorage = new DataStorage();
let lastSentObject;
const sendCallbackMock = jest.fn((controller, obj) => {
  lastSentObject = obj;
});

jest.mock('os', () => ({
  networkInterfaces: jest.fn(() => ({
    enp0s8: [
      {
        address: '10.0.0.250',
        family: 'IPv4',
        mac: 'xx:xx:xx:xx:xx:xx',
      },
      {
        address: 'ipv6address',
        family: 'IPv6',
        mac: 'yy:yy:yy:yy:yy:yy',
      },
    ],
  })),
}));

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
    const defaultConfiguration = { ...dataStorage.getNetworkConfiguration() }; // copy configuration
    defaultConfiguration.networkInterfaces = [{ name: 'enp0s8', ip: '10.0.0.250', mac: 'xx:xx:xx:xx:xx:xx' }];
    expect(obj.networkConfig).toStrictEqual(defaultConfiguration);
  });

  test('empty handle message test', async () => {
    sendCallbackMock.mockClear();
    const controller = createNetworkConfigController();
    await controller.handleMessage({});
    expect(sendCallbackMock).toHaveBeenCalledTimes(1);

    await controller.handleMessage({ networkConfig: {} });
    expect(sendCallbackMock).toHaveBeenCalledTimes(1);
  });

  test('subnet check', async () => {
    const controller = createNetworkConfigController();
    expect(controller.parameterCheckIsSubNet()).toBe(false);
    expect(controller.parameterCheckIsSubNet('asd')).toBe(false);
    expect(controller.parameterCheckIsSubNet('asd/asd')).toBe(false);
    expect(controller.parameterCheckIsSubNet('10.0.0.1/')).toBe(false);
    expect(controller.parameterCheckIsSubNet('10.0.0.1/asd')).toBe(false);
    expect(controller.parameterCheckIsSubNet('10.0.0.1/-1')).toBe(false);
    expect(controller.parameterCheckIsSubNet('10.0.0.1/33')).toBe(false);
    expect(controller.parameterCheckIsSubNet('10.0.0.1/24')).toBe(true);
  });

  test('normalizeString check', async () => {
    const controller = createNetworkConfigController();
    expect(controller.normalizeString()).toBe('');
    expect(controller.normalizeString('test')).toBe('test');
    expect(controller.normalizeString('test$#.*+1-')).toBe('test 1 ');
    expect(controller.normalizeString('123456789012345678901234567890LONGSTRING')).toBe('123456789012345678901234567890');
  });

  test('updateNetworkInterfaceConfiguration test', async () => {
    const controller = createNetworkConfigController();
    const action = 'updateNetworkInterfaceConfiguration';
    const configuration = { internalInterfaceName: 'testIntName', externalInterfaceName: 'testExtName', internalInterfaceSubnet: '10.0.1.0/8' };
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
    const rule = { name: 'testRuleName', externalPort: '4444', internalIp: '10.0.0.20', internalPort: '5555' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.udpExtToIntRules).toStrictEqual([rule]);
    const wrongRule = { externalPort1: '2222', internalIp2: '10.0.0.20', internalPort3: '6666' };
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
    const rule = { name: 'testRuleName', internalPort: '5555', externalIp: '10.0.0.20', externalPort: '6666' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.udpIntToExtRules).toStrictEqual([rule]);
    const wrongRule = { internalPort1: '2323', externalIp2: '10.0.0.20', externalPort3: '7777' };
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
    const rule = { name: 'testRuleName', deviceExternalPort: '5555', internalIp: '10.0.0.120', internalPort: '6666' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpExtToIntRules).toStrictEqual([rule]);
    const wrongRule = { deviceExternalPort1: '4444', internalIp2: '10.0.0.120', internalPort3: '7777' };
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
    const rule = { name: 'testRuleName', deviceInternalPort: '5555', externalIp: '10.0.0.20', externalPort: '6666' };
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([rule]);
    const wrongRule = { deviceInternalPort1: '3333', externalIp2: '10.0.0.20', externalPort3: '7777' };
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([rule]);

    action = 'removeTcpIntToExtNetworkRule';
    await controller.handleMessage({ networkConfig: { action, rule: wrongRule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([rule]);
    await controller.handleMessage({ networkConfig: { action, rule } });
    expect(lastSentObject.networkConfig.tcpIntToExtRules).toStrictEqual([]);
  });
});
