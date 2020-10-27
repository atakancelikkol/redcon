import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import state from './state';
import mutations from './mutations';
import webSocketConnector from '../WebSocketConnector';

const webSocketPlugin = webSocketConnector.getVuexPlugin();

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [webSocketPlugin],
});

export default store;
