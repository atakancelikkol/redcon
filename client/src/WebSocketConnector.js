import ReconnectingWebSocket from 'reconnecting-websocket';

export default class WebSocketConnector {
  constructor({ store }) {
    this.connectionSocket = null;
    this.store = store;
  }

  init() {
    console.log("initializing web socket connector"); // eslint-disable-line
    this.connectionSocket = new ReconnectingWebSocket(this.getWebSocketURL());
    this.connectionSocket.onopen = this.onOpen.bind(this);
    this.connectionSocket.onmessage = this.onMessage.bind(this);
    this.connectionSocket.onclose = this.onClose.bind(this);
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
    let obj = { portconfig: {action: "setConfigFile", configContents} };
    this.connectionSocket.send(JSON.stringify(obj));
  }

  sendResetPortMappingConfigurationMessage() {
    let obj = { portconfig: {action: "resetConfigFile"} };
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

  sendlistSerialDevicesMessage() {
    var obj = { serial: { action: "listDevices" } };
    this.connectionSocket.send(JSON.stringify(obj));

  }

  sendUSBUpdateMessage({ device }) {
    var obj = { usb: { action: "changeDirection", device } };
    this.connectionSocket.send(JSON.stringify(obj));

  }

  sendUSBDetectMessage({ device }) {
    var obj = { usb: { action: "detectUsbDevice", device } };
    this.connectionSocket.send(JSON.stringify(obj));
  }

}


