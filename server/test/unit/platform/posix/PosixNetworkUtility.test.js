const PosixNetworkUtility = require('../../../../src/platform/posix/PosixNetworkUtility');
const DefaultData = require('../../../../src/dataStorage/DefaultData');

const networkInterfaces = [
  { name: 'eth0', ip: '10.0.0.10', mac: 'xx:xx:xx' },
  { name: 'eth1', ip: '192.168.0.10', mac: 'yy:yy:yy' },
];

const config = {
  ...DefaultData.networkConfiguration,
  networkInterfaces,
};

let execCommandString = '';
jest.mock('child_process', () => ({ exec: jest.fn((commandString, callback) => {
  execCommandString = commandString;
  callback('error', 'testStdOut', 'testStdError');
}) }));

describe('PosixNetworkUtility test', () => {
  test('applyNetworkConfiguration wrong configuration', async () => {
    execCommandString = '';
    const posixNetworkUtility = new PosixNetworkUtility();
    await posixNetworkUtility.applyNetworkConfiguration(config);
    expect(execCommandString).toBe('');
  });

  test('applyNetworkConfiguration with correct configuration', async () => {
    execCommandString = '';
    config.interfaceConfiguration.externalInterfaceName = 'eth0';
    config.interfaceConfiguration.internalInterfaceName = 'eth1';
    config.interfaceConfiguration.internalInterfaceSubnet = '192.168.0.0/16';
    const posixNetworkUtility = new PosixNetworkUtility();
    await posixNetworkUtility.applyNetworkConfiguration(config);
    expect(execCommandString.length).not.toBe(0);
  });

  test('removeNetworkConfiguration wrong configuration', async () => {
    execCommandString = '';
    config.interfaceConfiguration.externalInterfaceName = '';
    const posixNetworkUtility = new PosixNetworkUtility();
    await posixNetworkUtility.removeNetworkConfiguration(config);
    expect(execCommandString).toBe('');
  });

  test('removeNetworkConfiguration with correct configuration', async () => {
    execCommandString = '';
    config.interfaceConfiguration.externalInterfaceName = 'eth0';
    config.interfaceConfiguration.internalInterfaceName = 'eth1';
    config.interfaceConfiguration.internalInterfaceSubnet = '192.168.0.0/16';
    const posixNetworkUtility = new PosixNetworkUtility();
    await posixNetworkUtility.removeNetworkConfiguration(config);
    expect(execCommandString.length).not.toBe(0);
  });
});
