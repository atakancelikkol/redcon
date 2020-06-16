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
  fetchPortMappingConfiguration({ commit }) { // eslint-disable-line
    webSocketConnector.sendFetchPortMappingConfigurationMessage();
  },
  setPortMappingConfiguration({ commit }, { configContents }) { // eslint-disable-line
    webSocketConnector.sendSetPortMappingConfigurationMessage({ configContents });
  },
  resetPortMappingConfiguration({ commit }, ) { // eslint-disable-line
    webSocketConnector.sendResetPortMappingConfigurationMessage();
  },
  updateConnectionStatus({ commit }, status) {
    commit('UPDATE_CONNECTION_STATUS', status);
  },
  rebootDevice({ commit }, ) { // eslint-disable-line
    webSocketConnector.sendRebootDeviceMessage();
  },
};

export default actions;
