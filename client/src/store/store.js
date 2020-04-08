import Vue from 'vue'
import Vuex from 'vuex';
import WebSocketConnector from '../WebSocketConnector'

let webSocketConnector = null
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    receivedData: {},
    isConnected: true, // dont show a warning at the beginning
  },
  actions: {
    onDataReceived({ commit/*, state, getters*/ }, data) {
      commit('APPEND_PARTIAL_DATA', data);
    },
    changeGPIOPort({commit}, {gpioPort, value}) { // eslint-disable-line
      webSocketConnector.sendGPIOUpdateMessage({gpioPort, value});
    },
    changeUSBPort({commit}, {value}) { // eslint-disable-line
      webSocketConnector.sendUSBUpdateMessage({value});
    },
    updateConnectionStatus({commit}, status) {
      commit('UPDATE_CONNECTION_STATUS', status)
    }
  },
  mutations: {
    APPEND_PARTIAL_DATA(state, data) {
      state.receivedData = {...state.receivedData, ...data};
    },
    UPDATE_CONNECTION_STATUS(state, status) {
      state.isConnected = status;
    },
  },
});

webSocketConnector = new WebSocketConnector({store});
webSocketConnector.init();

export default store;