import ReconnectingWebSocket from 'reconnecting-websocket';
import StorageHelper from "./helpers/StorageHelper";

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
    return store => {
      // plugin callback
      this.registerStore(store);
    }
  }

  registerStore(store) {
    if(this.store) {
      throw "store is already registered!";
    }

    this.store = store;
  }

  getWebSocketURL() {
    let loc = window.location;
    let newUri;
    if (loc.protocol === "https:") {
      newUri = "wss:";
    } else {
      newUri = "ws:";
    }

    if (process.env.NODE_ENV == 'production') {
      newUri += "//" + loc.host;
    } else {
      newUri += "//localhost:3000";
    }

    return newUri;
  }

  onOpen(/*event*/) {
    this.store.dispatch('updateConnectionStatus', true);
    console.log("websocket connection is opened!") // eslint-disable-line
    this.sendStoredToken()
  }

  sendStoredToken() {
    let token = StorageHelper.getItem("token")
    if (token != null) {
      let obj = { auth: { action: "checkStoredToken", storedToken: token } };
      this.connectionSocket.send(JSON.stringify(obj));
    }
  }

  onMessage(event) {
    let obj = JSON.parse(event.data);
    console.log("received data", obj) // eslint-disable-line
    this.store.dispatch('onDataReceived', obj);
  }

  onClose() {
    this.store.dispatch('updateConnectionStatus', false);
    console.log("websocket connection is closed!") // eslint-disable-line
  }

  sendGPIOUpdateMessage({ gpioPort, value }) {
    let obj = { gpio: { port: gpioPort, state: value } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendFetchPortMappingConfigurationMessage() {
    let obj = { portconfig: { action: "readConfigFile" } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendSetPortMappingConfigurationMessage({ configContents }) {
    let obj = { portconfig: { action: "setConfigFile", configContents } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendResetPortMappingConfigurationMessage() {
    let obj = { portconfig: { action: "resetConfigFile" } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendOpenSerialDeviceMessage({ devicePath, baudRate }) {
    var obj = { serial: { action: "openDevice", path: devicePath, baudRate } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendCloseSerialDeviceMessage({ devicePath }) {
    var obj = { serial: { action: "closeDevice", path: devicePath } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendWriteSerialDeviceMessage({ devicePath, serialCmd }) {
    var obj = { serial: { action: "writeDevice", path: devicePath, data: serialCmd } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendWriteKeySerialDeviceMessage({ devicePath, keyCode, charCode, ctrlKey, shiftKey }) {
    var obj = { serial: { action: "writeKeyDevice", path: devicePath, keyCode, charCode, ctrlKey, shiftKey } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendLoginUserMessage({ username, password }) {
    var obj = { auth: { action: "loginUser", username, password } };
    this.connectionSocket.send(JSON.stringify(obj));
  }
  sendLogoutUserMessage({ user }) {
    var obj = { auth: { action: "logoutUser", username: user } };
    this.connectionSocket.send(JSON.stringify(obj));
  }
  
  sendlistSerialDevicesMessage() {
    var obj = { serial: { action: "listDevices" } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendToggleUSBDeviceMessage() {
    var obj = { usb: { action: "toggleDevice" } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendDetectUSBDeviceMessage() {
    var obj = { usb: { action: "detectUsbDevice" } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendListItemsUSBDeviceMessage({ path }) {
    var obj = { usb: { action: "listItems", path } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendDeleteItemUSBDeviceMessage({ path, itemName }) {
    var obj = { usb: { action: "deleteItem", path, itemName } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendGetItemInfoUSBDeviceMessage({ path, itemName }) {
    var obj = { usb: { action: "getItemInfo", path, itemName } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendCreateFolderUSBDeviceMessage({ path, folderName }) {
    var obj = { usb: { action: "createFolder", path, folderName } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendRebootDeviceMessage() {
    let obj = { utility: { action: "reboot" } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

}

const webSocketConnector = new WebSocketConnector();
webSocketConnector.init();
export default webSocketConnector;
