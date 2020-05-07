import Vue from 'vue'
import Vuex from 'vuex';
import WebSocketConnector from '../WebSocketConnector'

let webSocketConnector = null
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    receivedData: {},
    serialData: {},
    isConnected: true, // dont show a warning at the beginning
    user: null,
    authStatus: '',
    token: '',
  },
  actions: {
    onDataReceived({ commit/*, state, getters*/ }, data) {
      // handle exceptional cases before
      if(data.serialData) {
        commit('APPEND_SERIAL_DATA', data.serialData);
      } if(data.auth) {
        commit('SET_AUTH_DATA', data.auth);
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
    listFilesUSBDevice({ commit }, { path }) { // eslint-disable-line
      webSocketConnector.sendListFilesUSBDeviceMessage({ path });
    },
    deleteFileUSBDevice({ commit }, { path, fileName }) { // eslint-disable-line
      webSocketConnector.sendDeleteFileUSBDeviceMessage({ path, fileName });
    },
    getFileInfoUSBDevice({ commit }, { path, fileName }) { // eslint-disable-line
      commit('CLEAR_USB_FILE_INFO');
      webSocketConnector.sendGetFileInfoUSBDeviceMessage({ path, fileName });
    },
    createFolderUSBDevice({ commit }, { path, folderName }) { // eslint-disable-line
      webSocketConnector.sendCreateFolderUSBDeviceMessage({ path, folderName });
    },
    openSerialDevice({ commit }, { devicePath, baudRate }) { // eslint-disable-line
      webSocketConnector.sendOpenSerialDeviceMessage({ devicePath, baudRate });
    },
    loginUser({ commit }, { username, password }) { // eslint-disable-line
      webSocketConnector.sendLoginUserMessage({ username, password });
    },
    logoutUser({ commit }, { user }) { // eslint-disable-line
      webSocketConnector.sendLogoutUserMessage({user});
    },
    closeSerialDevice({ commit }, { devicePath }) { // eslint-disable-line
      webSocketConnector.sendCloseSerialDeviceMessage({ devicePath });
    },
    writeSerialDevice({ commit }, { devicePath, serialCmd }) { // eslint-disable-line
      webSocketConnector.sendWriteSerialDeviceMessage({ devicePath, serialCmd  });
    },
    writeKeySerialDevice({ commit }, { devicePath, keyCode, charCode, ctrlKey, shiftKey }) { // eslint-disable-line
      webSocketConnector.sendWriteKeySerialDeviceMessage({ devicePath, keyCode, charCode, ctrlKey, shiftKey  });
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
    resetPortMappingConfiguration({ commit },) { // eslint-disable-line
      webSocketConnector.sendResetPortMappingConfigurationMessage();
    },    
    updateConnectionStatus({ commit }, status) {
      commit('UPDATE_CONNECTION_STATUS', status)
    },
    rebootDevice({ commit },) { // eslint-disable-line
      webSocketConnector.sendRebootDeviceMessage();
    } 
  },
  mutations: {
    APPEND_PARTIAL_DATA(state, data) {
      state.receivedData = { ...state.receivedData, ...data };
    },
    APPEND_SERIAL_DATA(state, serialData) {
      if (state.serialData[serialData.path] == undefined) {
        Vue.set(state.serialData, serialData.path, "");
      }

      let currentData = state.serialData[serialData.path];
      let newData = currentData + serialData.data;
      const maxSize = 20000;
      if(newData.length > maxSize) {
        newData = newData.substr(newData.length - maxSize);
      }
      Vue.set(state.serialData, serialData.path, newData);
    },
    UPDATE_CONNECTION_STATUS(state, status) {
      state.isConnected = status;
    },
    CLEAR_USB_FILE_INFO(state) {
      state.receivedData.usb.currentFileInfo = undefined;
    },
    SET_AUTH_DATA(state, authData) {
      state.user = authData.user;
      state.authStatus = authData.authStatus;
      state.token = authData.token;
    },
  },
});

webSocketConnector = new WebSocketConnector({ store });
webSocketConnector.init();

export default store;