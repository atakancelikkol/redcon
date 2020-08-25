import StorageHelper from '../helpers/StorageHelper';
import webSocketConnector from '../WebSocketConnector';

const actions = {
  onDataReceived({ commit, state/* , getters */ }, data) {
    // handle exceptional cases before
    if (data.serialData) {
      commit('APPEND_SERIAL_DATA', data.serialData);
    } if (data.auth) {
      commit('SET_AUTH_DATA', data.auth);
      if (state.token) {
        StorageHelper.setItem('token', state.token);
      }
    } else {
      commit('APPEND_PARTIAL_DATA', data);
    }
  },
  changeGPIOPort({ commit }, { gpioPort, value }) { // eslint-disable-line
    webSocketConnector.sendGPIOUpdateMessage({ gpioPort, value });
  },
  toggleUSBPort({ commit }) { // eslint-disable-line
    webSocketConnector.sendToggleUSBDeviceMessage();
  },
  detectUSBDevice({ commit }) { // eslint-disable-line
    webSocketConnector.sendDetectUSBDeviceMessage();
  },
  listItemsUSBDevice({ commit }, { path }) { // eslint-disable-line
    webSocketConnector.sendListItemsUSBDeviceMessage({ path });
  },
  deleteItemUSBDevice({ commit }, { path, itemName }) { // eslint-disable-line
    webSocketConnector.sendDeleteItemUSBDeviceMessage({ path, itemName });
  },
  getItemInfoUSBDevice({ commit }, { path, itemName }) { // eslint-disable-line
    commit('CLEAR_USB_ITEM_INFO');
    webSocketConnector.sendGetItemInfoUSBDeviceMessage({ path, itemName });
  },
  createFolderUSBDevice({ commit }, { path, folderName }) { // eslint-disable-line
    webSocketConnector.sendCreateFolderUSBDeviceMessage({ path, folderName });
  },
  formatUSBDevice({ commit }) { // eslint-disable-line
    webSocketConnector.sendFormatUSBDeviceMessage();
  },
  openSerialDevice({ commit }, { devicePath, baudRate }) { // eslint-disable-line
    webSocketConnector.sendOpenSerialDeviceMessage({ devicePath, baudRate });
  },
  registerUser({ commit }, { username, password }) { // eslint-disable-line
    webSocketConnector.sendRegisterUserMessage({ username, password });
  },
  loginUser({ commit }, { username, password }) { // eslint-disable-line
    webSocketConnector.sendLoginUserMessage({ username, password });
  },
  logoutUser({ commit }, { user }) { // eslint-disable-line
    StorageHelper.removeItem('token');
    webSocketConnector.sendLogoutUserMessage({ user });
  },
  closeSerialDevice({ commit }, { devicePath }) { // eslint-disable-line
    webSocketConnector.sendCloseSerialDeviceMessage({ devicePath });
  },
  writeSerialDevice({ commit }, { devicePath, serialCmd }) { // eslint-disable-line
    webSocketConnector.sendWriteSerialDeviceMessage({ devicePath, serialCmd });
  },
  writeKeySerialDevice({ commit }, { devicePath, keyCode, charCode, ctrlKey, shiftKey }) { // eslint-disable-line
    webSocketConnector.sendWriteKeySerialDeviceMessage({
      devicePath, keyCode, charCode, ctrlKey, shiftKey,
    });
  },
  listSerialDevices() {
    webSocketConnector.sendlistSerialDevicesMessage();
  },
  updateConnectionStatus({ commit }, status) {
    commit('UPDATE_CONNECTION_STATUS', status);
  },
  rebootDevice({ commit }, ) { // eslint-disable-line
    webSocketConnector.sendRebootDeviceMessage();
  },
  updateNetworkInterfaceConfiguration({ commit },  configuration ) { // eslint-disable-line
    webSocketConnector.sendUpdateNetworkInterfaceConfigurationMessage(configuration);
  },
  addUdpExtToIntNetworkRule({ commit },  rule ) { // eslint-disable-line
    webSocketConnector.sendAddUdpExtToIntNetworkRuleMessage(rule);
  },
  removeUdpExtToIntNetworkRule({ commit }, rule ) { // eslint-disable-line
    webSocketConnector.sendRemoveUdpExtToIntNetworkRuleMessage(rule);
  },
  addUdpIntToExtNetworkRule({ commit }, rule ) { // eslint-disable-line
    webSocketConnector.sendAddUdpIntToExtNetworkRuleMessage(rule);
  },
  removeUdpIntToExtNetworkRule({ commit },  rule ) { // eslint-disable-line
    webSocketConnector.sendRemoveUdpIntToExtNetworkRuleMessage(rule);
  },
  addTcpExtToIntNetworkRule({ commit },  rule ) { // eslint-disable-line
    webSocketConnector.sendAddTcpExtToIntNetworkRuleMessage(rule);
  },
  removeTcpExtToIntNetworkRule({ commit },  rule ) { // eslint-disable-line
    webSocketConnector.sendRemoveTcpExtToIntNetworkRuleMessage(rule);
  },
  addTcpIntToExtNetworkRule({ commit }, rule ) { // eslint-disable-line
    webSocketConnector.sendAddTcpIntToExtNetworkRuleMessage(rule);
  },
  removeTcpIntToExtNetworkRule({ commit },  rule ) { // eslint-disable-line
    webSocketConnector.sendRemoveTcpIntToExtNetworkRuleMessage(rule);
  },
};

export default actions;
