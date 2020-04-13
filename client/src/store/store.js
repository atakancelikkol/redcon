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
  },
  actions: {
    onDataReceived({ commit/*, state, getters*/ }, data) {
      // handle exceptional cases before
      if(data.serialData) {
        commit('APPEND_SERIAL_DATA', data.serialData);
      } else {
        commit('APPEND_PARTIAL_DATA', data);
      }
    },
    changeGPIOPort({ commit }, { gpioPort, value }) { // eslint-disable-line
      webSocketConnector.sendGPIOUpdateMessage({ gpioPort, value });
    },
    changeUSBPort({commit}, {device}) { // eslint-disable-line
      webSocketConnector.sendUSBUpdateMessage({device});
    },
    openSerialDevice({ commit }, { devicePath, baudRate }) { // eslint-disable-line
      webSocketConnector.sendOpenSerialDeviceMessage({ devicePath, baudRate });
    },
    closeSerialDevice({ commit }, { devicePath }) { // eslint-disable-line
      webSocketConnector.sendCloseSerialDeviceMessage({ devicePath });
    },
    writeSerialDevice({ commit }, { devicePath, serialCmd }) { // eslint-disable-line
      webSocketConnector.sendWriteSerialDeviceMessage({ devicePath, serialCmd  });
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
      const newData = currentData + serialData.data;
      Vue.set(state.serialData, serialData.path, newData);
    },
    UPDATE_CONNECTION_STATUS(state, status) {
      state.isConnected = status;
    },
  },
});

webSocketConnector = new WebSocketConnector({ store });
webSocketConnector.init();

export default store;