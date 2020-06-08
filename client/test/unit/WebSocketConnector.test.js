import StorageHelper from '../../src/helpers/StorageHelper';
import webSocketConnector from '../../src/WebSocketConnector';

let lastCalledActionString = '';
let lastCalledActionParameter;
const mockStore = {
  dispatch: (actionString, parameter) => {
    lastCalledActionString = actionString;
    lastCalledActionParameter = parameter;
  },
};

jest.mock('reconnecting-websocket');

describe('WebSocketConnector', () => {
  it('should initialize correctly.', () => {
    expect(webSocketConnector.connectionSocket).not.toBe(undefined);
    expect(typeof webSocketConnector.connectionSocket.onopen).toBe('function');
    expect(typeof webSocketConnector.connectionSocket.onmessage).toBe('function');
    expect(typeof webSocketConnector.connectionSocket.onclose).toBe('function');
  });

  it('checks vuex plugin.', () => {
    const vuexPluginFunction = webSocketConnector.getVuexPlugin();
    const registerSpy = jest.spyOn(webSocketConnector, 'registerStore');
    expect(webSocketConnector.store).toBe(undefined);
    vuexPluginFunction(mockStore);
    expect(registerSpy).toHaveBeenCalledWith(mockStore);
  });

  it('checks register store.', () => {
    expect(webSocketConnector.store).toBe(mockStore);
    expect(() => {
      webSocketConnector.registerStore(mockStore);
    }).toThrow('store is already registered!');
  });

  it('checks websocket url', () => {
    process.env.NODE_ENV = 'debug';
    delete window.location;
    window.location = {
      protocol: 'http:',
      host: 'testhost',
    };
    expect(webSocketConnector.getWebSocketURL()).toBe('ws://localhost:3000');

    process.env.NODE_ENV = 'production';
    expect(webSocketConnector.getWebSocketURL()).toBe('ws://testhost');

    window.location = {
      protocol: 'https:',
      host: 'testhost',
    };
    expect(webSocketConnector.getWebSocketURL()).toBe('wss://testhost');
  });

  it('checks onOpen handler.', () => {
    expect(lastCalledActionString).toBe('');
    expect(lastCalledActionParameter).toBe(undefined);

    const sendStoredTokenSpy = jest.spyOn(webSocketConnector, 'sendStoredToken');
    webSocketConnector.onOpen();

    expect(lastCalledActionString).toBe('updateConnectionStatus');
    expect(lastCalledActionParameter).toBe(true);
    expect(sendStoredTokenSpy).toHaveBeenCalled();
  });

  it('checks sendStoredToken', () => {
    StorageHelper.setItem('token', 'testdata');
    webSocketConnector.sendStoredToken();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"auth":{"action":"checkStoredToken","storedToken":"testdata"}}');
  });

  it('checks onMessage', () => {
    const mockEvent = {
      data: '{}',
    };

    webSocketConnector.onMessage(mockEvent);

    expect(lastCalledActionString).toBe('onDataReceived');
    expect(lastCalledActionParameter).toStrictEqual({});
  });

  it('checks onClose', () => {
    webSocketConnector.onClose();

    expect(lastCalledActionString).toBe('updateConnectionStatus');
    expect(lastCalledActionParameter).toBe(false);
  });

  it('checks sendGPIOUpdateMessage', () => {
    webSocketConnector.sendGPIOUpdateMessage({ gpioPort: 16070, value: 100 });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"gpio":{"port":16070,"state":100}}');
  });

  it('checks sendFetchPortMappingConfigurationMessage', () => {
    webSocketConnector.sendFetchPortMappingConfigurationMessage();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"portconfig":{"action":"readConfigFile"}}');
  });

  it('checks sendSetPortMappingConfigurationMessage', () => {
    webSocketConnector.sendSetPortMappingConfigurationMessage({ configContents: 'test_config' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"portconfig":{"action":"setConfigFile","configContents":"test_config"}}');
  });

  it('checks sendResetPortMappingConfigurationMessage', () => {
    webSocketConnector.sendResetPortMappingConfigurationMessage();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"portconfig":{"action":"resetConfigFile"}}');
  });

  it('checks sendOpenSerialDeviceMessage', () => {
    webSocketConnector.sendOpenSerialDeviceMessage({ devicePath: 'test_path', baudRate: 'test_baudRate' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"serial":{"action":"openDevice","path":"test_path","baudRate":"test_baudRate"}}');
  });

  it('checks sendCloseSerialDeviceMessage', () => {
    webSocketConnector.sendCloseSerialDeviceMessage({ devicePath: 'test_path' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"serial":{"action":"closeDevice","path":"test_path"}}');
  });

  it('checks sendWriteSerialDeviceMessage', () => {
    webSocketConnector.sendWriteSerialDeviceMessage({ devicePath: 'test_path', serialCmd: 'test_serialCmd' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"serial":{"action":"writeDevice","path":"test_path","data":"test_serialCmd"}}');
  });

  it('checks sendWriteKeySerialDeviceMessage', () => {
    webSocketConnector.sendWriteKeySerialDeviceMessage({
      devicePath: 'test_path', keyCode: '64', charCode: '95', ctrlKey: false, shiftKey: false,
    });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"serial":{"action":"writeKeyDevice","path":"test_path","keyCode":"64","charCode":"95","ctrlKey":false,"shiftKey":false}}');
  });

  it('checks sendLoginUserMessage', () => {
    webSocketConnector.sendLoginUserMessage({ username: 'test_userName', password: 'test_password' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"auth":{"action":"loginUser","username":"test_userName","password":"test_password"}}');
  });

  it('checks sendLogoutUserMessage', () => {
    const user = 'test_userName';
    webSocketConnector.sendLogoutUserMessage({ user });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"auth":{"action":"logoutUser","username":"test_userName"}}');
  });

  it('checks sendlistSerialDevicesMessage', () => {
    webSocketConnector.sendlistSerialDevicesMessage();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"serial":{"action":"listDevices"}}');
  });

  it('checks sendToggleUSBDeviceMessage', () => {
    webSocketConnector.sendToggleUSBDeviceMessage();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"usb":{"action":"toggleDevice"}}');
  });

  it('checks sendDetectUSBDeviceMessage', () => {
    webSocketConnector.sendDetectUSBDeviceMessage();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"usb":{"action":"detectUsbDevice"}}');
  });

  it('checks sendListItemsUSBDeviceMessage', () => {
    webSocketConnector.sendListItemsUSBDeviceMessage({ path: 'test_path' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"usb":{"action":"listItems","path":"test_path"}}');
  });

  it('checks sendDeleteItemUSBDeviceMessage', () => {
    webSocketConnector.sendDeleteItemUSBDeviceMessage({ path: 'test_path', itemName: 'test_itemName' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"usb":{"action":"deleteItem","path":"test_path","itemName":"test_itemName"}}');
  });

  it('checks sendGetItemInfoUSBDeviceMessage', () => {
    webSocketConnector.sendGetItemInfoUSBDeviceMessage({ path: 'test_path', itemName: 'test_itemName' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"usb":{"action":"getItemInfo","path":"test_path","itemName":"test_itemName"}}');
  });

  it('checks sendCreateFolderUSBDeviceMessage', () => {
    webSocketConnector.sendCreateFolderUSBDeviceMessage({ path: 'test_path', folderName: 'test_folderName' });
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"usb":{"action":"createFolder","path":"test_path","folderName":"test_folderName"}}');
  });

  it('checks sendRebootDeviceMessage', () => {
    webSocketConnector.sendRebootDeviceMessage();
    expect(webSocketConnector.connectionSocket.send).toHaveBeenCalledWith('{"utility":{"action":"reboot"}}');
  });
});
