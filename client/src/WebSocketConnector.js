import ReconnectingWebSocket from 'reconnecting-websocket';
import StorageHelper from './helpers/StorageHelper';

class WebSocketConnector {
  constructor() {
    this.connectionSocket = null;
    this.store = undefined;
  }

  init() {
    console.log("initializing web socket connector"); // eslint-disable-line
    this.connectionSocket = new ReconnectingWebSocket(this.getWebSocketURL());
    this.connectionSocket.onopen = this.onOpen.bind(this);
    this.connectionSocket.onmessage = this.onMessage.bind(this);
    this.connectionSocket.onclose = this.onClose.bind(this);
  }

  getVuexPlugin() {
    return (store) => {
      // plugin callback
      this.registerStore(store);
    };
  }

  registerStore(store) {
    if (this.store) {
      throw new Error('store is already registered!');
    }

    this.store = store;
  }

  getWebSocketURL() {
    const loc = window.location;
    let newUri;
    if (loc.protocol === 'https:') {
      newUri = 'wss:';
    } else {
      newUri = 'ws:';
    }

    if (process.env.NODE_ENV === 'production') {
      newUri += `//${loc.host}`;
    } else {
      newUri += '//localhost:3000';
    }

    return newUri;
  }

  onOpen(/* event */) {
    this.store.dispatch('updateConnectionStatus', true);
    console.log("websocket connection is opened!") // eslint-disable-line
    this.sendStoredToken();
  }

  sendStoredToken() {
    const token = StorageHelper.getItem('token');
    if (token != null) {
      const obj = { auth: { action: 'checkStoredToken', storedToken: token } };
      this.connectionSocket.send(JSON.stringify(obj));
    }
  }

  onMessage(event) {
    const obj = JSON.parse(event.data);
    console.log("received data", obj) // eslint-disable-line
    this.store.dispatch('onDataReceived', obj);
  }

  onClose() {
    this.store.dispatch('updateConnectionStatus', false);
    console.log("websocket connection is closed!") // eslint-disable-line
  }

  sendGPIOUpdateMessage({ gpioPort, value }) {
    const obj = { gpio: { port: gpioPort, state: value } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendFetchPortMappingConfigurationMessage() {
    const obj = { portconfig: { action: 'readConfigFile' } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendSetPortMappingConfigurationMessage({ configContents }) {
    const obj = { portconfig: { action: 'setConfigFile', configContents } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendResetPortMappingConfigurationMessage() {
    const obj = { portconfig: { action: 'resetConfigFile' } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendOpenSerialDeviceMessage({ devicePath, baudRate }) {
    const obj = { serial: { action: 'openDevice', path: devicePath, baudRate } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendCloseSerialDeviceMessage({ devicePath }) {
    const obj = { serial: { action: 'closeDevice', path: devicePath } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendWriteSerialDeviceMessage({ devicePath, serialCmd }) {
    const obj = { serial: { action: 'writeDevice', path: devicePath, data: serialCmd } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendWriteKeySerialDeviceMessage({
    devicePath, keyCode, charCode, ctrlKey, shiftKey,
  }) {
    const obj = {
      serial: {
        action: 'writeKeyDevice', path: devicePath, keyCode, charCode, ctrlKey, shiftKey,
      },
    };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendLoginUserMessage({ username, password }) {
    const obj = { auth: { action: 'loginUser', username, password } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendLogoutUserMessage({ user }) {
    const obj = { auth: { action: 'logoutUser', username: user } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendlistSerialDevicesMessage() {
    const obj = { serial: { action: 'listDevices' } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendToggleUSBDeviceMessage() {
    const obj = { usb: { action: 'toggleDevice' } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendDetectUSBDeviceMessage() {
    const obj = { usb: { action: 'detectUsbDevice' } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendListItemsUSBDeviceMessage({ path }) {
    const obj = { usb: { action: 'listItems', path } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendDeleteItemUSBDeviceMessage({ path, itemName }) {
    const obj = { usb: { action: 'deleteItem', path, itemName } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendGetItemInfoUSBDeviceMessage({ path, itemName }) {
    const obj = { usb: { action: 'getItemInfo', path, itemName } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendCreateFolderUSBDeviceMessage({ path, folderName }) {
    const obj = { usb: { action: 'createFolder', path, folderName } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendRebootDeviceMessage() {
    const obj = { utility: { action: 'reboot' } };
    this.connectionSocket.send(JSON.stringify(obj));
  }
}

const webSocketConnector = new WebSocketConnector();
webSocketConnector.init();
export default webSocketConnector;
