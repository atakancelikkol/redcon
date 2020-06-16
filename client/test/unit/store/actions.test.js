import actions from '../../../src/store/actions';
import webSocketConnector from '../../../src/WebSocketConnector';
import storageHelper from '../../../src/helpers/StorageHelper';

jest.mock('../../../src/WebSocketConnector'); // websocketConnector is now a mock constructor
jest.mock('../../../src/helpers/StorageHelper'); // StorageHelper is now a mock constructor

describe('store actions', () => {
  it('receiving auth data should call proper mutations', () => {
    const testAuthData = {
      auth: {
        user: 'test user',
        authStatus: true,
        token: 'test token',
      },
    };
    const mockCommit = jest.fn().mockName('mockCommit');

    actions.onDataReceived({ commit: mockCommit, state: { token: '123' } }, testAuthData);
    expect(mockCommit).toHaveBeenCalledWith('SET_AUTH_DATA', testAuthData.auth);
  });

  it('receiving serial data should call proper mutations', () => {
    const testSerialData = {
      serialData: {
        path: 'test_user',
        data: 5,
      },
    };
    const mockCommit = jest.fn().mockName('mockCommit');

    actions.onDataReceived({ commit: mockCommit, state: { token: '123' } }, testSerialData);
    expect(mockCommit).toHaveBeenCalledWith('APPEND_SERIAL_DATA', testSerialData.serialData);
  });

  it('receiving partial data should call proper mutations', () => {
    const testPartialData = 5;

    const mockCommit = jest.fn().mockName('mockCommit');

    actions.onDataReceived({ commit: mockCommit, state: { token: '123' } }, testPartialData);
    expect(mockCommit).toHaveBeenCalledWith('APPEND_PARTIAL_DATA', testPartialData);
  });


  it('change gpio port should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.changeGPIOPort({ commit: mockCommit }, { gpioPort: 8080, value: 6 });
    expect(webSocketConnector.sendGPIOUpdateMessage).toHaveBeenCalled();
  });

  it('toggle USB port should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.toggleUSBPort({ commit: mockCommit });
    expect(webSocketConnector.sendToggleUSBDeviceMessage).toHaveBeenCalled();
  });

  it('detect USB device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.detectUSBDevice({ commit: mockCommit });
    expect(webSocketConnector.sendDetectUSBDeviceMessage).toHaveBeenCalled();
  });

  it('list items USB device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.listItemsUSBDevice({ commit: mockCommit }, { path: 'test_path' });
    expect(webSocketConnector.sendListItemsUSBDeviceMessage).toHaveBeenCalled();
  });

  it('delete item USB device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.deleteItemUSBDevice({ commit: mockCommit }, { path: 'test_path', itemName: 'test_name' });
    expect(webSocketConnector.sendDeleteItemUSBDeviceMessage).toHaveBeenCalled();
  });

  it('get item info USB device should call proper function and mutation', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.getItemInfoUSBDevice({ commit: mockCommit }, { path: 'test_path', itemName: 'test_name' });
    expect(mockCommit).toHaveBeenCalledWith('CLEAR_USB_ITEM_INFO');
    expect(webSocketConnector.sendGetItemInfoUSBDeviceMessage).toHaveBeenCalled();
  });

  it('create folder USB device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.createFolderUSBDevice({ commit: mockCommit }, { path: 'test_path', folderName: 'test_name' });
    expect(webSocketConnector.sendCreateFolderUSBDeviceMessage).toHaveBeenCalled();
  });

  it('open serial device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.openSerialDevice({ commit: mockCommit }, { devicePath: 'test_devicepath', baudRate: 9600 });
    expect(webSocketConnector.sendOpenSerialDeviceMessage).toHaveBeenCalled();
  });

  it('login user should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.loginUser({ commit: mockCommit }, { username: 'test_username', password: 'test_password' });
    expect(webSocketConnector.sendLoginUserMessage).toHaveBeenCalled();
  });

  it('logout should call proper function', () => {
    const testUser = {
      username: 'test_name',
      password: 'test_password',
    };
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.logoutUser({ commit: mockCommit }, { user: testUser });
    expect(storageHelper.removeItem).toHaveBeenCalledWith('token');
    expect(webSocketConnector.sendLogoutUserMessage).toHaveBeenCalled();
  });

  it('close serial device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.closeSerialDevice({ commit: mockCommit }, { devicePath: 'test_path' });
    expect(webSocketConnector.sendCloseSerialDeviceMessage).toHaveBeenCalled();
  });

  it('write serial device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.writeSerialDevice({ commit: mockCommit }, { devicePath: 'test_path', serialCmd: 'test_cmd' });
    expect(webSocketConnector.sendWriteSerialDeviceMessage).toHaveBeenCalled();
  });

  it('write key serial device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.writeKeySerialDevice({ commit: mockCommit }, {
      devicePath: 'test_path', keyCode: 97, charCode: 63, ctrlKey: true, shiftKey: false,
    });
    expect(webSocketConnector.sendWriteKeySerialDeviceMessage).toHaveBeenCalled();
  });

  it('list serial devices should call proper function', () => {
    actions.listSerialDevices();
    expect(webSocketConnector.sendlistSerialDevicesMessage).toHaveBeenCalled();
  });

  it('update connection status should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const status = 'test_status';
    actions.updateConnectionStatus({ commit: mockCommit }, status);
    expect(mockCommit).toHaveBeenCalledWith('UPDATE_CONNECTION_STATUS', status);
  });

  it('reboot device should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    actions.rebootDevice({ commit: mockCommit });
    expect(webSocketConnector.sendRebootDeviceMessage).toHaveBeenCalled();
  });

  it('updateNetworkInterfaceConfiguration should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const configuration = {};
    actions.updateNetworkInterfaceConfiguration({ commit: mockCommit }, configuration);
    expect(webSocketConnector.sendUpdateNetworkInterfaceConfigurationMessege).toHaveBeenCalled();
  });

  it('addUdpExtToIntNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.addUdpExtToIntNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendAddUdpExtToIntNetworkRuleMessege).toHaveBeenCalled();
  });

  it('removeUdpExtToIntNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.removeUdpExtToIntNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendRemoveUdpExtToIntNetworkRuleMessege).toHaveBeenCalled();
  });

  it('addUdpIntToExtNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.addUdpIntToExtNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendAddUdpIntToExtNetworkRuleMessege).toHaveBeenCalled();
  });

  it('removeUdpIntToExtNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.removeUdpIntToExtNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendRemoveUdpIntToExtNetworkRuleMessege).toHaveBeenCalled();
  });

  it('addTcpExtToIntNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.addTcpExtToIntNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendAddTcpExtToIntNetworkRuleMessege).toHaveBeenCalled();
  });

  it('removeTcpExtToIntNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.removeTcpExtToIntNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendRemoveTcpExtToIntNetworkRuleMessege).toHaveBeenCalled();
  });

  it('addTcpIntToExtNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.addTcpIntToExtNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendAddTcpIntToExtNetworkRuleMessege).toHaveBeenCalled();
  });

  it('removeTcpIntToExtNetworkRule should call proper function', () => {
    const mockCommit = jest.fn().mockName('mockCommit');
    const rule = {};
    actions.removeTcpIntToExtNetworkRule({ commit: mockCommit }, rule);
    expect(webSocketConnector.sendRemoveTcpIntToExtNetworkRuleMessege).toHaveBeenCalled();
  });
});
