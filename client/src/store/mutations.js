import Vue from 'vue';

const mutations = {
  APPEND_PARTIAL_DATA(state, data) {
    state.receivedData = { ...state.receivedData, ...data };
  },
  APPEND_SERIAL_DATA(state, serialData) {
    if (state.serialData[serialData.path] === undefined) {
      Vue.set(state.serialData, serialData.path, '');
    }

    const currentData = state.serialData[serialData.path];
    let newData = currentData + serialData.data;
    const maxSize = 20000;
    if (newData.length > maxSize) {
      newData = newData.substr(newData.length - maxSize);
    }
    Vue.set(state.serialData, serialData.path, newData);
  },
  UPDATE_CONNECTION_STATUS(state, status) {
    state.isConnected = status;
  },
  CLEAR_USB_ITEM_INFO(state) {
    state.receivedData.usb.currentItemInfo = undefined;
  },
  SET_AUTH_DATA(state, authData) {
    state.user = authData.user;
    state.authStatus = authData.authStatus;
    state.token = authData.token;
  },
};

export default mutations;
